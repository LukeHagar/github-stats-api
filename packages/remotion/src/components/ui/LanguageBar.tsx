import { useCurrentFrame, interpolate } from 'remotion';
import { Theme, themes } from '../../config';
import { formatBytes, percentage } from '../../lib/utils';

interface LanguageBarProps {
	name: string;
	color: string | null;
	value: number;
	total: number;
	index?: number;
	theme?: Theme;
	showBytes?: boolean;
}

/**
 * Horizontal language bar with animated width
 */
export function LanguageBar({
	name,
	color,
	value,
	total,
	index = 0,
	theme = 'dark',
	showBytes = true,
}: LanguageBarProps) {
	const frame = useCurrentFrame();
	const themeColors = themes[theme];
	const delay = index * 4;

	const pct = percentage(value, total);
	const barWidth = interpolate(frame - delay, [0, 30], [0, pct], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
				opacity,
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<div
						style={{
							width: 20,
							height: 20,
							borderRadius: '50%',
							backgroundColor: color || themeColors.accent,
						}}
					/>
					<span style={{ fontSize: 24, color: themeColors.text, fontWeight: 500 }}>
						{name}
					</span>
				</div>
				<div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
					{showBytes && (
						<span style={{ fontSize: 22, color: themeColors.textMuted }}>
							{formatBytes(value)}
						</span>
					)}
					<span style={{ fontSize: 22, color: themeColors.textMuted, fontWeight: 500 }}>
						{pct.toFixed(1)}%
					</span>
				</div>
			</div>
			<div
				style={{
					height: 12,
					backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
					borderRadius: 6,
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						height: '100%',
						width: `${barWidth}%`,
						backgroundColor: color || themeColors.accent,
						borderRadius: 6,
					}}
				/>
			</div>
		</div>
	);
}

