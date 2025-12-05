import { useCurrentFrame, useVideoConfig, random } from 'remotion';
import { addCommas } from '../../lib/utils';

interface AnimatedCounterProps {
	value: number;
	duration?: number;
	startFrame?: number;
	delay?: number;
	format?: 'commas' | 'short' | 'none';
}

/**
 * Animated counter that reveals digits with a scramble effect
 */
export function AnimatedCounter({
	value,
	duration = 2,
	startFrame = 0,
	delay = 0,
	format = 'commas',
}: AnimatedCounterProps) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const targetValue = Math.abs(value).toString();

	const animationStartFrame = startFrame;
	const animationEndFrame = animationStartFrame + duration * fps;
	const finalEndFrame = animationEndFrame + delay * fps;

	// Format the final value
	const formatValue = (val: string): string => {
		const num = parseInt(val, 10);
		if (format === 'short') {
			if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
			if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
			return val;
		}
		if (format === 'commas') {
			return addCommas(val);
		}
		return val;
	};

	// Before animation starts
	if (frame < animationStartFrame) {
		return <span>0</span>;
	}

	// After everything is complete
	if (frame >= finalEndFrame) {
		return <span>{formatValue(targetValue)}</span>;
	}

	// During scramble delay period
	if (frame >= animationEndFrame) {
		const displayValue = targetValue
			.split('')
			.map((digit, index) => {
				if (index < targetValue.length - 1) {
					return digit;
				}
				// Use deterministic random based on frame and index for consistent renders
				return Math.floor(random(`scramble-${frame}-${index}`) * 10);
			})
			.join('');
		return <span>{formatValue(displayValue)}</span>;
	}

	// During main animation
	const progress = (frame - animationStartFrame) / (duration * fps);
	const digitsToShow = Math.floor(progress * targetValue.length);

	const displayValue = targetValue
		.split('')
		.map((digit, index) => {
			if (index < digitsToShow) {
				return digit;
			}
			// Use deterministic random based on frame and index for consistent renders
			return Math.floor(random(`digit-${frame}-${index}`) * 10);
		})
		.join('');

	return <span>{formatValue(displayValue)}</span>;
}

