import type { Education, Certificate } from '$lib/types';

export const education: Education[] = [
	{
		id: 'gsu',
		degreeKey: 'edu_gsu_degree',
		institutionKey: 'edu_gsu_institution',
		location: 'Istanbul, Turkey',
		period: 'Sep 2018 — Feb 2026',
		gpa: '2.99 / 4.0',
		highlightKeys: ['edu_gsu_h1', 'edu_gsu_h2', 'edu_gsu_h3', 'edu_gsu_h4']
	}
];

export const certificates: Certificate[] = [
	{
		id: 'ibm-ds',
		nameKey: 'cert_ibm_name',
		issuer: 'Coursera',
		date: 'Aug 2023',
		credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/TK3PHHTVV248'
	}
];
