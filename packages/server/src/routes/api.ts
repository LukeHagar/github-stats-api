import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import {
  addRenderJob,
  addBulkRenderJobs,
  getJobStatus,
  getQueueStats,
  cache,
} from '../services/queue';
import {
  imageExists,
  getImageStream,
  getImageStats,
  getPublicUrl,
  getImageKey,
} from '../services/storage';
import { COMPOSITIONS, CompositionId } from '../services/renderer';

export const apiRoutes = new Hono();

// Validation schemas
const renderRequestSchema = z.object({
  username: z.string().min(1).max(39),
  compositionId: z.enum(COMPOSITIONS as unknown as [string, ...string[]]),
  priority: z.enum(['high', 'normal', 'low']).optional().default('normal'),
});

const bulkRenderRequestSchema = z.object({
  username: z.string().min(1).max(39),
  compositions: z.array(z.enum(COMPOSITIONS as unknown as [string, ...string[]])).optional(),
  theme: z.enum(['light', 'dark', 'all']).optional().default('all'),
  priority: z.enum(['high', 'normal', 'low']).optional().default('normal'),
});

// API documentation
apiRoutes.get('/', (c) => {
  return c.json({
    name: 'GitHub Stats API',
    version: '1.0.0',
    endpoints: {
      'GET /api/image/:username/:composition': {
        description: 'Get rendered GIF for a user',
        params: {
          username: 'GitHub username',
          composition: `One of: ${COMPOSITIONS.join(', ')}`,
        },
        query: {
          refresh: 'Set to "true" to force re-render',
        },
      },
      'POST /api/render': {
        description: 'Request a new render',
        body: {
          username: 'GitHub username',
          compositionId: 'Composition ID',
          priority: 'high | normal | low (optional)',
        },
      },
      'POST /api/render/bulk': {
        description: 'Request renders for multiple compositions',
        body: {
          username: 'GitHub username',
          compositions: 'Array of composition IDs (optional, defaults to all)',
          theme: 'light | dark | all (optional)',
          priority: 'high | normal | low (optional)',
        },
      },
      'GET /api/status/:jobId': {
        description: 'Check render job status',
        params: {
          jobId: 'Job ID returned from render request',
        },
      },
      'GET /api/queue': {
        description: 'Get queue statistics',
      },
      'GET /api/compositions': {
        description: 'List available compositions',
      },
    },
  });
});

// List available compositions
apiRoutes.get('/compositions', (c) => {
  const grouped = {
    readme: COMPOSITIONS.filter((id) => id.startsWith('readme-')),
    commitStreak: COMPOSITIONS.filter((id) => id.startsWith('commit-streak-')),
    topLanguages: COMPOSITIONS.filter((id) => id.startsWith('top-languages-')),
    contribution: COMPOSITIONS.filter((id) => id.startsWith('contribution-')),
    commitGraph: COMPOSITIONS.filter((id) => id.startsWith('commit-graph-')),
  };

  return c.json({
    total: COMPOSITIONS.length,
    compositions: COMPOSITIONS,
    grouped,
  });
});

// Get rendered image for a user
apiRoutes.get('/image/:username/:composition', async (c) => {
  const username = c.req.param('username');
  const composition = c.req.param('composition') as CompositionId;
  const refresh = c.req.query('refresh') === 'true';

  // Validate composition
  if (!COMPOSITIONS.includes(composition)) {
    return c.json(
      {
        error: 'Invalid composition',
        valid: COMPOSITIONS,
      },
      400
    );
  }

  const imageKey = getImageKey(username, composition);

  // Check cache first (unless refresh requested)
  if (!refresh) {
    const cachedUrl = await cache.getImageUrl(username, composition);
    if (cachedUrl) {
      // Redirect to cached URL
      return c.redirect(cachedUrl, 302);
    }
  }

  // Check if image exists in storage
  const exists = await imageExists(imageKey);

  if (exists && !refresh) {
    // Get image stats for caching headers
    const stats = await getImageStats(imageKey);

    // Stream the image directly
    const stream = await getImageStream(imageKey);

    // Cache the URL
    const publicUrl = getPublicUrl(imageKey);
    await cache.setImageUrl(username, composition, publicUrl, 3600);

    return new Response(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'public, max-age=3600',
        ...(stats?.etag && { ETag: stats.etag }),
        ...(stats?.lastModified && { 'Last-Modified': stats.lastModified.toUTCString() }),
      },
    });
  }

  // Image doesn't exist or refresh requested - queue a render
  const job = await addRenderJob({
    username,
    compositionId: composition,
    theme: composition.includes('light') ? 'light' : 'dark',
    priority: 'normal',
    triggeredBy: 'api',
    requestedAt: Date.now(),
  });

  // Return 202 Accepted with job info
  return c.json(
    {
      status: 'rendering',
      jobId: job.id,
      message: 'Image is being rendered. Check status at /api/status/:jobId',
      statusUrl: `/api/status/${job.id}`,
    },
    202
  );
});

// Request a single render
apiRoutes.post('/render', zValidator('json', renderRequestSchema), async (c) => {
  const { username, compositionId, priority } = c.req.valid('json');

  const job = await addRenderJob({
    username,
    compositionId,
    theme: compositionId.includes('light') ? 'light' : 'dark',
    priority,
    triggeredBy: 'api',
    requestedAt: Date.now(),
  });

  return c.json({
    success: true,
    jobId: job.id,
    statusUrl: `/api/status/${job.id}`,
  });
});

// Request bulk renders
apiRoutes.post('/render/bulk', zValidator('json', bulkRenderRequestSchema), async (c) => {
  const { username, compositions, theme, priority } = c.req.valid('json');

  let compositionsToRender: string[];

  if (compositions && compositions.length > 0) {
    compositionsToRender = compositions;
  } else if (theme === 'all') {
    compositionsToRender = [...COMPOSITIONS];
  } else {
    compositionsToRender = COMPOSITIONS.filter((id) => id.includes(theme));
  }

  const jobs = await addBulkRenderJobs(username, compositionsToRender, {
    priority,
    triggeredBy: 'api',
  });

  return c.json({
    success: true,
    jobCount: jobs.length,
    jobs: jobs.map((job) => ({
      id: job.id,
      compositionId: job.data.compositionId,
      statusUrl: `/api/status/${job.id}`,
    })),
  });
});

// Check job status
apiRoutes.get('/status/:jobId', async (c) => {
  const jobId = c.req.param('jobId');

  const status = await getJobStatus(jobId);

  if (!status) {
    return c.json({ error: 'Job not found' }, 404);
  }

  const response: Record<string, unknown> = {
    jobId,
    state: status.state,
    progress: status.progress,
  };

  if (status.result) {
    response.result = status.result;
    if (status.result.imageUrl) {
      response.imageUrl = status.result.imageUrl;
    }
  }

  if (status.failedReason) {
    response.error = status.failedReason;
  }

  return c.json(response);
});

// Get queue statistics
apiRoutes.get('/queue', async (c) => {
  const stats = await getQueueStats();

  return c.json({
    queue: 'render-jobs',
    stats,
  });
});

// Health check for API
apiRoutes.get('/health', (c) => {
  return c.json({ status: 'healthy' });
});
