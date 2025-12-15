interface IconProps {
	size?: number;
	color?: string;
	className?: string;
}

export function StarIcon({ size = 20, color = 'currentColor', className }: IconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function ForkIcon({ size = 20, color = 'currentColor', className }: IconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="6" cy="6" r="3" stroke={color} strokeWidth="2" />
			<circle cx="18" cy="6" r="3" stroke={color} strokeWidth="2" />
			<circle cx="12" cy="18" r="3" stroke={color} strokeWidth="2" />
			<path
				d="M6.01221 9C6.11299 11.4506 6.87561 12 9.65202 12H14.348C17.1244 12 17.887 11.4506 17.9878 9"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path d="M12 15V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export function CommitIcon({ size = 20, color = 'currentColor', className }: IconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
			<path d="M3 12L9 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
			<path d="M15 12L21 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export function PullRequestIcon({ size = 20, color = 'currentColor', className }: IconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="6" cy="6" r="3" stroke={color} strokeWidth="2" />
			<circle cx="6" cy="18" r="3" stroke={color} strokeWidth="2" />
			<circle cx="18" cy="18" r="3" stroke={color} strokeWidth="2" />
			<path
				d="M12 6C14.8284 6 16.2426 6 17.1213 6.87868C18 7.75736 18 9.17157 18 12V15"
				stroke={color}
				strokeWidth="2"
			/>
			<path
				d="M15 3L12.0605 5.93945C12.0271 5.97289 12.0271 6.02711 12.0605 6.06055L15 9"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path d="M6 15V9" stroke={color} strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export function ContributionIcon({ size = 20, color = 'currentColor', className }: IconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 2L12 22"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M17 7L12 2L7 7"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4 14H8"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M16 14H20"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M4 18H8"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M16 18H20"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function CodeIcon({ size = 20, color = 'currentColor', className }: IconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16 18L22 12L16 6"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8 6L2 12L8 18"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function FireIcon({ size = 20, color = 'currentColor', className }: IconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 22C16.4183 22 20 18.4183 20 14C20 11.5 19 9.5 17.5 8C16.5 7 16 5.5 16 4C16 4 14 6 12 6C10 6 8 4 8 4C8 5.5 7.5 7 6.5 8C5 9.5 4 11.5 4 14C4 18.4183 7.58172 22 12 22Z"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 18C13.6569 18 15 16.6569 15 15C15 14 14.5 13 14 12.5C13.5 12 12 11 12 11C12 11 10.5 12 10 12.5C9.5 13 9 14 9 15C9 16.6569 10.3431 18 12 18Z"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function ViewIcon({ size = 20, color = 'currentColor', className }: IconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
		</svg>
	);
}

export function MusicIcon({ size = 20, color = 'currentColor', className }: IconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M9 18V5L21 3V16"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="6" cy="18" r="3" stroke={color} strokeWidth="2" />
			<circle cx="18" cy="16" r="3" stroke={color} strokeWidth="2" />
		</svg>
	);
}

export function FollowerIcon({ size = 20, color = 'currentColor', className }: IconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="8.5" cy="7" r="4" stroke={color} strokeWidth="2" />
			<path
				d="M17 11L19 13L23 9"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

