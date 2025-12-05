import { Queue, QueueEvents, Job } from 'bullmq';
import Redis from 'ioredis';
import { env } from '../config/env';

// Shared Redis connection
export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

// Queue names
export const RENDER_QUEUE = 'render-jobs';

// Job types
export interface RenderJobData {
  username: string;
  compositionId: string;
  theme: 'light' | 'dark';
  priority: 'high' | 'normal' | 'low';
  installationId?: number;
  triggeredBy: 'webhook' | 'api' | 'schedule';
  requestedAt: number;
}

export interface RenderJobResult {
  success: boolean;
  imageKey?: string;
  imageUrl?: string;
  error?: string;
  renderedAt: number;
  durationMs: number;
}

// Priority mapping
const PRIORITY_MAP = {
  high: 1,
  normal: 5,
  low: 10,
};

// Create the render queue
export const renderQueue = new Queue<RenderJobData, RenderJobResult>(RENDER_QUEUE, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      age: 86400, // Keep completed jobs for 24 hours
      count: 1000, // Keep last 1000 completed jobs
    },
    removeOnFail: {
      age: 604800, // Keep failed jobs for 7 days
    },
  },
});

// Queue events for monitoring
export const renderQueueEvents = new QueueEvents(RENDER_QUEUE, {
  connection: redis,
});

/**
 * Generate a unique job ID for deduplication
 */
function getJobId(username: string, compositionId: string): string {
  return `render:${username}:${compositionId}`;
}

/**
 * Add a render job to the queue
 */
export async function addRenderJob(data: RenderJobData): Promise<Job<RenderJobData, RenderJobResult>> {
  const jobId = getJobId(data.username, data.compositionId);

  // Check if job already exists and is pending/active
  const existingJob = await renderQueue.getJob(jobId);
  if (existingJob) {
    const state = await existingJob.getState();
    if (state === 'waiting' || state === 'active' || state === 'delayed') {
      console.log(`Job ${jobId} already in queue with state: ${state}`);
      return existingJob;
    }
  }

  const job = await renderQueue.add(data.compositionId, data, {
    jobId,
    priority: PRIORITY_MAP[data.priority],
  });

  console.log(`Added render job: ${jobId} with priority ${data.priority}`);
  return job;
}

/**
 * Add multiple render jobs for a user (e.g., on installation)
 */
export async function addBulkRenderJobs(
  username: string,
  compositionIds: string[],
  options: Partial<RenderJobData> = {}
): Promise<Job<RenderJobData, RenderJobResult>[]> {
  const jobs: Job<RenderJobData, RenderJobResult>[] = [];

  for (const compositionId of compositionIds) {
    const theme = compositionId.includes('light') ? 'light' : 'dark';
    const job = await addRenderJob({
      username,
      compositionId,
      theme,
      priority: options.priority || 'normal',
      installationId: options.installationId,
      triggeredBy: options.triggeredBy || 'api',
      requestedAt: Date.now(),
    });
    jobs.push(job);
  }

  return jobs;
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string): Promise<{
  state: string;
  progress: number;
  result?: RenderJobResult;
  failedReason?: string;
} | null> {
  const job = await renderQueue.getJob(jobId);
  if (!job) return null;

  const state = await job.getState();
  const progress = job.progress as number;

  return {
    state,
    progress,
    result: job.returnvalue || undefined,
    failedReason: job.failedReason,
  };
}

/**
 * Get pending jobs count
 */
export async function getQueueStats(): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}> {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    renderQueue.getWaitingCount(),
    renderQueue.getActiveCount(),
    renderQueue.getCompletedCount(),
    renderQueue.getFailedCount(),
    renderQueue.getDelayedCount(),
  ]);

  return { waiting, active, completed, failed, delayed };
}

/**
 * Clean up old jobs
 */
export async function cleanQueue(): Promise<void> {
  await renderQueue.clean(86400 * 1000, 1000, 'completed'); // Clean completed older than 24h
  await renderQueue.clean(604800 * 1000, 100, 'failed'); // Clean failed older than 7 days
}

/**
 * Pause the queue
 */
export async function pauseQueue(): Promise<void> {
  await renderQueue.pause();
}

/**
 * Resume the queue
 */
export async function resumeQueue(): Promise<void> {
  await renderQueue.resume();
}

/**
 * Close connections gracefully
 */
export async function closeQueue(): Promise<void> {
  await renderQueue.close();
  await renderQueueEvents.close();
  await redis.quit();
}

// Cache helpers using Redis directly
export const cache = {
  /**
   * Get cached image URL for a user's composition
   */
  async getImageUrl(username: string, compositionId: string): Promise<string | null> {
    const key = `cache:image:${username}:${compositionId}`;
    return await redis.get(key);
  },

  /**
   * Cache image URL for a user's composition
   */
  async setImageUrl(
    username: string,
    compositionId: string,
    url: string,
    ttlSeconds = 3600
  ): Promise<void> {
    const key = `cache:image:${username}:${compositionId}`;
    await redis.setex(key, ttlSeconds, url);
  },

  /**
   * Invalidate cached image URL
   */
  async invalidateImageUrl(username: string, compositionId: string): Promise<void> {
    const key = `cache:image:${username}:${compositionId}`;
    await redis.del(key);
  },

  /**
   * Invalidate all cached URLs for a user
   */
  async invalidateUser(username: string): Promise<void> {
    const pattern = `cache:image:${username}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};

