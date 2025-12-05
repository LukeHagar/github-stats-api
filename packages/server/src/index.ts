import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { env } from './config/env';
import { apiRoutes } from './routes/api';
import { webhookRoutes } from './routes/webhooks';
import { healthRoutes } from './routes/health';

const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', secureHeaders());
app.use(
  '*',
  cors({
    origin: '*', // Allow embedding in any README
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 86400,
  })
);

// Error handling
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: env.NODE_ENV === 'development' ? err.message : undefined,
    },
    500
  );
});

// Not found handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Mount routes
app.route('/health', healthRoutes);
app.route('/api', apiRoutes);
app.route('/webhooks', webhookRoutes);

// Root route
app.get('/', (c) => {
  return c.json({
    name: 'GitHub Stats API',
    version: '1.0.0',
    docs: '/api',
  });
});

// Start server
const port = env.PORT;
console.log(`🚀 Server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};

