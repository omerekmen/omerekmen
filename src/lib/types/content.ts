/**
 * How much weight a project carries, and how it should be framed.
 *
 * - `production` — shipped, real users, backed by the CV
 * - `in-progress` — actively built, honestly labelled, not yet finished
 * - `lab` — purpose-built to demonstrate a stack
 * - `archive` — earlier work kept for its URL and history, not featured
 */
export type ProjectTrack = 'production' | 'in-progress' | 'lab' | 'archive';

export interface ProjectMetric {
	label: string;
	value: string;
}

export interface ProjectLinks {
	github?: string | null;
	demo?: string | null;
	caseStudy?: string | null;
}

export interface ProjectFrontmatter {
	title: string;
	slug: string;
	track: ProjectTrack;
	/** What the author actually did, and with how many people. */
	role: string;
	period: string;
	/** One or two sentences. Used on cards, meta descriptions and OG text. */
	summary: string;
	stack: string[];
	/** Coarse tags used by the index filters. */
	domains: string[];
	metrics: ProjectMetric[];
	links: ProjectLinks;
	featured: boolean;
	/** Employer detail is withheld until the author confirms what may be shown. */
	confidential: boolean;
	/** Sort key. Higher shows first within a track. */
	order: number;
	/** Free-text state for in-progress work, e.g. "15 of 22 services". */
	progress?: string | null;
}

export interface ProjectEntry {
	meta: ProjectFrontmatter;
	/** Whether prose exists. The body itself comes from `project-bodies.ts`. */
	hasBody: boolean;
}
