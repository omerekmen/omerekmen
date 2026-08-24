import type { Project } from '$lib/types';

export const projects: Project[] = [
	{
		id: 'klauthed',
		status: 'ongoing',
		titleKey: 'project_klauthed_title',
		descriptionKey: 'project_klauthed_desc',
		stack: ['Rust', 'Actix-web', 'SvelteKit', 'CockroachDB', 'Redis', 'NATS', 'K3s', 'Terraform'],
		github: null,
		highlights: [
			'project_klauthed_h1',
			'project_klauthed_h2',
			'project_klauthed_h3',
			'project_klauthed_h4'
		]
	},
	{
		id: 'scivex',
		status: 'ongoing',
		titleKey: 'project_scivex_title',
		descriptionKey: 'project_scivex_desc',
		stack: ['Rust'],
		github: 'https://github.com/scivex/scivex',
		highlights: ['project_scivex_h1', 'project_scivex_h2', 'project_scivex_h3', 'project_scivex_h4']
	},
	{
		id: 'property-management',
		status: 'completed',
		titleKey: 'project_pm_title',
		descriptionKey: 'project_pm_desc',
		stack: ['.NET 9', 'SvelteKit', 'PostgreSQL', 'Redis', 'Docker'],
		github: null,
		highlights: ['project_pm_h1', 'project_pm_h2', 'project_pm_h3']
	},
	{
		id: 'spacex-falcon9',
		status: 'completed',
		titleKey: 'project_spacex_title',
		descriptionKey: 'project_spacex_desc',
		stack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Folium', 'Plotly'],
		github: 'https://github.com/omerekmen/Space-X-Falcon-9-Landing-Analysis',
		highlights: ['project_spacex_h1', 'project_spacex_h2', 'project_spacex_h3']
	},
	{
		id: 'data-analysis',
		status: 'completed',
		titleKey: 'project_da_title',
		descriptionKey: 'project_da_desc',
		stack: ['Python', 'Scikit-Learn', 'Pandas', 'Plotly', 'Seaborn'],
		github: 'https://github.com/omerekmen/Working-with-real-world-data-sets',
		highlights: ['project_da_h1', 'project_da_h2']
	}
];

/**
 * Projects as they appear on the CV, kept alongside the site's own project
 * lineup until both are unified into Markdown case studies (docs/ROADMAP.md
 * phase 02). Plain text — this is CV prose, not UI chrome.
 */
export interface CvProject {
	name: string;
	meta: string;
	github: string | null;
	bullets: string[];
	stack: string[];
}

export const cvProjects: CvProject[] = [
	{
		name: 'TELCO CRM Platform',
		meta: 'Java microservices — capstone, Turkcell GYGY 5.0',
		github: null,
		bullets: [
			'Telecommunications CRM covering customer/KYC, catalog, ordering, subscriptions, usage, billing, payment, notifications and ticketing.',
			'Spring Cloud microservices with API Gateway, PostgreSQL database-per-service, Kafka domain events, Redis caching, JWT/OAuth2, Docker/Kubernetes, Prometheus/Grafana/OpenTelemetry.'
		],
		stack: [
			'Java 21',
			'Spring Boot',
			'Spring Cloud',
			'PostgreSQL',
			'Kafka',
			'Redis',
			'Docker',
			'Kubernetes',
			'OpenTelemetry'
		]
	},
	{
		name: 'Video Transcription & Translation Pipeline',
		meta: 'Production tool, academic client',
		github: null,
		bullets: [
			'Python automation pipeline (FFmpeg, OpenAI Whisper, DeepL API) transcribing and translating video into multiple languages; configurable CLI, deployed in production.'
		],
		stack: ['Python', 'FFmpeg', 'Whisper', 'DeepL API']
	}
];
