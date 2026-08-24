import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex({ extensions: ['.md'] })],
	kit: {
		adapter: adapter({
			/*
			 * Cloudflare caps _routes.json at 100 rules. The default excludes every
			 * prerendered page by name, which is five rules per page across the five
			 * locales — already over the cap, so a rule was being dropped silently.
			 *
			 * Excluding only the build output and static files keeps the list at a
			 * couple of dozen rules however many projects get added. Pages then reach
			 * the Worker, which serves the same prerendered HTML from the asset
			 * binding — and unknown paths still reach it too, which is what makes the
			 * localised 404 possible. A static exclude would hand those to
			 * Cloudflare's own error page instead.
			 */
			routes: { include: ['/*'], exclude: ['<build>', '<files>'] }
		})
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;
