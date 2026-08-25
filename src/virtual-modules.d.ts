declare module 'virtual:project-frontmatter' {
	/** Emitted by the projectFrontmatter plugin in vite.config.ts. */
	export const entries: { file: string; data: Record<string, unknown> }[];
}
