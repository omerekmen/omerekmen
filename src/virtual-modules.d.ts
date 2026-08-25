declare module 'virtual:project-frontmatter' {
	/** Emitted by the content-frontmatter plugin in vite.config.ts. */
	export const entries: { file: string; data: Record<string, unknown> }[];
}

declare module 'virtual:note-frontmatter' {
	/** Emitted by the content-frontmatter plugin in vite.config.ts. */
	export const entries: { file: string; data: Record<string, unknown> }[];
}
