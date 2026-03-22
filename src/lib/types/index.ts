export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

export type ProjectStatus = 'ongoing' | 'completed';

export interface Project {
	id: string;
	status: ProjectStatus;
	titleKey: string;
	descriptionKey: string;
	stack: string[];
	github: string | null;
	highlights: string[];
}

export interface Experience {
	id: string;
	titleKey: string;
	companyKey: string;
	location: string;
	period: string;
	descriptionKeys: string[];
	stack: string[];
}

export interface SkillGroup {
	categoryKey: string;
	skills: string[];
}

export interface Education {
	id: string;
	degreeKey: string;
	institutionKey: string;
	location: string;
	period: string;
	gpa: string;
	highlightKeys: string[];
}

export interface Certificate {
	id: string;
	nameKey: string;
	issuer: string;
	date: string;
	credentialUrl: string | null;
}
