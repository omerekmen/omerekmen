import { error } from '@sveltejs/kit';
import { getProject, adjacentProjects, projectMeta } from '$lib/content/projects';
import type { PageLoad } from './$types';

export const prerender = true;

/** Enumerates slugs so every project prerenders, including any not linked yet. */
export function entries() {
	return projectMeta.map((p) => ({ slug: p.slug }));
}

export const load: PageLoad = ({ params }) => {
	const entry = getProject(params.slug);
	if (!entry) error(404, 'Project not found');

	const { next, previous, index } = adjacentProjects(params.slug);

	return {
		meta: entry.meta,
		hasBody: entry.hasBody,
		next,
		previous,
		index,
		total: projectMeta.length
	};
};
