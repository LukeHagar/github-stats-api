import { Worker, Job } from 'bullmq';
import { redis, RENDER_QUEUE, RenderJobData, RenderJobResult, cache } from '../services/queue';
import { renderComposition, CompositionId, warmupBundle } from '../services/renderer';
import { ensureBucket } from '../services/storage';
import { fetchUserStats } from '../services/github';
import { env } from '../config/env';

console.log('🚀 Starting render worker...');

// Retry helper for service connections
async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; delayMs?: number; name?: string } = {}
): Promise<T> {
  const { maxRetries = 10, delayMs = 3000, name = 'operation' } = options;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.log(`${name} attempt ${attempt}/${maxRetries} failed: ${errorMsg}`);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.log(`Retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw new Error(`${name} failed after ${maxRetries} attempts`);
}

// Pre-warm on startup
async function initialize(): Promise<void> {
  console.log('Initializing worker services...');

  // Ensure MinIO bucket exists (with retries for startup timing)
  await withRetry(() => ensureBucket(), { name: 'MinIO connection' });
  console.log('✓ MinIO bucket ready');

  // Pre-warm Remotion bundle
  await warmupBundle();
  console.log('✓ Remotion bundle warmed up');

  console.log('Worker initialization complete');
}

// Process render jobs
const worker = new Worker<RenderJobData, RenderJobResult>(
  RENDER_QUEUE,
  async (job: Job<RenderJobData, RenderJobResult>) => {
    const { username, compositionId, installationId, triggeredBy } = job.data;
    const startTime = Date.now();

    console.log(`Processing job ${job.id}: ${compositionId} for ${username} (triggered by ${triggeredBy})`);

    try {
      // Update progress
      await job.updateProgress(10);

      // Fetch fresh user stats
      let userStats;
      try {
        userStats = await fetchUserStats(installationId, username);
        await job.updateProgress(30);
      } catch (error) {
        console.error(`Failed to fetch stats for ${username}:`, error);
        throw new Error(`Failed to fetch user stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Render the composition
      await job.updateProgress(40);

      const result = await renderComposition({
        compositionId: compositionId as CompositionId,
        userStats,
        username,
      });

      await job.updateProgress(90);

      if (!result.success) {
        throw new Error(result.error || 'Render failed');
      }

      // Cache the image URL
      if (result.imageUrl) {
        await cache.setImageUrl(username, compositionId, result.imageUrl, 3600);
      }

      await job.updateProgress(100);

      const durationMs = Date.now() - startTime;
      console.log(`✓ Completed job ${job.id} in ${durationMs}ms`);

      return {
        success: true,
        imageKey: result.imageKey,
        imageUrl: result.imageUrl,
        renderedAt: Date.now(),
        durationMs,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`✗ Failed job ${job.id}:`, errorMessage);

      return {
        success: false,
        error: errorMessage,
        renderedAt: Date.now(),
        durationMs: Date.now() - startTime,
      };
    }
  },
  {
    connection: redis,
    concurrency: env.RENDER_CONCURRENCY,
    limiter: {
      max: 10,
      duration: 60000, // 10 jobs per minute max
    },
  }
);

// Worker event handlers
worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result.success ? 'success' : 'failed');
});

worker.on('failed', (job, error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});

worker.on('error', (error) => {
  console.error('Worker error:', error);
});

worker.on('stalled', (jobId) => {
  console.warn(`Job ${jobId} stalled`);
});

// Graceful shutdown
async function shutdown(): Promise<void> {
  console.log('Shutting down worker...');

  await worker.close();
  await redis.quit();

  console.log('Worker shut down complete');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Initialize and start
initialize().catch((error) => {
  console.error('Worker initialization failed:', error);
  process.exit(1);
});

console.log(`Worker started with concurrency: ${env.RENDER_CONCURRENCY}`);

