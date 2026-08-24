import type { Experience } from '$lib/types';

export const experiences: Experience[] = [
	{
		id: 'seturtech',
		role: 'Data Science Engineer',
		company: 'SeturTech (Koç Group)',
		via: 'Rise Technology',
		location: 'Istanbul, Turkey',
		period: 'Jul 2026 — Present',
		current: true,
		bullets: [
			"Build and operate production data pipelines on Microsoft Fabric (lakehouse and data warehouse) and Azure Data Factory for Setur, Koç Group's travel and tourism company.",
			'Integrate source systems including Dynamics 365, SAP and CRM platforms into governed analytical models.',
			'Deliver specialised reporting for every business unit — C-level, finance and accounting, customer support and their leads — via Power BI, Azure SQL Database, Python notebooks and Azure Functions.',
			'Replace recurring manual extracts with scheduled, automated pipeline orchestration.'
		],
		stack: [
			'Microsoft Fabric',
			'Azure Data Factory',
			'Azure SQL Database',
			'Azure Functions',
			'Power BI',
			'Python'
		]
	},
	{
		id: 'otokoc',
		role: 'Software Engineer — Working Student',
		company: 'Otokoç Otomotiv (Koç Group)',
		via: null,
		location: 'Istanbul, Turkey',
		period: 'Jun 2024 — May 2026',
		current: false,
		bullets: [
			'Migrated production ERP modules from .NET Framework to .NET 8, maintaining parallel Framework support so operations continued uninterrupted.',
			'Developed accounting and purchasing backend modules using ASP.NET Core Web API, Entity Framework Core, LINQ and MediatR/CQRS.',
			'Automated personnel expense processing (business travel, lodging) via rule-based integration between Otokoç and Setur systems, reaching 70%+ time reduction; approximately 30% process time reduction across accounting and purchasing overall.',
			'Authored 50+ T-SQL stored procedures; built 6 SSIS ETL packages and 15+ SSRS reports.',
			'Tuned query performance via execution-plan analysis, indexing strategy and schema-level redesign on Microsoft SQL Server.',
			'Integrated RabbitMQ messaging and Redis caching; containerised with Docker and managed Kubernetes deployments alongside automated pipelines.',
			'Progressed from a team of 3–4 to sole engineer on the module for two months after teammates resigned, sustaining delivery without handover gaps.',
			'Shipped 20+ production-tracked items in Agile/Scrum via Azure DevOps, translating business requirements documents into technical tasks.'
		],
		stack: [
			'.NET 8',
			'ASP.NET Core',
			'Entity Framework Core',
			'MediatR/CQRS',
			'SQL Server',
			'T-SQL',
			'SSIS',
			'SSRS',
			'RabbitMQ',
			'Redis',
			'Docker',
			'Kubernetes',
			'Azure DevOps'
		]
	},
	{
		id: 'freelance',
		role: 'Freelance Software Engineer',
		company: 'Independent',
		via: null,
		location: 'Remote',
		period: 'Dec 2023 — Feb 2025',
		current: false,
		bullets: [
			'Delivered two production systems for paying clients, owning requirements analysis, backend architecture, implementation, CI/CD and AWS deployment.',
			'Property management platform (Nesin Foundation, Turkish mathematics education non-profit; 2-person team): Python/Django backend managing 100+ property listings with rent, expense and tenant workflows; PostgreSQL schema of 15+ normalised tables; query and index optimisation cut dashboard load time 60%.',
			'SaaS e-commerce platform (4-person team): Django backend and admin platform covering authentication, product, order and customer workflows plus reporting endpoints, from system design through cloud deployment.'
		],
		stack: ['Python', 'Django', 'PostgreSQL', 'REST APIs', 'AWS (EC2, S3)', 'CI/CD']
	},
	{
		id: 'vakif',
		role: 'Data Analytics Intern',
		company: 'Vakıf Katılım Bank',
		via: null,
		location: 'Istanbul, Turkey',
		period: 'Sep 2023 — Oct 2023',
		current: false,
		bullets: [
			'Supported compliance and regulatory reporting, analysing financial and operational datasets in SQL and Python for senior management and regulator-facing submissions.',
			'Developed 4 structured reports and dashboards monitoring regulatory indicators and operational performance.'
		],
		stack: ['SQL', 'Python', 'Power BI']
	}
];
