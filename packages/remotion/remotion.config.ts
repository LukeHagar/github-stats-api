/**
 * Remotion Configuration
 *
 * Optimized for high-quality H.264 rendering, then converted to WebP via FFmpeg.
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { webpackOverride } from "./src/webpack-override";

// Keep scale consistent between Studio renders and server renders.
// The server uses packages/server/src/config/env.ts -> RENDER_SCALE.
const scaleFromEnv = Number(process.env.RENDER_SCALE ?? 1);
const scale =
  Number.isFinite(scaleFromEnv) && scaleFromEnv > 0 ? scaleFromEnv : 1;
Config.setScale(scale);

// Output format: H.264 for fast, high-quality rendering
Config.setCodec("h264");

// CRF (Constant Rate Factor): Lower = better quality (16-18 is high quality)
// Default is 18, we use 16 for maximum quality before WebP conversion
Config.setCrf(16);

// JPEG format for faster rendering (no transparency needed)
Config.setVideoImageFormat("jpeg");

// Always overwrite existing output files
Config.setOverwriteOutput(true);

// Enable Tailwind CSS v4
Config.overrideWebpackConfig(webpackOverride);

// Performance optimizations:
// - Lower FPS (20) is set in src/config.ts
// - Shorter duration (8s) is set in src/config.ts
// - Doubled dimensions (900px) are set per composition in Root.tsx
