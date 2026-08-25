import { error } from '@sveltejs/kit';
import { allNotes, getNote, noteSlugs } from '$lib/content/notes';
import { getProject } from '$lib/content/projects';
import { getLocale } from '$lib/paraglide/runtime';
import type { PageLoad } from './$types';

export const prerender = true;

export function entries() {
	return noteSlugs.map((slug) => ({ slug }));
}

export const load: PageLoad = ({ params }) => {
	const meta = getNote(params.slug);
	if (!meta) error(404, 'Note not found');

	const locale = getLocale();
	const all = allNotes();
	const index = all.findIndex((n) => n.slug === params.slug);

	return {
		meta,
		locale,
		// The case study the piece came out of, so the argument can be checked
		// against the work rather than taken on trust.
		related: meta.related ? (getProject(meta.related, locale)?.meta ?? null) : null,
		next: all[(index + 1) % all.length] ?? null,
		total: all.length
	};
};
