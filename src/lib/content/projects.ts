import type { Component } from 'svelte';
import type {
	ProjectEntry,
	ProjectFrontmatter,
	ProjectMetric,
	ProjectTrack
} from '$lib/types/content';

interface MarkdownModule {
	default: Component;
	metadata?: Record<string, unknown>;
}

const TRACKS: ProjectTrack[] = ['production', 'in-progress', 'lab', 'archive'];

/** Featured first, then track priority, then explicit order, then title. */
const TRACK_WEIGHT: Record<ProjectTrack, number> = {
	production: 0,
	'in-progress': 1,
	lab: 2,
	archive: 3
};

const modules = import.meta.glob<MarkdownModule>('/src/content/projects/*.md', { eager: true });

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
	const data = module.metadata ?? {};
	if (Object.keys(data).length === 0) fail(file, 'no frontmatter found');

	const track = requireString(file, data, 'track') as ProjectTrack;
	if (!TRACKS.includes(track)) {
		fail(file, `"track" must be one of ${TRACKS.join(', ')} (got "${track}")`);
	}

	const slugFromPath = file.split('/').pop()!.replace(/\.md$/, '');
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
		progress: typeof data.progress === 'string' ? data.progress : null
	};

	return { meta, body: module.default ?? null, hasBody: data.hasBody !== false };
}

const entries: ProjectEntry[] = Object.entries(modules)
	.map(([file, module]) => parse(file, module))
	.sort((a, b) => {
		if (a.meta.featured !== b.meta.featured) return a.meta.featured ? -1 : 1;
		const trackDiff = TRACK_WEIGHT[a.meta.track] - TRACK_WEIGHT[b.meta.track];
		if (trackDiff !== 0) return trackDiff;
		if (a.meta.order !== b.meta.order) return b.meta.order - a.meta.order;
		return a.meta.title.localeCompare(b.meta.title);
	});

const bySlug = new Map(entries.map((e) => [e.meta.slug, e]));

export const allProjects: ProjectEntry[] = entries;
export const projectMeta: ProjectFrontmatter[] = entries.map((e) => e.meta);

export function getProject(slug: string): ProjectEntry | undefined {
	return bySlug.get(slug);
}

/** Everything except archived work — what the homepage carousel shows. */
export function featuredProjects(): ProjectFrontmatter[] {
	return projectMeta.filter((p) => p.track !== 'archive');
}

export function adjacentProjects(slug: string) {
	const index = entries.findIndex((e) => e.meta.slug === slug);
	if (index === -1) return { next: null, previous: null, index: 0 };
	const count = entries.length;
	return {
		next: entries[(index + 1) % count].meta,
		previous: entries[(index - 1 + count) % count].meta,
		index: index + 1
	};
}

export function allDomains(): string[] {
	return [...new Set(projectMeta.flatMap((p) => p.domains))].sort();
}

export function allTracks(): ProjectTrack[] {
	return TRACKS.filter((t) => projectMeta.some((p) => p.track === t));
}
