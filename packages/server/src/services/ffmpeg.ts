import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { TEMP_DIR } from './renderer';

const execAsync = promisify(exec);

/**
 * Convert H.264 MP4 video to animated WebP using FFmpeg
 * 
 * @param videoBuffer - Input H.264 MP4 video as Buffer
 * @param options - Conversion options
 * @returns WebP buffer
 */
export async function convertVideoToWebP(
  videoBuffer: Buffer,
  options?: { quality?: number; fps?: number }
): Promise<Buffer> {
  const quality = options?.quality ?? 80;
  const fps = options?.fps ?? 20;

  // Create temporary file paths
  const inputPath = join(TEMP_DIR, `input-${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`);
  const outputPath = join(TEMP_DIR, `output-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`);

  try {
    // Write input video to temp file
    await writeFile(inputPath, videoBuffer);

    // FFmpeg command to convert MP4 to animated WebP
    // -i: input file
    // -vf "fps=20": set frame rate (matches Remotion)
    // -loop 0: enable looping
    // -quality 80: WebP quality (0-100)
    // -preset default: encoding preset
    // -an: remove audio
    // -vsync 0: passthrough timestamps
    // -y: overwrite output file
    const ffmpegCommand = `ffmpeg -i "${inputPath}" -vf "fps=${fps}" -loop 0 -quality ${quality} -preset default -an -vsync 0 -y "${outputPath}"`;

    console.log(`[ffmpeg] Converting MP4 to WebP: ${inputPath} -> ${outputPath}`);
    const { stderr } = await execAsync(ffmpegCommand);

    // FFmpeg outputs to stderr, check for errors
    if (stderr && stderr.includes('Error')) {
      throw new Error(`FFmpeg conversion failed: ${stderr}`);
    }

    // Read the output WebP file
    const webpBuffer = await readFile(outputPath);

    // Clean up temp files
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});

    console.log(`[ffmpeg] Conversion complete: ${webpBuffer.length} bytes`);
    return webpBuffer;
  } catch (error) {
    // Clean up temp files on error
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});

    if (error instanceof Error) {
      throw new Error(`Failed to convert video to WebP: ${error.message}`);
    }
    throw error;
  }
}

