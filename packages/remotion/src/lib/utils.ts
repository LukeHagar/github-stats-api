import { ClassValue, clsx } from 'clsx';
import { interpolate } from 'remotion';
import { twMerge } from 'tailwind-merge';
import { FPS } from '../config';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format bytes as human-readable text
 */
export function formatBytes(bytes: number): string {
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 B';
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatNumber(num: number): string {
	if (num >= 1_000_000_000) {
		return (num / 1_000_000_000).toFixed(1) + 'B';
	}
	if (num >= 1_000_000) {
		return (num / 1_000_000).toFixed(1) + 'M';
	}
	if (num >= 1_000) {
		return (num / 1_000).toFixed(1) + 'K';
	}
	return num.toString();
}

/**
 * Add commas to numbers for display
 */
export function addCommas(x: number | string): string {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate percentage
 */
export function percentage(partialValue: number, totalValue: number): number {
	if (totalValue === 0) return 0;
	return (100 * partialValue) / totalValue;
}

/**
 * Interpolate with delay and duration in seconds
 */
export function interpolateFactory(
	frame: number,
	delayInSeconds: number,
	durationInSeconds: number,
	finalOpacity: number = 1
): number {
	const delay = delayInSeconds * FPS;
	const duration = durationInSeconds * FPS + delay;
	return interpolate(frame, [delay, duration], [0, finalOpacity], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}

/**
 * Process frequency data for spectrum visualization
 */
export function processFrequencyData(
	frequencyData: number[],
	numberOfBars: number,
	options = {
		highFreqCutoff: 0.5,
		baseScale: 0.3,
		maxScale: 3.5,
	}
): number[] {
	const maxFreqIndex = Math.floor(frequencyData.length * options.highFreqCutoff);
	const frequencies = new Array(numberOfBars);
	const invNumBars = 1 / numberOfBars;
	const powerCache = new Array(numberOfBars);

	for (let i = 0; i < numberOfBars; i++) {
		const normalizedI = i * invNumBars;
		const power = 3 + normalizedI * 3;
		powerCache[i] = Math.pow(normalizedI, power);
	}

	let maxValue = 0.01;
	for (let i = 0; i < numberOfBars; i++) {
		const index = Math.min(
			Math.round(Math.pow(maxFreqIndex, i * invNumBars)),
			maxFreqIndex
		);
		const value = frequencyData[index];
		const normalizedI = i * invNumBars;
		const lowFreqBoost = Math.max(0.8, 1 - normalizedI * 0.3);
		const scale = (options.baseScale + powerCache[i] * options.maxScale) * lowFreqBoost;
		const power = 0.8 - normalizedI * 0.2;
		const freq = Math.pow(value * scale, power);
		frequencies[i] = freq;
		maxValue = Math.max(maxValue, freq);
	}

	const invMaxValue = 1 / maxValue;
	for (let i = 0; i < numberOfBars; i++) {
		const normalized = frequencies[i] * invMaxValue;
		frequencies[i] = Math.pow(normalized, 0.9);
	}

	return frequencies;
}

