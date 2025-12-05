import { useCurrentFrame, interpolate } from 'remotion';
import { Theme } from '../../config';
import { effectColors, animationTiming } from '../../settings';

interface GridDotEffectProps {
	theme?: Theme;
	className?: string;
	rows?: number;
	cols?: number;
}

/**
 * Animated grid dot pattern effect
 * Dots pulse subtly in waves across the grid
 */
export function GridDotEffect({
	theme = 'dark',
	className,
	rows = 12,
	cols = 20,
}: GridDotEffectProps) {
	const frame = useCurrentFrame();
	const baseColor = effectColors.gridDot[theme];

	// Fade in animation
	const opacity = interpolate(
		frame,
		[animationTiming.effectFadeStart, animationTiming.effectFadeEnd],
		[0, 1],
		{ extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
	);

	// Generate dots
	const dots: Array<{ x: number; y: number; opacity: number; scale: number }> = [];
	
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			// Create wave pattern across the grid
			const distance = Math.sqrt(
				Math.pow(col - cols / 2, 2) + Math.pow(row - rows / 2, 2)
			);
			const wave = Math.sin(frame * 0.08 - distance * 0.3) * 0.5 + 0.5;
			const dotOpacity = 0.3 + wave * 0.7;
			const dotScale = 0.8 + wave * 0.4;

			dots.push({
				x: (col / (cols - 1)) * 100,
				y: (row / (rows - 1)) * 100,
				opacity: dotOpacity,
				scale: dotScale,
			});
		}
	}

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
			<svg
				width="100%"
				height="100%"
				style={{ position: 'absolute', inset: 0 }}
			>
				{dots.map((dot, i) => (
					<circle
						key={i}
						cx={`${dot.x}%`}
						cy={`${dot.y}%`}
						r={2 * dot.scale}
						fill={baseColor}
						opacity={dot.opacity}
					/>
				))}
			</svg>
		</div>
	);
}

