/**
 * Settings Configuration
 * 
 * Centralized configuration for animations, colors, and effects.
 * Modify these values to customize the visual appearance.
 */

// =============================================================================
// STATS DATA SOURCE
// =============================================================================

export const statsSettings = {
	/** Direct URL to fetch stats JSON (overrides username-based URL) */
	statsUrl: 'https://raw.githubusercontent.com/LukeHagar/stats/refs/heads/main/github-user-stats.json',
	/** Fallback: GitHub usernames to fetch stats for (used if statsUrl is empty) */
	usernames: ['LukeHagar'],
};

// =============================================================================
// OSCILLOSCOPE SETTINGS
// =============================================================================

export const oscilloscopeSettings = {
	/** Width of the oscilloscope in pixels */
	width: 200,
	/** Height of the oscilloscope in pixels */
	height: 100,
	/** Wave amplitude multiplier (higher = taller waves) */
	amplitude: 1.8,
	/** Base frequency of the primary wave */
	baseFrequency: 4,
	/** Secondary frequency for complexity */
	secondaryFrequency: 7,
	/** Tertiary frequency for detail */
	tertiaryFrequency: 2.5,
	/** Animation speed multiplier */
	speed: 3.5,
	/** Blur amount in pixels */
	blur: 3,
	/** Glow blur amount in pixels */
	glowBlur: 12,
	/** Opacity for dark theme (0-1) */
	opacityDark: 0.35,
	/** Opacity for light theme (0-1) */
	opacityLight: 0.25,
	/** Stroke width of the waveform */
	strokeWidth: 2.5,
	/** Glow stroke width */
	glowStrokeWidth: 6,
};

// =============================================================================
// AUDIO SETTINGS
// =============================================================================

export const audioSettings = {
	/** Path to audio file for real audio visualization */
	audioSrc: '/Breezeblocks.flac',
	/** Start offset in seconds (skip to a specific part of the song) */
	startFrom: 19,
	/** Number of frequency samples for audio analysis */
	numberOfSamples: 256,
	/** Enable audio-reactive mode */
	useRealAudio: true,
};

// =============================================================================
// ANIMATION TIMING
// =============================================================================

export const animationTiming = {
	/** Stagger delay between items in frames */
	staggerDelay: 4,
	/** Fade in duration in frames */
	fadeInDuration: 20,
	/** Slide up distance in pixels */
	slideUpDistance: 30,
	/** Counter animation duration in seconds */
	counterDuration: 2,
	/** Effect fade in start frame */
	effectFadeStart: 20,
	/** Effect fade in end frame */
	effectFadeEnd: 50,
};

// =============================================================================
// EFFECT COLORS
// =============================================================================

export const effectColors = {
	// Gemini ribbon colors
	gemini: ['#FFB7C5', '#FFDDB7', '#B1C5FF', '#4FABFF', '#076EFF'],
	
	// Aurora effect colors (for streak card)
	aurora: {
		dark: ['#FF6B35', '#FF8C42', '#FFD700', '#FFA500'],
		light: ['#FF4500', '#FF6347', '#FFB347', '#FFD700'],
	},
	
	// Grid dot colors
	gridDot: {
		dark: 'rgba(88, 166, 255, 0.15)',
		light: 'rgba(9, 105, 218, 0.12)',
	},
	
	// Beam colors
	beams: {
		dark: ['rgba(88, 166, 255, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(236, 72, 153, 0.2)'],
		light: ['rgba(9, 105, 218, 0.2)', 'rgba(99, 102, 241, 0.2)', 'rgba(219, 39, 119, 0.15)'],
	},
	
	// Spotlight color
	spotlight: {
		dark: 'rgba(88, 166, 255, 0.15)',
		light: 'rgba(9, 105, 218, 0.1)',
	},
	
	// Contribution graph colors (GitHub-style)
	contributionGraph: {
		dark: {
			empty: '#161b22',
			level1: '#0e4429',
			level2: '#006d32',
			level3: '#26a641',
			level4: '#39d353',
		},
		light: {
			empty: '#ebedf0',
			level1: '#9be9a8',
			level2: '#40c463',
			level3: '#30a14e',
			level4: '#216e39',
		},
	},
};

// =============================================================================
// CARD SETTINGS
// =============================================================================

export const cardSettings = {
	/** Border radius in pixels */
	borderRadius: 24,
	/** Padding in pixels */
	padding: 32,
	/** Outer margin/padding */
	outerPadding: 24,
	/** Backdrop blur amount */
	backdropBlur: 16,
	/** Background opacity for dark theme */
	bgOpacityDark: 0.15,
	/** Background opacity for light theme */
	bgOpacityLight: 0.2,
	/** Border opacity */
	borderOpacity: 0.3,
};

// =============================================================================
// COMMIT GRAPH SETTINGS
// =============================================================================

export const commitGraphSettings = {
	/** Number of weeks to show (GitHub shows 53 weeks for full year) */
	weeks: 53,
	/** Size of each square in pixels (GitHub uses ~11px, doubled for 2x resolution) */
	squareSize: 22,
	/** Gap between squares in pixels (GitHub uses 3px, doubled) */
	gap: 6,
	/** Border radius of squares (GitHub uses ~2px, doubled) */
	squareRadius: 4,
	/** Stagger delay per square in frames */
	revealStagger: 0.3,
};

