import type { Education, Certificate } from '$lib/types';

export const education: Education[] = [
	{
		id: 'gsu',
		degree: 'B.Sc. Mathematics',
		institution: 'Galatasaray University',
		location: 'Istanbul, Turkey',
		period: 'Graduated Feb 2026',
		details: [
			{
				label: 'Instruction',
				text: 'Degree taught entirely in French (francophone curriculum).'
			},
			{
				label: 'Thesis',
				text: 'Apprentissage par Renforcement (Reinforcement Learning) — mathematical foundations (MDPs, Bellman equations, convergence), with classical RL algorithms implemented and compared on benchmark environments. Written and defended in French under Assoc. Prof. Dr. Ayşegül Ulus. Grade: AA (4.0/4.0).'
			},
			{
				label: 'Coursework',
				text: 'Probability Theory, Linear Algebra, Numerical Analysis, Applied Mathematics, Machine Learning, Natural Language Processing, Cryptography.'
			},
			{
				label: 'Leadership',
				text: 'Mathematics Club Board Member (2021–2022), Photography Club Board Member (2018–2023); organised 35+ academic and cultural events.'
			}
		]
	}
];

export const certificates: Certificate[] = [
	{
		id: 'turkcell-gygy',
		name: 'Turkcell GYGY 5.0 — Java Development Track',
		issuer: 'Turkcell',
		date: 'Mar 2026 — Jul 2026',
		note: 'Selected among 35 of ~5,000 applicants · 120 hours · Java, Spring Boot, REST APIs, PostgreSQL, Redis, Kafka, Docker, microservice architecture',
		credentialId: null,
		credentialUrl: null
	},
	{
		id: 'ibm-ds',
		name: 'IBM Data Science Professional Certificate',
		issuer: 'Coursera',
		date: 'Aug 2023',
		note: null,
		credentialId: 'TK3PHHTVV248',
		credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/TK3PHHTVV248'
	}
];
