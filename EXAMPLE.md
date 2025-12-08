# GitHub Stats Cards - Kitchen Sink Example

This page showcases all available card variants. Each card comes in both light and dark themes for optimal GitHub profile display.

---

## Main README Cards

The main readme card shows comprehensive GitHub statistics with animated backgrounds. Choose from two background effect styles:

### Gemini Effect (Flowing Ribbons)

**Dark Theme - Gemini**
![Readme Dark Gemini](./out/readme-dark-gemini.gif)

**Light Theme - Gemini**
![Readme Light Gemini](./out/readme-light-gemini.gif)

### Wave Effect (Audio Visualizer Style)

**Dark Theme - Waves**
![Readme Dark Waves](./out/readme-dark-waves.gif)

**Light Theme - Waves**
![Readme Light Waves](./out/readme-light-waves.gif)

---

## Commit Streak Card

Track your daily contribution streak with the aurora-animated streak card.

**Dark Theme**
![Commit Streak Dark](./out/commit-streak-dark.gif)

**Light Theme**
![Commit Streak Light](./out/commit-streak-light.gif)

---

## Top Languages Card

Display your most-used programming languages with animated progress bars and pulsing dot grid effect.

**Dark Theme**
![Top Languages Dark](./out/top-languages-dark.gif)

**Light Theme**
![Top Languages Light](./out/top-languages-light.gif)

---

## Contribution Activity Card

Overview of your contribution frequency with sweeping beam effects.

**Dark Theme**
![Contribution Dark](./out/contribution-dark.gif)

**Light Theme**
![Contribution Light](./out/contribution-light.gif)

---

## Commit Graph Cards

GitHub-style contribution graph with 3 animation styles to choose from:

### Wave Animation (Diagonal Reveal)

**Dark Theme**
![Commit Graph Dark Wave](./out/commit-graph-dark-wave.gif)

**Light Theme**
![Commit Graph Light Wave](./out/commit-graph-light-wave.gif)

### Rain Animation (Falling Squares)

**Dark Theme**
![Commit Graph Dark Rain](./out/commit-graph-dark-rain.gif)

**Light Theme**
![Commit Graph Light Rain](./out/commit-graph-light-rain.gif)

### Cascade Animation (Column-by-Column)

**Dark Theme**
![Commit Graph Dark Cascade](./out/commit-graph-dark-cascade.gif)

**Light Theme**
![Commit Graph Light Cascade](./out/commit-graph-light-cascade.gif)

---

## Full Profile Example (Dark Theme)

Here's how to arrange multiple cards for a complete GitHub profile:

```markdown
# Hi there 👋

## GitHub Stats
![Stats](./out/readme-dark-gemini.gif)

## Contribution Activity
![Activity](./out/contribution-dark.gif)

## Commit Streak
![Streak](./out/commit-streak-dark.gif)

## Top Languages
![Languages](./out/top-languages-dark.gif)

## Contribution Graph
![Graph](./out/commit-graph-dark-wave.gif)
```

---

## Configuration

### Stats Data Source

Configure your stats URL in `src/settings.ts`:

```typescript
export const statsSettings = {
  // Direct URL to your stats JSON
  statsUrl: 'https://raw.githubusercontent.com/LukeHagar/stats/refs/heads/main/github-user-stats.json',
  // Fallback usernames (used if statsUrl is empty)
  usernames: ['LukeHagar'],
};
```

### GitHub Action

The included GitHub Action (`.github/workflows/render-stats.yml`) will:
- Run every 6 hours automatically
- Fetch fresh stats from your JSON URL
- Render all GIF compositions
- Commit the updated GIFs to the `out/` folder

## Rendering Commands

Generate all cards locally:

```bash
# Render all compositions
npx remotion render src/index.ts --codec gif

# Render specific composition
npx remotion render src/index.ts readme-dark-waves --codec gif
npx remotion render src/index.ts commit-graph-dark-rain --codec gif
```

---

## Available Compositions

| Composition ID | Description | Dimensions |
|----------------|-------------|------------|
| `readme-dark-gemini` | Main stats with Gemini effect (dark) | 450x320 |
| `readme-light-gemini` | Main stats with Gemini effect (light) | 450x320 |
| `readme-dark-waves` | Main stats with wave effect (dark) | 450x320 |
| `readme-light-waves` | Main stats with wave effect (light) | 450x320 |
| `commit-streak-dark` | Streak card (dark) | 450x200 |
| `commit-streak-light` | Streak card (light) | 450x200 |
| `top-languages-dark` | Languages card (dark) | 450x280 |
| `top-languages-light` | Languages card (light) | 450x280 |
| `contribution-dark` | Activity card (dark) | 450x140 |
| `contribution-light` | Activity card (light) | 450x140 |
| `commit-graph-dark-wave` | Graph with wave animation (dark) | 450x190 |
| `commit-graph-light-wave` | Graph with wave animation (light) | 450x190 |
| `commit-graph-dark-rain` | Graph with rain animation (dark) | 450x190 |
| `commit-graph-light-rain` | Graph with rain animation (light) | 450x190 |
| `commit-graph-dark-cascade` | Graph with cascade animation (dark) | 450x190 |
| `commit-graph-light-cascade` | Graph with cascade animation (light) | 450x190 |

---

## Deploying on Dokploy (Docker Compose Native)
- Services: API + worker (built from `packages/server/Dockerfile`), Redis, and MinIO on the same network.
- Health: set Dokploy health check path to `/health/ready`.
- Ports: map host → container `3029` for API; MinIO API `9000`, console `9001`.
- Required secrets: `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` (PEM with `\\n` escapes), `GITHUB_WEBHOOK_SECRET`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`.
- Other envs: `PUBLIC_URL` (public MinIO URL), `API_DOMAIN`, `MINIO_DOMAIN`, optional `REDIS_URL` (include password if enabled), `MINIO_BUCKET`, `MINIO_USE_SSL`, `RENDER_CONCURRENCY`.