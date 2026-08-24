import { error } from '@sveltejs/kit';
import { getProject, adjacentProjects, projectSlugs, isUntranslated } from '$lib/content/projects';
import { getLocale } from '$lib/paraglide/runtime';
import type { PageLoad } from './$types';

export const prerender = true;

/** Enumerates slugs so every project prerenders, including any not linked yet. */
export function entries() {
	return projectSlugs.map((slug) => ({ slug }));
}

export const load: PageLoad = ({ params }) => {
	const locale = getLocale();
	const entry = getProject(params.slug, locale);
	if (!entry) error(404, 'Project not found');

	const { next, previous, index } = adjacentProjects(params.slug, locale);

	return {
		meta: entry.meta,
		hasBody: entry.hasBody,
		untranslated: isUntranslated(params.slug, locale),
		locale,
		next,
		previous,
		index,
		total: projectSlugs.length
	};
};
