import { interpolate, Easing } from 'remotion';

/**
 * Fade in and slide up animation
 */
export function fadeInAndSlideUp(frame: number, delay: number = 0) {
	const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
		easing: Easing.bezier(0.25, 0.1, 0.25, 1),
	});

	const y = interpolate(frame - delay, [0, 30], [30, 0], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
		easing: Easing.out(Easing.cubic),
	});

	return { opacity, transform: `translateY(${y}px)` };
}

/**
 * Fade in animation
 */
export function fadeIn(frame: number, delay: number = 0, duration: number = 20) {
	return interpolate(frame - delay, [0, duration], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
		easing: Easing.bezier(0.25, 0.1, 0.25, 1),
	});
}

/**
 * Scale in animation
 */
export function scaleIn(frame: number, delay: number = 0, duration: number = 25) {
	const scale = interpolate(frame - delay, [0, duration], [0.8, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
		easing: Easing.out(Easing.back(1.5)),
	});

	const opacity = interpolate(frame - delay, [0, duration * 0.6], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return { opacity, transform: `scale(${scale})` };
}

/**
 * Staggered delay calculator for list items
 */
export function staggerDelay(index: number, baseDelay: number = 0, stagger: number = 3): number {
	return baseDelay + index * stagger;
}

/**
 * Spring-like animation for numbers
 */
export function springNumber(
	frame: number,
	startFrame: number,
	duration: number,
	from: number,
	to: number
): number {
	const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
		easing: Easing.out(Easing.cubic),
	});

	return from + (to - from) * progress;
}

