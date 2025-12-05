import { Hono } from 'hono';
import { Webhooks } from '@octokit/webhooks';
import { env } from '../config/env';
import { addBulkRenderJobs } from '../services/queue';
import { deleteUserImages } from '../services/storage';
import { COMPOSITIONS } from '../services/renderer';

export const webhookRoutes = new Hono();

// Initialize webhook handler with secret
const webhooks = new Webhooks({
  secret: env.GITHUB_WEBHOOK_SECRET,
});

// Helper to get login from account (handles user vs org)
function getAccountLogin(account: unknown): string | null {
  if (!account || typeof account !== 'object') return null;
  if ('login' in account && typeof (account as { login?: string }).login === 'string') {
    return (account as { login: string }).login;
  }
  return null;
}

// Handle installation created - queue initial renders
webhooks.on('installation.created', async ({ payload }) => {
  const username = getAccountLogin(payload.installation.account);
  if (!username) {
    console.error('Installation created but no account login found');
    return;
  }

  console.log(`GitHub App installed by: ${username}`);
  const installationId = payload.installation.id;

  // Queue renders for all compositions
  try {
    const jobs = await addBulkRenderJobs(username, [...COMPOSITIONS], {
      installationId,
      triggeredBy: 'webhook',
      priority: 'high',
    });

    console.log(`Queued ${jobs.length} render jobs for ${username}`);
  } catch (error) {
    console.error(`Failed to queue render jobs for ${username}:`, error);
  }
});

// Handle installation deleted - cleanup user images
webhooks.on('installation.deleted', async ({ payload }) => {
  const username = getAccountLogin(payload.installation.account);
  if (!username) {
    console.error('Installation deleted but no account login found');
    return;
  }

  console.log(`GitHub App uninstalled by: ${username}`);

  try {
    await deleteUserImages(username);
    console.log(`Cleaned up images for ${username}`);
  } catch (error) {
    console.error(`Failed to cleanup images for ${username}:`, error);
  }
});

// Handle push events - optionally trigger re-renders
webhooks.on('push', async ({ payload }) => {
  // Only trigger on pushes to default branch
  const defaultBranch = payload.repository.default_branch;
  const pushedBranch = payload.ref.replace('refs/heads/', '');

  if (pushedBranch !== defaultBranch) {
    return;
  }

  const username = payload.repository.owner?.login;
  if (username) {
    console.log(`Push to ${defaultBranch} by ${username}`);
  }

  // Optionally queue re-renders on push (can be rate-limited)
  // For now, we'll just log it - users can manually trigger via API
});

// Main webhook endpoint
webhookRoutes.post('/github', async (c) => {
  const signature = c.req.header('x-hub-signature-256');
  const eventName = c.req.header('x-github-event');
  const deliveryId = c.req.header('x-github-delivery');

  if (!signature || !eventName) {
    return c.json({ error: 'Missing required headers' }, 400);
  }

  const body = await c.req.text();

  // Verify webhook signature
  try {
    const isValid = await webhooks.verify(body, signature);
    if (!isValid) {
      console.warn(`Invalid webhook signature for delivery ${deliveryId}`);
      return c.json({ error: 'Invalid signature' }, 401);
    }
  } catch (error) {
    console.error('Signature verification error:', error);
    return c.json({ error: 'Signature verification failed' }, 401);
  }

  // Process the webhook
  try {
    // Use verifyAndReceive which handles the type correctly
    await webhooks.verifyAndReceive({
      id: deliveryId || 'unknown',
      name: eventName as 'push' | 'installation',
      signature,
      payload: body,
    });

    return c.json({ received: true, event: eventName });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

// Webhook health check / verification endpoint (for GitHub App setup)
webhookRoutes.get('/github', (c) => {
  return c.json({
    status: 'ready',
    message: 'GitHub webhook endpoint is ready',
  });
});
