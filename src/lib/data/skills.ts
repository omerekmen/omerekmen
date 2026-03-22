import type { SkillGroup } from '$lib/types';

export const skillGroups: SkillGroup[] = [
	{
		categoryKey: 'skills_languages',
		skills: ['Python', 'Rust', 'SQL', 'TypeScript', 'JavaScript', 'C#']
	},
	{
		categoryKey: 'skills_ds_ml',
		skills: [
			'Scikit-Learn',
			'TensorFlow',
			'PyTorch',
			'Pandas',
			'NumPy',
			'Statistical Modeling',
			'Feature Engineering'
		]
	},
	{
		categoryKey: 'skills_viz',
		skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Folium', 'Tableau', 'Power BI', 'SSRS']
	},
	{
		categoryKey: 'skills_db',
		skills: ['PostgreSQL', 'SQL Server', 'CockroachDB', 'Redis', 'ClickHouse']
	},
	{
		categoryKey: 'skills_eng',
		skills: [
			'SvelteKit',
			'Django',
			'.NET',
			'Actix-web',
			'Docker',
			'Kubernetes',
			'Terraform',
			'Cloudflare',
			'Git',
			'Azure DevOps'
		]
	}
];
