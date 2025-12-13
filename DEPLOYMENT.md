# Deployment Environment Variables Guide

## Overview

This guide lists all environment variables required for deploying the GitHub Stats API on Dokploy.

## External URLs Required

Two services need external domains configured in Dokploy:

1. **API Service** (port 3029)
   - **Domain Variable**: `API_DOMAIN`
   - **Example**: `api.githubstats.example.com`
   - **Purpose**: Public API endpoint for serving images and handling webhooks

2. **MinIO Storage** (port 9000)
   - **Domain Variable**: `MINIO_DOMAIN`
   - **Example**: `storage.githubstats.example.com`
   - **Purpose**: Direct access to rendered GIF files stored in MinIO

## Required Environment Variables

### Domain Configuration (Dokploy)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `API_DOMAIN` | ✅ Yes | External domain for the API service | `api.githubstats.example.com` |
| `MINIO_DOMAIN` | ✅ Yes | External domain for MinIO storage | `storage.githubstats.example.com` |

### GitHub App Configuration

| Variable | Required | Secret | Description | Example |
|----------|----------|--------|-------------|---------|
| `GITHUB_APP_ID` | ✅ Yes | No | Your GitHub App ID (numeric) | `123456` |
| `GITHUB_APP_PRIVATE_KEY` | ✅ Yes | ✅ Yes | GitHub App private key (PEM format, include `\n` as literal newlines) | `-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----` |
| `GITHUB_WEBHOOK_SECRET` | ✅ Yes | ✅ Yes | Webhook secret configured in GitHub App settings | `your-webhook-secret-here` |

### MinIO Storage Configuration

| Variable | Required | Secret | Default | Description |
|----------|----------|--------|---------|-------------|
| `MINIO_ACCESS_KEY` | ✅ Yes | ✅ Yes | - | MinIO access key (root user) |
| `MINIO_SECRET_KEY` | ✅ Yes | ✅ Yes | - | MinIO secret key (root password) |
| `PUBLIC_URL` | ✅ Yes | No | - | **External HTTPS URL** for serving images (must match `MINIO_DOMAIN` with `https://`) |
| `MINIO_ENDPOINT` | ❌ No | No | `github-stats-minio` | Internal MinIO hostname (must match Dokploy service name: `github-stats-minio`) |
| `MINIO_PORT` | ❌ No | No | `9000` | Internal MinIO port |
| `MINIO_BUCKET` | ❌ No | No | `github-stats` | Bucket name for storing rendered GIFs |
| `MINIO_USE_SSL` | ❌ No | No | `false` | Use SSL for internal MinIO connections (usually `false` inside cluster) |

**Important**: When using Dokploy's service definitions, `MINIO_ENDPOINT` must match the service name in `dokploy.yml` (`github-stats-minio`), not a generic `minio` hostname.

### Redis Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_URL` | ❌ No | `redis://github-stats-redis:6379` | Redis connection URL (include password if enabled: `redis://:password@github-stats-redis:6379`) |

### Rendering Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RENDER_CONCURRENCY` | ❌ No | `2` | Number of concurrent render jobs per worker |
| `RENDER_TIMEOUT_MS` | ❌ No | `120000` (worker), `60000` (API) | Maximum time for a render job in milliseconds |

## Deployment modes (Dokploy)

### Mode A: Docker Compose app + external Dokploy-managed Redis/MinIO (recommended)

In this mode, Dokploy deploys your app from `docker-compose.yml`, but **Redis and MinIO are separate Dokploy-managed services**.

- **App services** (in `docker-compose.yml`): `api`, `worker`
- **External services** (separate Dokploy services you create): `github-stats-redis`, `github-stats-minio`

Set these to point the app at the separate services:

- `REDIS_URL=redis://github-stats-redis:6379`
- `MINIO_ENDPOINT=github-stats-minio`
- `MINIO_PORT=9000`
- `MINIO_USE_SSL=false`

### Mode B: Docker Compose includes Redis/MinIO (single stack)

In this mode, `docker-compose.yml` defines and runs `redis` and `minio` inside the same compose project.

- Internal hostnames become `redis` and `minio`
- You should not point `MINIO_ENDPOINT` at an external domain

## Complete Environment Variables Setup

### Step 1: Configure Domains in Dokploy

In your Dokploy project settings, configure:

1. **API Domain**: Set `API_DOMAIN` environment variable
   - This will automatically map to the API service on port 3029
   - Example: `api.yourdomain.com`

2. **MinIO Domain**: Set `MINIO_DOMAIN` environment variable
   - This will automatically map to MinIO on port 9000
   - Example: `storage.yourdomain.com`

### Step 2: Set Required Secrets

Set these as **secret** environment variables in Dokploy:

```bash
# GitHub App
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your-webhook-secret-here

# MinIO Credentials
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key
```

### Step 3: Set Public URL

**Critical**: Set `PUBLIC_URL` to match your MinIO domain with HTTPS:

```bash
PUBLIC_URL=https://storage.yourdomain.com
```

⚠️ **Important**: 
- Must use `https://` (not `http://`)
- Must match your `MINIO_DOMAIN` value
- This is where rendered GIFs will be publicly accessible
- The API may redirect clients to this URL for cached images

### Step 4: Optional Configuration

If you need to customize defaults:

```bash
# Redis (if using password or different host)
REDIS_URL=redis://:password@github-stats-redis:6379

# MinIO (if using different bucket name)
MINIO_BUCKET=my-custom-bucket

# Rendering (adjust based on server capacity)
RENDER_CONCURRENCY=4
RENDER_TIMEOUT_MS=180000
```

## Port Mapping Summary

| Service | Internal Port | External Domain | Purpose |
|---------|--------------|-----------------|---------|
| API | 3029 | `API_DOMAIN` | API endpoints, health checks, webhooks |
| MinIO | 9000 | `MINIO_DOMAIN` | Direct access to stored GIF files |
| Redis | 6379 | Internal only | Job queue and caching (no external access needed) |

## Verification Checklist

After deployment, verify:

- [ ] `API_DOMAIN` is accessible and returns API documentation at `/api/docs`
- [ ] `MINIO_DOMAIN` is accessible (may require authentication for console)
- [ ] `PUBLIC_URL` is set to `https://` version of `MINIO_DOMAIN`
- [ ] All secret variables are marked as secrets in Dokploy
- [ ] GitHub App webhook URL points to `https://${API_DOMAIN}/webhooks/github`
- [ ] Health check endpoint works: `https://${API_DOMAIN}/health/ready`

## Example Complete Configuration

```bash
# Domains (configure in Dokploy domain settings)
API_DOMAIN=api.githubstats.example.com
MINIO_DOMAIN=storage.githubstats.example.com

# Public URL (must be HTTPS and match MinIO domain)
PUBLIC_URL=https://storage.githubstats.example.com

# GitHub App (secrets)
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GITHUB_WEBHOOK_SECRET=webhook-secret-123

# MinIO (secrets)
MINIO_ACCESS_KEY=minio-access-key-abc123
MINIO_SECRET_KEY=minio-secret-key-xyz789

# Optional (using defaults)
# REDIS_URL=redis://github-stats-redis:6379
# MINIO_ENDPOINT=github-stats-minio
# MINIO_PORT=9000
# MINIO_BUCKET=github-stats
# MINIO_USE_SSL=false
# RENDER_CONCURRENCY=2
```

## Troubleshooting

### API returns 503 on `/health/ready`
- Check that Redis is accessible at `REDIS_URL`
- Check that MinIO is accessible at `MINIO_ENDPOINT:MINIO_PORT`
- Verify bucket exists (API creates it automatically on startup)

### Images not accessible
- Verify `PUBLIC_URL` is set to HTTPS URL matching `MINIO_DOMAIN`
- Check MinIO bucket policy allows public read access
- Verify `MINIO_DOMAIN` DNS points to your Dokploy server

### GitHub webhooks failing
- Verify webhook URL in GitHub App settings: `https://${API_DOMAIN}/webhooks/github`
- Check `GITHUB_WEBHOOK_SECRET` matches GitHub App configuration
- Verify `GITHUB_APP_PRIVATE_KEY` is correctly formatted (include `\n` as literal newlines)

### Redis eviction policy warning
- **Warning**: `Eviction policy is allkeys-lru. It should be "noeviction"`
- **Impact**: BullMQ works with `allkeys-lru`, but `noeviction` is recommended for job queues to prevent job loss under memory pressure
- **Solution**: Configure Redis eviction policy in Dokploy's Redis service settings:
  - Set `maxmemory-policy` to `noeviction`
  - This ensures jobs are never evicted from Redis, preventing data loss
  - Note: This may require configuring Redis via Dokploy's Redis service configuration options

