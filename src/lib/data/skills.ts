import type { SkillGroup } from '$lib/types';

export const skillGroups: SkillGroup[] = [
	{
		categoryKey: 'skills_languages',
		label: 'Languages',
		skills: ['C#', 'Python', 'SQL (T-SQL)', 'Java', 'TypeScript']
	},
	{
		categoryKey: 'skills_data',
		label: 'Data & Analytics',
		skills: [
			'Microsoft Fabric',
			'Azure Data Factory',
			'Azure SQL Database',
			'Azure Functions',
			'Power BI',
			'SSIS',
			'SSRS',
			'SQL Server',
			'PostgreSQL'
		]
	},
	{
		categoryKey: 'skills_dotnet',
		label: '.NET',
		skills: [
			'ASP.NET Core Web API',
			'.NET 8',
			'Entity Framework Core',
			'LINQ',
			'MediatR/CQRS',
			'.NET Framework'
		]
	},
	{
		categoryKey: 'skills_python',
		label: 'Python',
		skills: ['Django', 'FastAPI', 'SQLAlchemy', 'Pydantic', 'Poetry', 'Pandas', 'NumPy']
	},
	{
		categoryKey: 'skills_platform',
		label: 'Platform & Infrastructure',
		skills: [
			'Docker',
			'Kubernetes',
			'RabbitMQ',
			'Redis',
			'Kafka',
			'Azure DevOps',
			'GitHub Actions',
			'AWS (EC2, S3)',
			'CI/CD',
			'Linux'
		]
	},
	{
		categoryKey: 'skills_working',
		label: 'Working Knowledge',
		skills: [
			'Spark/PySpark',
			'Parquet',
			'Delta tables',
			'dbt',
			'Airflow',
			'BigQuery',
			'Polars',
			'Celery'
		]
	}
];

/**
 * Stacks used in project work rather than day-to-day production. Kept separate
 * so the CV can distinguish depth from exposure.
 */
export const projectExperienceSkills: string[] = [
	'Java 21',
	'Spring Boot',
	'Spring Cloud',
	'Spring Data JPA',
	'Spring Security',
	'Maven',
	'Flyway',
	'Kafka',
	'OpenTelemetry',
	'PyTorch',
	'scikit-learn',
	'LangChain/LangGraph',
	'pgvector, Qdrant, Pinecone',
	'Hugging Face',
	'MCP'
];
