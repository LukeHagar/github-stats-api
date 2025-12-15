import { useCurrentFrame } from 'remotion';
import { Theme, themes } from '../../config';
import { AnimatedCounter } from '../effects/AnimatedCounter';
import { fadeInAndSlideUp } from '../../lib/animations';

interface StatRowProps {
	icon?: React.ReactNode;
	label: string;
	value: number;
	index?: number;
	theme?: Theme;
	staggerDelay?: number;
	format?: 'commas' | 'short' | 'none';
}

/**
 * A single stat row with icon, label, and animated value
 */
export function StatRow({
	icon,
	label,
	value,
	index = 0,
	theme = 'dark',
	staggerDelay = 3,
	format = 'commas',
}: StatRowProps) {
	const frame = useCurrentFrame();
	const themeColors = themes[theme];
	const delay = index * staggerDelay;
	const animation = fadeInAndSlideUp(frame, delay);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: 16,
				...animation,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 16,
				}}
			>
				{icon && (
					<div style={{ color: themeColors.accent, width: 36, height: 36 }}>
						{icon}
					</div>
				)}
				<span
					style={{
						fontSize: 26,
						color: themeColors.text,
						whiteSpace: 'nowrap',
					}}
				>
					{label}
				</span>
			</div>
			<span
				style={{
					fontSize: 26,
					fontWeight: 600,
					color: themeColors.text,
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				<AnimatedCounter
					value={value}
					duration={2}
					startFrame={delay + 5}
					format={format}
				/>
			</span>
		</div>
	);
}

