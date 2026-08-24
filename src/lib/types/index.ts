export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

/**
 * CV content is stored as plain English text, not translation keys.
 *
 * Paraglide holds interface strings only — labels, buttons, navigation. Career
 * prose lives here so there is exactly one place to edit when the CV changes.
 * See docs/GUIDELINE.md.
 */
export interface Experience {
	id: string;
	role: string;
	company: string;
	/** Employment vehicle, e.g. an agency the role is contracted through. */
	via: string | null;
	location: string;
	period: string;
	/** Drives "current role" styling and structured data. */
	current: boolean;
	bullets: string[];
	stack: string[];
}

export interface SkillGroup {
	/** Paraglide key, for the translated homepage marquee. */
	categoryKey: string;
	/** English label, for the English-only CV page. */
	label: string;
	skills: string[];
}

export interface EducationDetail {
	label: string;
	text: string;
}

export interface Education {
	id: string;
	degree: string;
	institution: string;
	location: string;
	period: string;
	details: EducationDetail[];
}

export interface Certificate {
	id: string;
	name: string;
	issuer: string;
	date: string;
	/** Short line of context, e.g. selectivity or hours. */
	note: string | null;
	credentialId: string | null;
	credentialUrl: string | null;
}

export interface SpokenLanguage {
	name: string;
	level: string;
	/** Proficiency out of 5, for the CV dot scale. */
	dots: number;
}
