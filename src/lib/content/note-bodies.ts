import type { Component } from 'svelte';

/**
 * Compiled note bodies, kept out of `notes.ts` for the same reason project
 * bodies are kept out of `projects.ts` — see the note in `project-bodies.ts`.
 */
const bodies = import.meta.glob<Component>('/src/content/notes/*.md', {
	eager: true,
	import: 'default'
});

const bySlug = new Map<string, Component>();
for (const [file, component] of Object.entries(bodies)) {
	bySlug.set(file.split('/').pop()!.replace(/\.md$/, ''), component);
}

export function getNoteBody(slug: string): Component | null {
	return bySlug.get(slug) ?? null;
}
