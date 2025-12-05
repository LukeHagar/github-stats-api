import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Theme, themes } from '../../config';
import { oscilloscopeSettings } from '../../settings';

interface OscilloscopeProps {
	theme?: Theme;
	width?: number;
	height?: number;
	className?: string;
	opacity?: number;
}

/**
 * Oscilloscope-style waveform visualization
 * Designed to be a subtle easter egg in the background
 * Now with configurable settings and more realistic audio-like patterns
 */
export function Oscilloscope({
	theme = 'dark',
	width = oscilloscopeSettings.width,
	height = oscilloscopeSettings.height,
	className,
	opacity,
}: OscilloscopeProps) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const themeColors = themes[theme];
	
	const settings = oscilloscopeSettings;
	const finalOpacity = opacity ?? (theme === 'dark' ? settings.opacityDark : settings.opacityLight);

	// Generate realistic audio-like waveform path
	const generateWaveformPath = () => {
		const points: string[] = [];
		const segments = 80;
		const time = frame / fps;

		for (let i = 0; i <= segments; i++) {
			const x = (i / segments) * width;
			const normalizedX = i / segments;
			
			// Multiple frequencies for realistic audio feel
			const wave1 = Math.sin(normalizedX * Math.PI * settings.baseFrequency + time * settings.speed) * 0.5;
			const wave2 = Math.sin(normalizedX * Math.PI * settings.secondaryFrequency + time * settings.speed * 1.3) * 0.25;
			const wave3 = Math.sin(normalizedX * Math.PI * settings.tertiaryFrequency + time * settings.speed * 0.7) * 0.35;
			
			// Add some "beat" spikes for audio realism
			const beatPhase = (time * 2) % 1;
			const beatIntensity = Math.pow(Math.sin(normalizedX * Math.PI * 3 + beatPhase * Math.PI * 2), 4) * 0.3;
			
			// Envelope for natural audio shape
			const envelope = Math.sin(normalizedX * Math.PI) * 0.9 + 0.1;
			
			// Combine all waves
			const combinedWave = (wave1 + wave2 + wave3 + beatIntensity) * envelope * settings.amplitude;
			
			const y = height / 2 + combinedWave * (height / 2);
			
			if (i === 0) {
				points.push(`M ${x} ${y}`);
			} else {
				points.push(`L ${x} ${y}`);
			}
		}

		return points.join(' ');
	};

	const waveformPath = generateWaveformPath();

	// Fade in animation
	const fadeOpacity = interpolate(frame, [30, 60], [0, finalOpacity], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return (
		<div
			className={className}
			style={{
				width,
				height,
				opacity: fadeOpacity,
				filter: `blur(${settings.blur}px)`,
				pointerEvents: 'none',
			}}
		>
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				style={{ overflow: 'visible' }}
			>
				{/* Glow effect layer */}
				<path
					d={waveformPath}
					fill="none"
					stroke={themeColors.accent}
					strokeWidth={settings.glowStrokeWidth}
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{
						filter: `blur(${settings.glowBlur}px)`,
						opacity: 0.5,
					}}
				/>
				{/* Main waveform */}
				<path
					d={waveformPath}
					fill="none"
					stroke={themeColors.accent}
					strokeWidth={settings.strokeWidth}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
}

// Legacy export
export function MusicVisualizer(props: OscilloscopeProps) {
	return <Oscilloscope {...props} />;
}
