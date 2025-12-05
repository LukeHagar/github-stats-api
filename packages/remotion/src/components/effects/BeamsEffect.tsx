import { useCurrentFrame, interpolate } from 'remotion';
import { Theme } from '../../config';
import { effectColors, animationTiming } from '../../settings';

interface BeamsEffectProps {
	theme?: Theme;
	className?: string;
}

/**
 * Sweeping light beams effect
 * Multiple beams sweep across the card at different speeds
 */
export function BeamsEffect({ theme = 'dark', className }: BeamsEffectProps) {
	const frame = useCurrentFrame();
	const colors = effectColors.beams[theme];

	// Fade in animation
	const opacity = interpolate(
		frame,
		[animationTiming.effectFadeStart, animationTiming.effectFadeEnd],
		[0, 1],
		{ extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
	);

	// Generate beam positions
	const beams = colors.map((color, i) => {
		const speed = 0.015 + i * 0.008;
		const cyclePosition = (frame * speed + i * 0.33) % 1;
		const x = cyclePosition * 150 - 25; // -25% to 125% for smooth entry/exit
		const angle = -15 + i * 10;
		const width = 80 + i * 30;

		return {
			color,
			x,
			angle,
			width,
			opacity: Math.sin(cyclePosition * Math.PI) * 0.8, // Fade at edges
		};
	});

	return (
		<div
			className={className}
			style={{
				position: 'absolute',
				inset: 0,
				overflow: 'hidden',
				opacity,
				pointerEvents: 'none',
			}}
		>
			{beams.map((beam, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: `${beam.x}%`,
						top: '-50%',
						width: beam.width,
						height: '200%',
						background: `linear-gradient(90deg, transparent 0%, ${beam.color} 50%, transparent 100%)`,
						transform: `rotate(${beam.angle}deg)`,
						opacity: beam.opacity,
						filter: 'blur(20px)',
					}}
				/>
			))}
		</div>
	);
}

