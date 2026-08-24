import { personal } from '$lib/data/personal';
import { experiences } from '$lib/data/experience';
import { featuredProjects, getProject } from '$lib/content/projects';

/**
 * The single content set every direction renders.
 *
 * Comparing directions only tells you something if the words are identical —
 * otherwise you are judging the copy, not the design.
 */
export const sample = {
	name: personal.name,
	title: personal.title,
	summary: personal.summary,
	location: personal.location,
	email: personal.email,
	github: personal.github,
	linkedin: personal.linkedin,
	currentRole: experiences.find((e) => e.current) ?? experiences[0],
	projects: featuredProjects().slice(0, 3),
	caseStudy: getProject('telco-crm-platform')
};

/** Drawn from the CV, used where a direction wants a capability strip. */
export const capabilities = [
	{ label: 'Data platform', items: ['Microsoft Fabric', 'Azure Data Factory', 'Azure SQL'] },
	{ label: 'Backend', items: ['.NET 8', 'ASP.NET Core', 'Django', 'Spring Boot'] },
	{ label: 'Infrastructure', items: ['Docker', 'Kubernetes', 'Kafka', 'Redis'] }
];

/** The pipeline shape described in the current role — used by direction B. */
export const pipelineStages = [
	{ id: 'source', label: 'Source systems', detail: 'Dynamics 365 · SAP · CRM' },
	{ id: 'ingest', label: 'Ingestion', detail: 'Azure Data Factory' },
	{ id: 'lake', label: 'Lakehouse', detail: 'Microsoft Fabric' },
	{ id: 'warehouse', label: 'Warehouse', detail: 'Governed models' },
	{ id: 'serve', label: 'Reporting', detail: 'Power BI · Azure Functions' }
];
