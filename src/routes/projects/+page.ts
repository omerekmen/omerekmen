import { projectMeta } from '$lib/content/projects';

export const prerender = true;

export function load() {
	return { projects: projectMeta };
}
