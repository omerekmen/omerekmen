/**
 * Projects exactly as the CV lists them. Kept separate from the site's case
 * studies in src/content/projects: the CV is a fixed two-page document, the
 * site is not, and they are edited at different times.
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
