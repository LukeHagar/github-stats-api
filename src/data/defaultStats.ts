import { UserStats, MusicData } from '../config';

export const defaultStats: UserStats = {
	name: 'Developer',
	avatarUrl: 'https://avatars.githubusercontent.com/u/0?v=4',
	username: 'developer',
	bio: 'Software Engineer',
	repoViews: 1000,
	linesOfCodeChanged: 500000,
	linesAdded: 300000,
	linesDeleted: 200000,
	totalCommits: 2500,
	totalPullRequests: 100,
	openIssues: 15,
	closedIssues: 85,
	forkCount: 50,
	starCount: 200,
	starsGiven: 100,
	followers: 150,
	following: 75,
	totalContributions: 3000,
	codeByteTotal: 50000000,
	contributionStats: {
		longestStreak: 100,
		currentStreak: 30,
		mostActiveDay: 'Wednesday',
		averagePerDay: 3.5,
		averagePerWeek: 24.5,
		averagePerMonth: 100,
		monthlyBreakdown: [],
	},
	topLanguages: [
		{ languageName: 'TypeScript', color: '#3178c6', value: 15000000 },
		{ languageName: 'JavaScript', color: '#f1e05a', value: 10000000 },
		{ languageName: 'Python', color: '#3572A5', value: 8000000 },
		{ languageName: 'Go', color: '#00ADD8', value: 5000000 },
		{ languageName: 'Rust', color: '#dea584', value: 3000000 },
		{ languageName: 'HTML', color: '#e34c26', value: 2000000 },
		{ languageName: 'CSS', color: '#663399', value: 1500000 },
		{ languageName: 'Shell', color: '#89e051', value: 500000 },
	],
};

export const defaultMusicData: MusicData = {
	trackName: 'Now Playing',
	artistName: 'Your Favorite Artist',
	albumName: 'Latest Album',
	isPlaying: true,
};

