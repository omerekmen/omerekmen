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
	projects: featuredProjects(),
	caseStudy: getProject('telco-crm-platform')
};

/** Drawn from the CV, used where a direction wants a capability strip. */
export const capabilities = [
	{ label: 'Data platform', items: ['Microsoft Fabric', 'Azure Data Factory', 'Azure SQL'] },
	{ label: 'Backend', items: ['.NET 8', 'ASP.NET Core', 'Django', 'Spring Boot'] },
	{ label: 'Infrastructure', items: ['Docker', 'Kubernetes', 'Kafka', 'Redis'] }
];

/**
 * The pipeline shape described in the current role — used by direction B.
 * `note` is what the stage actually involves, shown when a stage is selected.
 */
export const pipelineStages = [
	{
		id: 'source',
		label: 'Source systems',
		detail: 'Live systems · APIs · Parquet',
		note: 'Operational databases, partner integrations, REST endpoints and dropped Parquet files. Every source arrives on its own schedule and in its own shape.'
	},
	{
		id: 'ingest',
		label: 'Ingestion',
		detail: 'Azure Data Factory',
		note: 'Copy and orchestration pipelines land raw extracts, with retries and watermarking so a failed run resumes instead of reprocessing everything.'
	},
	{
		id: 'lake',
		label: 'Lakehouse',
		detail: 'Microsoft Fabric',
		note: 'Raw files become tables. Transformations run in Fabric notebooks in Python, where the logic is easier to test and review than in a visual designer.'
	},
	{
		id: 'warehouse',
		label: 'Warehouse',
		detail: 'Governed models',
		note: 'Conformed dimensions and facts that the whole company reads from, so two reports asking the same question return the same number.'
	},
	{
		id: 'serve',
		label: 'Reporting',
		detail: 'Power BI · forecasting',
		note: 'Semantic models feed Power BI for reporting, plus the datasets behind prediction and R&D work.'
	}
];

/**
 * Section map for the directions that offer in-page navigation.
 * Kept here so A's rail and C's contents list cannot drift apart.
 */
export const sections = [
	{ id: 'intro', label: 'Intro' },
	{ id: 'work', label: 'Work' },
	{ id: 'case', label: 'Case study' },
	{ id: 'contact', label: 'Contact' }
];

/** Roughly how long the case study takes to read, from its own word count. */
export function readingMinutes(words: number): number {
	return Math.max(1, Math.round(words / 220));
}
