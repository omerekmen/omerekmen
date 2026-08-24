export const personal = {
	name: 'Ömer Ekmen',
	title: 'Software Engineering & Data Engineering',
	location: 'Istanbul, Turkey',
	email: 'omerekmenn@gmail.com',
	phone: '+90 540 408 0812',
	website: 'https://www.omerekmen.com',
	linkedin: 'https://linkedin.com/in/omerekmenn',
	github: 'https://github.com/omerekmen',
	summary:
		'Engineer with 2.5 years across enterprise backend and the Microsoft data platform. Currently building production pipelines on Microsoft Fabric and Azure Data Factory at Koç Group; previously owned ERP accounting and purchasing modules in .NET, including a Framework to .NET 8 migration. B.Sc. Mathematics from Galatasaray University, taught in French, with a reinforcement learning thesis graded 4.0/4.0.'
} as const;

/**
 * Relocation eligibility. Surfaced for recruiters outside Turkey and gated for
 * visitors inside it — see docs/ROADMAP.md §"Geo-gating the relocation banner".
 */
export const workAuthorization = {
	short: 'Open to EU relocation',
	full: 'Turkish national — eligible for EU Blue Card and Netherlands Highly Skilled Migrant sponsorship.'
} as const;
