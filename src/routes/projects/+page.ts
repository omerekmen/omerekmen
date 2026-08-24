import { projectMeta } from '$lib/content/projects';
import { getLocale } from '$lib/paraglide/runtime';

export const prerender = true;

export function load() {
	return { projects: projectMeta(getLocale()) };
}
