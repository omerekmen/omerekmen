import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'yaml';

const PRODUCTION_BRANCH = 'master';

/** Short commit of the build, for identifying a deployment from its HTML. */
function resolveCommit() {
	return (process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? 'local').slice(0, 7);
}

function resolveSiteEnv() {
	if (process.env.PUBLIC_SITE_ENV === 'staging') return 'staging';
	if (process.env.PUBLIC_SITE_ENV === 'production') return 'production';

	const cfBranch = process.env.CF_PAGES_BRANCH;
	if (cfBranch && cfBranch !== PRODUCTION_BRANCH) return 'staging';

	return 'production';
}

const PROJECTS_DIR = 'src/content/projects';
const FRONTMATTER_ID = 'virtual:project-frontmatter';

/**
 * Serves every project's frontmatter as plain data, with no compiled component
 * attached.
 *
 * The obvious approach — import.meta.glob with import: 'metadata' — does not
 * work. mdsvex turns each .md into a Svelte component whose module body builds
 * templates at the top level, so Rollup cannot treat the default export as
 * side-effect-free and drops nothing. Asking for the metadata still drags in
 * every compiled case study: 32 KB gzipped of prose on a homepage that renders
 * cards from frontmatter alone, growing with every project and every word.
 *
 * Reading the files at build time and emitting the parsed YAML sidesteps the
 * component entirely. The .md files stay the single source of truth.
 */
function projectFrontmatter(): Plugin {
	const load = () => {
		const dir = join(process.cwd(), PROJECTS_DIR);
		const entries = readdirSync(dir)
			.filter((name) => name.endsWith('.md'))
			.sort()
			.map((name) => {
				const raw = readFileSync(join(dir, name), 'utf8');
				const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
				if (!match) throw new Error(`${PROJECTS_DIR}/${name} has no frontmatter`);
				return { file: `/${PROJECTS_DIR}/${name}`, data: yaml.parse(match[1]) };
			});
		return `export const entries = ${JSON.stringify(entries)};`;
	};

	return {
		name: 'project-frontmatter',
		resolveId: (id) => (id === FRONTMATTER_ID ? `\0${FRONTMATTER_ID}` : null),
		load: (id) => (id === `\0${FRONTMATTER_ID}` ? load() : null),
		// Editing a case study must invalidate the generated module in dev.
		handleHotUpdate({ file, server }) {
			if (!file.includes(PROJECTS_DIR) || !file.endsWith('.md')) return;
			const mod = server.moduleGraph.getModuleById(`\0${FRONTMATTER_ID}`);
			if (mod) server.moduleGraph.invalidateModule(mod);
		}
	};
}

export default defineConfig({
	define: {
		// Inlined at build time so prerendered pages and client bundles agree.
		//
		// Two things can build this site: our own workflow, which sets
		// PUBLIC_SITE_ENV, and Cloudflare Pages' Git integration, which does not
		// but does set CF_PAGES_BRANCH. Treat any Cloudflare build off a branch
		// other than the production one as staging, so a preview deploy can never
		// silently ship as indexable production.
		__SITE_ENV__: JSON.stringify(resolveSiteEnv()),
		__BUILD_COMMIT__: JSON.stringify(resolveCommit())
	},
	plugins: [
		projectFrontmatter(),
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['url', 'cookie', 'baseLocale']
		})
	]
});
