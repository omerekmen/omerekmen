import { personal, workAuthorization } from '$lib/data/personal';
import { experiences } from '$lib/data/experience';
import { education, certificates } from '$lib/data/education';
import { skillGroups, projectExperienceSkills } from '$lib/data/skills';
import { cvProjects } from '$lib/data/projects';
import { spokenLanguages } from '$lib/data/languages';

export const prerender = true;

/**
 * Generated from the same data the CV page renders, so this file cannot drift
 * away from the site the way a hand-maintained static copy did.
 */
export function GET() {
	const lines: string[] = [];
	const push = (...l: string[]) => lines.push(...l);

	push(
		`# ${personal.name} — Personal Portfolio & CV`,
		'',
		'> Structured information about the owner of omerekmen.com for AI agents, LLMs and search crawlers.',
		'',
		'## About',
		'',
		`Name: ${personal.name}`,
		`Title: ${personal.title}`,
		`Location: ${personal.location}`,
		`Email: ${personal.email}`,
		`Phone: ${personal.phone}`,
		`Website: ${personal.website}`,
		`LinkedIn: ${personal.linkedin}`,
		`GitHub: ${personal.github}`,
		`Work authorization: ${workAuthorization.full}`,
		'',
		'## Profile',
		'',
		personal.summary,
		'',
		'## Experience',
		''
	);

	for (const job of experiences) {
		const via = job.via ? ` (via ${job.via})` : '';
		push(`- ${job.role} — ${job.company}${via}, ${job.location} (${job.period})`);
		for (const bullet of job.bullets) push(`  - ${bullet}`);
		push('');
	}

	push('## Technical Skills', '');
	for (const group of skillGroups) {
		push(`- ${group.label}: ${group.skills.join(', ')}`);
	}
	push(`- Project Experience: ${projectExperienceSkills.join(', ')}`, '');

	push('## Projects', '');
	for (const project of cvProjects) {
		push(`- ${project.name} — ${project.meta}`);
		for (const bullet of project.bullets) push(`  - ${bullet}`);
		push(`  - Stack: ${project.stack.join(', ')}`);
	}
	push('');

	push('## Education', '');
	for (const degree of education) {
		push(`- ${degree.degree} — ${degree.institution}, ${degree.location} (${degree.period})`);
		for (const detail of degree.details) push(`  - ${detail.label}: ${detail.text}`);
	}
	push('');

	push('## Training & Certifications', '');
	for (const cert of certificates) {
		push(`- ${cert.name} — ${cert.issuer}, ${cert.date}`);
		if (cert.note) push(`  - ${cert.note}`);
		if (cert.credentialId) push(`  - Credential: ${cert.credentialId}`);
	}
	push('');

	push('## Languages Spoken', '');
	for (const lang of spokenLanguages) push(`- ${lang.name}: ${lang.level}`);
	push('');

	push(
		'## Site Pages',
		'',
		'- / — Portfolio home',
		'- /projects/{id} — Individual project details',
		'- /cv — Interactive curriculum vitae',
		'- /s — Social links',
		'- /cv.pdf — Downloadable CV (PDF)',
		''
	);

	return new Response(lines.join('\n'), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
}
