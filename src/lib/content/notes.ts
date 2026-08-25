import { entries as frontmatter } from 'virtual:note-frontmatter';
import type { NoteFrontmatter } from '$lib/types/content';

/**
 * Notes are English-only, for the same reason the CV prose is.
 *
 * A case study is short structured content and translating it is bounded work.
 * An essay is not: maintaining four translations of an argument is what turns a
 * writing section into an archive of half-updated versions. Non-English readers
 * get the localised notice the CV already uses.
 */
function fail(file: string, message: string): never {
	throw new Error(`Invalid note frontmatter in ${file}: ${message}`);
}

function requireString(file: string, data: Record<string, unknown>, key: string): string {
	const value = data[key];
	if (typeof value !== 'string' || value.trim() === '') {
		fail(file, `"${key}" must be a non-empty string`);
	}
	return value;
}

function parse(file: string, data: Record<string, unknown>): NoteFrontmatter {
	const slugFromPath = file.split('/').pop()!.replace(/\.md$/, '');
	const slug = typeof data.slug === 'string' && data.slug ? data.slug : slugFromPath;
	if (slug !== slugFromPath) {
		fail(file, `"slug" (${slug}) must match the filename (${slugFromPath})`);
	}

	const date = requireString(file, data, 'date');
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(file, '"date" must be YYYY-MM-DD');

	const tags = data.tags ?? [];
	if (!Array.isArray(tags) || tags.some((t) => typeof t !== 'string')) {
		fail(file, '"tags" must be an array of strings');
	}

	// Injected by the content-frontmatter plugin from the body's word count.
	const minutes = typeof data.minutes === 'number' ? data.minutes : 1;

	return {
		title: requireString(file, data, 'title'),
		slug,
		date,
		summary: requireString(file, data, 'summary'),
		tags: tags as string[],
		related: typeof data.related === 'string' ? data.related : null,
		minutes
	};
}

/** Newest first, which is the only order a writing section can be read in. */
const notes: NoteFrontmatter[] = frontmatter
	.map((entry) => parse(entry.file, entry.data))
	.sort((a, b) => b.date.localeCompare(a.date));

export function allNotes(): NoteFrontmatter[] {
	return notes;
}

export function getNote(slug: string): NoteFrontmatter | undefined {
	return notes.find((n) => n.slug === slug);
}

export const noteSlugs: string[] = notes.map((n) => n.slug);
