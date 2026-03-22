import type { Experience } from '$lib/types';

export const experiences: Experience[] = [
	{
		id: 'otokoc',
		titleKey: 'exp_otokoc_title',
		companyKey: 'exp_otokoc_company',
		location: 'Istanbul, Turkey',
		period: 'Jun 2024 — Present',
		descriptionKeys: [
			'exp_otokoc_d1',
			'exp_otokoc_d2',
			'exp_otokoc_d3',
			'exp_otokoc_d4',
			'exp_otokoc_d5',
			'exp_otokoc_d6'
		],
		stack: ['.NET', 'SQL Server', 'T-SQL', 'SSIS', 'SSRS', 'Azure DevOps']
	},
	{
		id: 'vakif',
		titleKey: 'exp_vakif_title',
		companyKey: 'exp_vakif_company',
		location: 'Istanbul, Turkey',
		period: 'Sep 2023 — Oct 2023',
		descriptionKeys: ['exp_vakif_d1', 'exp_vakif_d2', 'exp_vakif_d3'],
		stack: ['SQL', 'Python', 'Power BI']
	}
];
