import { useCurrentFrame, interpolate } from 'remotion';
import { Theme } from '../../config';
import { effectColors, animationTiming } from '../../settings';

interface SpotlightEffectProps {
	theme?: Theme;
	className?: string;
}

/**
 * Moving spotlight effect
 * A soft spotlight that moves across the card
 */
export function SpotlightEffect({ theme = 'dark', className }: SpotlightEffectProps) {
	const frame = useCurrentFrame();
	const color = effectColors.spotlight[theme];

	// Fade in animation
	const opacity = interpolate(
		frame,
		[animationTiming.effectFadeStart, animationTiming.effectFadeEnd],
		[0, 1],
		{ extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
	);

	// Spotlight movement - slow figure-8 pattern
	const t = frame * 0.02;
	const spotX = 50 + Math.sin(t) * 30;
	const spotY = 50 + Math.sin(t * 2) * 20;
	const spotSize = 200 + Math.sin(t * 0.5) * 50;

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
			<div
				style={{
					position: 'absolute',
					left: `${spotX}%`,
					top: `${spotY}%`,
					width: spotSize,
					height: spotSize,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
					transform: 'translate(-50%, -50%)',
					filter: 'blur(40px)',
				}}
			/>
			{/* Secondary smaller spotlight */}
			<div
				style={{
					position: 'absolute',
					left: `${100 - spotX}%`,
					top: `${100 - spotY}%`,
					width: spotSize * 0.6,
					height: spotSize * 0.6,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
					transform: 'translate(-50%, -50%)',
					filter: 'blur(30px)',
					opacity: 0.5,
				}}
			/>
		</div>
	);
}

