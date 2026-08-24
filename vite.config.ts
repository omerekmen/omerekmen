import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const PRODUCTION_BRANCH = 'master';

function resolveSiteEnv() {
	if (process.env.PUBLIC_SITE_ENV === 'staging') return 'staging';
	if (process.env.PUBLIC_SITE_ENV === 'production') return 'production';

	const cfBranch = process.env.CF_PAGES_BRANCH;
	if (cfBranch && cfBranch !== PRODUCTION_BRANCH) return 'staging';

	return 'production';
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
		__SITE_ENV__: JSON.stringify(resolveSiteEnv())
	},
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['url', 'cookie', 'baseLocale']
		})
	]
});
