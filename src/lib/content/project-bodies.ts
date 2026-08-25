import type { Component } from 'svelte';

/**
 * The compiled case-study bodies, kept out of `projects.ts` on purpose.
 *
 * The homepage renders cards from frontmatter alone, but a single eager glob
 * that yields both metadata and components puts every compiled case study into
 * the homepage's import graph — 32 KB gzipped of prose nobody on that page
 * reads, growing with every project and every word added to one.
 *
 * Importing bodies only from the routes that render them keeps them in those
 * routes' chunks.
 */
const bodies = import.meta.glob<Component>('/src/content/projects/*.md', {
	eager: true,
	import: 'default'
});

const LOCALES = ['en', 'tr', 'fr', 'de', 'es'] as const;
type Locale = (typeof LOCALES)[number];

/** Mirrors parseFilename in projects.ts — "telco.tr" splits to slug and locale. */
function parseFilename(file: string): { slug: string; locale: Locale } {
	const base = file.split('/').pop()!.replace(/\.md$/, '');
	const match = /^(.+)\.([a-z]{2})$/.exec(base);
	if (match && (LOCALES as readonly string[]).includes(match[2])) {
		return { slug: match[1], locale: match[2] as Locale };
	}
	return { slug: base, locale: 'en' };
}

const byLocale = new Map<string, Map<Locale, Component>>();
for (const [file, component] of Object.entries(bodies)) {
	const { slug, locale } = parseFilename(file);
	if (!byLocale.has(slug)) byLocale.set(slug, new Map());
	byLocale.get(slug)!.set(locale, component);
}

/** The body in the requested language, or the English original. */
export function getProjectBody(slug: string, locale = 'en'): Component | null {
	const locales = byLocale.get(slug);
	if (!locales) return null;
	const wanted = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : 'en';
	return locales.get(wanted) ?? locales.get('en') ?? null;
}
