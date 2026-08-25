import { allNotes } from '$lib/content/notes';
import { getLocale } from '$lib/paraglide/runtime';

export const prerender = true;

export function load() {
	return { notes: allNotes(), locale: getLocale() };
}
