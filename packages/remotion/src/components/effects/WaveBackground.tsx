import { useCurrentFrame, useVideoConfig, interpolate, staticFile, Audio } from 'remotion';
import { useAudioData, visualizeAudioWaveform, createSmoothSvgPath } from '@remotion/media-utils';
import { Theme } from '../../config';
import { audioSettings } from '../../settings';

interface WaveBackgroundProps {
	theme?: Theme;
	className?: string;
	/** Override audio source from settings */
	audioSrc?: string;
	/** Window of audio to display in seconds */
	windowInSeconds?: number;
	/** Amplitude multiplier */
	amplitude?: number;
	/** Play audio during preview (default: true) */
	playAudio?: boolean;
	/** Audio volume 0-1 (default: 0.5) */
	volume?: number;
	/** Position at bottom with only top half visible (default: true) */
	bottomHalf?: boolean;
	/** Start offset in the audio file in seconds (default: 0) */
	audioStartFrom?: number;
}

// GitHub-themed color palettes - cohesive gradients
const waveColors = {
	dark: [
		'rgba(56, 139, 253, 0.6)',   // GitHub blue
		'rgba(110, 118, 255, 0.5)',  // Soft purple-blue
		'rgba(136, 146, 255, 0.45)', // Lighter purple
		'rgba(88, 166, 255, 0.4)',   // Sky blue
		'rgba(121, 192, 255, 0.35)', // Light cyan-blue
	],
	light: [
		'rgba(9, 105, 218, 0.35)',   // GitHub blue
		'rgba(68, 76, 231, 0.3)',    // Indigo
		'rgba(99, 102, 241, 0.25)',  // Soft purple
		'rgba(59, 130, 246, 0.2)',   // Lighter blue
		'rgba(96, 165, 250, 0.18)',  // Sky blue
	],
};

/**
 * Audio-reactive waveform visualization using actual waveform data
 * Subtle, cohesive waves that fit GitHub's aesthetic
 */
export function WaveBackground({
	theme = 'dark',
	className,
	audioSrc = audioSettings.audioSrc,
	windowInSeconds = 0.5,
	amplitude = 0.35, // Much smaller default
	playAudio = true,
	volume = 0.5,
	bottomHalf = true,
	audioStartFrom = audioSettings.startFrom,
}: WaveBackgroundProps) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const colors = waveColors[theme];

	// More transparent overall
	const maxOpacity = theme === 'dark' ? 0.5 : 0.4;
	const opacity = interpolate(frame, [10, 40], [0, maxOpacity], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	const svgWidth = 500;
	const svgHeight = 400;
	const centerY = svgHeight / 2;

	// Calculate number of samples based on window size
	const calculateNumberOfSamples = (windowSecs: number) => {
		const baseSampleCount = 2048;
		if (windowSecs <= 1) return baseSampleCount;
		const scaledSamples = Math.floor(baseSampleCount * windowSecs);
		return Math.min(Math.max(scaledSamples, 2048), 8192);
	};

	const numberOfSamples = calculateNumberOfSamples(windowInSeconds);
	const time = frame / fps;

	// Load audio data
	const audioFilePath = audioSrc ? staticFile(audioSrc.replace(/^\//, '')) : staticFile('demo-track.mp3');
	const audioData = useAudioData(audioFilePath);

	// Generate waveform path from real audio data
	const generateRealWaveformPath = (
		amplitudeMultiplier: number,
		phaseOffset: number,
		scaleY: number
	): string => {
		if (!audioData || !audioSettings.useRealAudio) {
			return generateFallbackPath(amplitudeMultiplier, phaseOffset, scaleY);
		}

		// Calculate frame with audio start offset
		const offsetFrame = frame + Math.floor(audioStartFrom * fps) + Math.floor(phaseOffset * fps * 0.05);
		
		const waveform = visualizeAudioWaveform({
			fps,
			frame: offsetFrame,
			audioData,
			numberOfSamples,
			windowInSeconds,
			channel: 0,
		});

		const points = waveform.map((y, i) => ({
			x: (i / (waveform.length - 1)) * svgWidth,
			y: centerY + y * (svgHeight / 2) * amplitude * amplitudeMultiplier * scaleY,
		}));

		return createSmoothSvgPath({ points });
	};

	// Fallback for when audio isn't loaded
	const generateFallbackPath = (
		amplitudeMultiplier: number,
		phaseOffset: number,
		scaleY: number
	): string => {
		const points: Array<{ x: number; y: number }> = [];
		const segments = 120;

		for (let i = 0; i <= segments; i++) {
			const x = (i / segments) * svgWidth;
			const normalizedX = i / segments;

			const wave1 = Math.sin(normalizedX * Math.PI * 3 + time * 2.5 + phaseOffset) * 0.5;
			const wave2 = Math.sin(normalizedX * Math.PI * 4.2 + time * 3 + phaseOffset) * 0.25;
			const wave3 = Math.sin(normalizedX * Math.PI * 2.8 + time * 2 + phaseOffset) * 0.35;

			const envelope = Math.sin(normalizedX * Math.PI) * 0.85 + 0.15;
			const combinedWave = (wave1 + wave2 + wave3) * envelope * amplitudeMultiplier;

			points.push({
				x,
				y: centerY + combinedWave * 20 * scaleY * amplitude,
			});
		}

		return createSmoothSvgPath({ points });
	};

	// Wave configurations - subtle variations
	const waves = [
		{ color: colors[0], amplitudeMultiplier: 1.0, phaseOffset: 0, scaleY: 0.9 },
		{ color: colors[1], amplitudeMultiplier: 0.9, phaseOffset: 0.6, scaleY: 0.85 },
		{ color: colors[2], amplitudeMultiplier: 0.95, phaseOffset: 1.2, scaleY: 1.0 },
		{ color: colors[3], amplitudeMultiplier: 0.85, phaseOffset: 1.8, scaleY: 0.8 },
		{ color: colors[4], amplitudeMultiplier: 1.05, phaseOffset: 2.4, scaleY: 0.9 },
	];

	return (
		<div
			className={className}
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: bottomHalf ? `-${svgHeight / 2}px` : 0,
				top: bottomHalf ? 'auto' : 0,
				height: svgHeight,
				overflow: 'hidden',
				opacity,
				pointerEvents: 'none',
			}}
		>
			{/* Audio playback for preview */}
			{playAudio && audioSrc && (
				<Audio 
					src={staticFile(audioSrc.replace(/^\//, ''))} 
					volume={volume}
					startFrom={Math.floor(audioStartFrom * fps)}
				/>
			)}
			<svg
				width="100%"
				height="100%"
				viewBox={`0 0 ${svgWidth} ${svgHeight}`}
				preserveAspectRatio="xMidYMid slice"
				style={{ position: 'absolute', inset: 0 }}
			>
				<defs>
					<filter id="waveBlur">
						<feGaussianBlur in="SourceGraphic" stdDeviation="2" />
					</filter>
					<filter id="waveGlow">
						<feGaussianBlur in="SourceGraphic" stdDeviation="5" />
					</filter>
				</defs>

				{waves.map((wave, i) => {
					const path = generateRealWaveformPath(
						wave.amplitudeMultiplier,
						wave.phaseOffset,
						wave.scaleY
					);

					return (
						<g key={i}>
							{/* Subtle glow layer */}
							<path
								d={path}
								fill="none"
								stroke={wave.color}
								strokeWidth="3"
								strokeLinecap="round"
								filter="url(#waveGlow)"
								opacity={0.4}
							/>
							{/* Main line */}
							<path
								d={path}
								fill="none"
								stroke={wave.color}
								strokeWidth="1.5"
								strokeLinecap="round"
								opacity={0.8}
							/>
						</g>
					);
				})}
			</svg>
		</div>
	);
}
