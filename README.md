# GitHub Stats Remotion

Animated GitHub stats GIF cards for your profile, powered by [Remotion](https://remotion.dev).

<div align="center">
  <img alt="Readme Dark Gemini" width="400px" src="./out/readme-dark-gemini.gif" />
  <img alt="Commit Graph Dark Wave" width="400px" src="./out/commit-graph-dark-wave.gif" />
</div>

## Features

- **5 Card Types** — Readme stats, commit streak, top languages, contribution activity, and commit graph
- **Light & Dark Themes** — Match your GitHub profile aesthetic
- **Animated Effects** — Gemini ribbons, wave visualizer, aurora, grid dots, and more
- **Auto-updating** — GitHub Action renders fresh GIFs every 6 hours
- **Customizable** — Tweak colors, timing, and effects via settings

## Quick Start

**Install dependencies**

```bash
bun install
```

**Start the Remotion Studio preview**

```bash
bun dev
```

**Render all GIFs**

```bash
bun run render:all
```

**Render a specific composition**

```bash
npx remotion render src/index.ts readme-dark-gemini out/readme-dark-gemini.gif --codec gif
```

## Configuration

### Stats Data Source

Configure your stats URL in `src/settings.ts`:

```typescript
export const statsSettings = {
  // Direct URL to your stats JSON
  statsUrl: 'https://raw.githubusercontent.com/YourUsername/stats/main/github-user-stats.json',
  // Fallback usernames (used if statsUrl is empty)
  usernames: ['YourUsername'],
};
```

The stats JSON should match the schema expected by the cards. See `src/config.ts` for the full `UserStats` type definition.

### Customization

All visual settings are centralized in `src/settings.ts`:

- **Animation timing** — Stagger delays, fade durations, counter speed
- **Effect colors** — Gemini ribbons, aurora, grid dots, beams, contribution graph
- **Card settings** — Border radius, padding, backdrop blur
- **Commit graph** — Weeks to show, square size, gap, reveal speed

## GitHub Action

The included workflow (`.github/workflows/render-stats.yml`) automates GIF generation:

- Runs every 6 hours on a schedule
- Triggers on push to `main`
- Can be manually triggered via workflow dispatch
- Fetches fresh stats and renders all compositions
- Commits updated GIFs to the `out/` folder

## Available Cards

| Card | Variants | Description |
|------|----------|-------------|
| **Readme** | `readme-{dark,light}-{gemini,waves}` | Main stats with animated background |
| **Commit Streak** | `commit-streak-{dark,light}` | Current and longest streak with aurora effect |
| **Top Languages** | `top-languages-{dark,light}` | Language breakdown with animated bars |
| **Contribution** | `contribution-{dark,light}` | Activity overview with beam effects |
| **Commit Graph** | `commit-graph-{dark,light}-{wave,rain,cascade}` | GitHub-style contribution grid |

See [EXAMPLE.md](./EXAMPLE.md) for a full visual gallery of all card variants.

## Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start Remotion Studio |
| `bun run build` | Bundle for production |
| `bun run render` | Render default composition |
| `bun run render:all` | Render all compositions |
| `bun run upgrade` | Upgrade Remotion |
| `bun run lint` | Run ESLint and TypeScript checks |

## Project Structure

```
src/
├── components/
│   ├── cards/          # Card components (ReadmeCard, CommitStreakCard, etc.)
│   ├── effects/        # Visual effects (AuroraEffect, GeminiEffect, etc.)
│   ├── icons/          # Icon components
│   └── ui/             # Reusable UI components
├── data/
│   ├── defaultStats.ts # Default/fallback stats data
│   └── fetchers.ts     # Stats fetching utilities
├── lib/
│   ├── animations.ts   # Animation utilities
│   └── utils.ts        # Helper functions
├── styles/
│   └── global.css      # Global styles
├── config.ts           # Zod schemas and type definitions
├── settings.ts         # Customizable settings
├── Root.tsx            # Remotion composition definitions
└── index.ts            # Entry point
```

## License

See [LICENSE](./LICENSE) for details.
