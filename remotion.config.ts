/**
 * Remotion Configuration
 * 
 * Optimized for smaller GIF file sizes while maintaining quality.
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

// Output format
Config.setCodec('gif');

// PNG format required for transparency support
Config.setVideoImageFormat('png');

// Always overwrite existing output files
Config.setOverwriteOutput(true);

// Enable Tailwind CSS v4
Config.overrideWebpackConfig(enableTailwind);

// Performance optimizations for smaller GIF sizes:
// - Lower FPS (20) is set in src/config.ts
// - Shorter duration (8s) is set in src/config.ts
// - Reduced dimensions (450px) are set per composition in Root.tsx
