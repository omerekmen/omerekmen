import { projects } from '$lib/data/projects';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = ({ params }) => {
	const project = projects.find((p) => p.id === params.slug);

	if (!project) {
		error(404, 'Project not found');
	}

	const currentIndex = projects.indexOf(project);
	const nextProject = projects[(currentIndex + 1) % projects.length];
	const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];

	return {
		project,
		nextProject,
		prevProject
	};
};
