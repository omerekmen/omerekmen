import { entries as frontmatter } from 'virtual:project-frontmatter';
import type {
	ProjectEntry,
	ProjectFrontmatter,
	ProjectMetric,
	ProjectTrack
} from '$lib/types/content';

type MarkdownModule = Record<string, unknown> | undefined;

const TRACKS: ProjectTrack[] = ['production', 'in-progress', 'lab', 'archive'];

/** Featured first, then track priority, then explicit order, then title. */
const TRACK_WEIGHT: Record<ProjectTrack, number> = {
	production: 0,
	'in-progress': 1,
	lab: 2,
	archive: 3
};

// Frontmatter comes from a build-time plugin rather than a glob over the .md
// files, so no compiled case-study component reaches a page that only renders
// cards. See the plugin in vite.config.ts for why the glob cannot do this.
const modules: Record<string, MarkdownModule> = Object.fromEntries(
	frontmatter.map((entry) => [entry.file, entry.data as MarkdownModule])
);

const LOCALES = ['en', 'tr', 'fr', 'de', 'es'] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Splits "telco-crm-platform.tr" into its slug and locale.
 *
 * A file with no locale suffix is the English original and the fallback for
 * every other language, so a project is never missing — it is either
 * translated or shown in English.
 */
function parseFilename(file: string): { slug: string; locale: Locale } {
	const base = file.split('/').pop()!.replace(/\.md$/, '');
	const match = /^(.+)\.([a-z]{2})$/.exec(base);
	if (match && (LOCALES as readonly string[]).includes(match[2])) {
		return { slug: match[1], locale: match[2] as Locale };
	}
	return { slug: base, locale: 'en' };
}

function fail(file: string, message: string): never {
	throw new Error(`Invalid project frontmatter in ${file}: ${message}`);
}

function requireString(file: string, data: Record<string, unknown>, key: string): string {
	const value = data[key];
	if (typeof value !== 'string' || value.trim() === '') {
		fail(file, `"${key}" must be a non-empty string`);
	}
	return value;
}

function stringArray(file: string, data: Record<string, unknown>, key: string): string[] {
	const value = data[key] ?? [];
	if (!Array.isArray(value) || value.some((v) => typeof v !== 'string')) {
		fail(file, `"${key}" must be an array of strings`);
	}
	return value as string[];
}

function parseMetrics(file: string, data: Record<string, unknown>): ProjectMetric[] {
	const value = data.metrics ?? [];
	if (!Array.isArray(value)) fail(file, '"metrics" must be an array');
	return value.map((entry) => {
		const m = entry as Record<string, unknown>;
		if (typeof m?.label !== 'string' || m.label.trim() === '') {
			fail(file, 'each metric needs a non-empty "label"');
		}
		if (m.value === undefined || m.value === null || String(m.value).trim() === '') {
			fail(file, `metric "${m.label}" needs a "value"`);
		}
		return { label: m.label, value: String(m.value) };
	});
}

/**
 * Validates at module load, so a malformed file fails the build instead of
 * rendering a broken page. See docs/GUIDELINE.md "Adding a project".
 */
function parse(file: string, module: MarkdownModule): ProjectEntry {
	const data: Record<string, unknown> = module ?? {};
	if (Object.keys(data).length === 0) fail(file, 'no frontmatter found');

	const track = requireString(file, data, 'track') as ProjectTrack;
	if (!TRACKS.includes(track)) {
		fail(file, `"track" must be one of ${TRACKS.join(', ')} (got "${track}")`);
	}

	const { slug: slugFromPath } = parseFilename(file);
	const slug = typeof data.slug === 'string' && data.slug ? data.slug : slugFromPath;
	if (slug !== slugFromPath) {
		fail(file, `"slug" (${slug}) must match the filename (${slugFromPath})`);
	}

	const links = (data.links ?? {}) as Record<string, unknown>;
	for (const key of ['github', 'demo', 'caseStudy']) {
		const v = links[key];
		if (v !== undefined && v !== null && typeof v !== 'string') {
			fail(file, `"links.${key}" must be a string or null`);
		}
	}

	const meta: ProjectFrontmatter = {
		title: requireString(file, data, 'title'),
		slug,
		track,
		role: requireString(file, data, 'role'),
		period: requireString(file, data, 'period'),
		summary: requireString(file, data, 'summary'),
		stack: stringArray(file, data, 'stack'),
		domains: stringArray(file, data, 'domains'),
		metrics: parseMetrics(file, data),
		links: {
			github: (links.github as string) ?? null,
			demo: (links.demo as string) ?? null,
			caseStudy: (links.caseStudy as string) ?? null
		},
		featured: data.featured === true,
		confidential: data.confidential === true,
		order: typeof data.order === 'number' ? data.order : 0,
		progress: typeof data.progress === 'string' ? data.progress : null,
		// Injected by the content-frontmatter plugin from the body's word count.
		minutes: typeof data.minutes === 'number' ? data.minutes : 1
	};

	return { meta, hasBody: data.hasBody !== false };
}

/** Every parsed file, keyed by slug then locale. */
const byLocale = new Map<string, Map<Locale, ProjectEntry>>();

for (const [file, module] of Object.entries(modules)) {
	const { slug, locale } = parseFilename(file);
	const entry = parse(file, module);
	if (!byLocale.has(slug)) byLocale.set(slug, new Map());
	byLocale.get(slug)!.set(locale, entry);
}

for (const [slug, locales] of byLocale) {
	if (!locales.has('en')) {
		throw new Error(
			`Project "${slug}" has translations but no English original. ` +
				`Every project needs ${slug}.md as its fallback.`
		);
	}
}

function sortEntries(list: ProjectEntry[]): ProjectEntry[] {
	return [...list].sort((a, b) => {
		if (a.meta.featured !== b.meta.featured) return a.meta.featured ? -1 : 1;
		const trackDiff = TRACK_WEIGHT[a.meta.track] - TRACK_WEIGHT[b.meta.track];
		if (trackDiff !== 0) return trackDiff;
		if (a.meta.order !== b.meta.order) return b.meta.order - a.meta.order;
		return a.meta.title.localeCompare(b.meta.title);
	});
}

function normalise(locale: string): Locale {
	return (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : 'en';
}

/** The requested language, or the English original when it is not translated. */
function resolve(slug: string, locale: string): ProjectEntry | undefined {
	const locales = byLocale.get(slug);
	if (!locales) return undefined;
	return locales.get(normalise(locale)) ?? locales.get('en');
}

const slugs = [...byLocale.keys()];

export function allProjects(locale = 'en'): ProjectEntry[] {
	return sortEntries(slugs.map((slug) => resolve(slug, locale)!).filter(Boolean));
}

export function projectMeta(locale = 'en'): ProjectFrontmatter[] {
	return allProjects(locale).map((e) => e.meta);
}

export function getProject(slug: string, locale = 'en'): ProjectEntry | undefined {
	return resolve(slug, locale);
}

/** True when this project is shown in English because it lacks a translation. */
export function isUntranslated(slug: string, locale: string): boolean {
	const locales = byLocale.get(slug);
	if (!locales) return false;
	const wanted = normalise(locale);
	return wanted !== 'en' && !locales.has(wanted);
}

/** Everything except archived work — what the homepage carousel shows. */
export function featuredProjects(locale = 'en'): ProjectFrontmatter[] {
	return projectMeta(locale).filter((p) => p.track !== 'archive');
}

export function adjacentProjects(slug: string, locale = 'en') {
	const list = allProjects(locale);
	const index = list.findIndex((e) => e.meta.slug === slug);
	if (index === -1) return { next: null, previous: null, index: 0 };
	const count = list.length;
	return {
		next: list[(index + 1) % count].meta,
		previous: list[(index - 1 + count) % count].meta,
		index: index + 1
	};
}

export function allDomains(locale = 'en'): string[] {
	return [...new Set(projectMeta(locale).flatMap((p) => p.domains))].sort();
}

export function allTracks(locale = 'en'): ProjectTrack[] {
	return TRACKS.filter((t) => projectMeta(locale).some((p) => p.track === t));
}

/** Slugs for prerendering; identical across locales. */
export const projectSlugs: string[] = slugs;
