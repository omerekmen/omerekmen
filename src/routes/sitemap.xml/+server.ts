import { projectMeta } from '$lib/content/projects';
import { allNotes } from '$lib/content/notes';
import { locales, localizeHref } from '$lib/paraglide/runtime';
import { personal } from '$lib/data/personal';

export const prerender = true;

interface Entry {
	path: string;
	priority: string;
	changefreq: string;
}

export function GET() {
	const today = new Date().toISOString().split('T')[0];

	const pages: Entry[] = [
		{ path: '/', priority: '1.0', changefreq: 'weekly' },
		{ path: '/projects', priority: '0.9', changefreq: 'weekly' },
		{ path: '/cv', priority: '0.9', changefreq: 'monthly' },
		{ path: '/s', priority: '0.6', changefreq: 'monthly' },
		{ path: '/notes', priority: '0.8', changefreq: 'monthly' },
		...allNotes().map((n) => ({
			path: `/notes/${n.slug}`,
			priority: '0.7',
			changefreq: 'yearly'
		})),
		...projectMeta('en').map((p) => ({
			path: `/projects/${p.slug}`,
			priority: p.track === 'archive' ? '0.5' : '0.8',
			changefreq: 'monthly'
		}))
	];

	const urls = pages.map((page) => {
		// Every page exists in all five locales; declare them as alternates of each
		// other so the set isn't read as duplicate content.
		const alternates = locales
			.map(
				(locale) =>
					`    <xhtml:link rel="alternate" hreflang="${locale}" href="${personal.website}${localizeHref(page.path, { locale })}" />`
			)
			.join('\n');

		return locales
			.map(
				(locale) => `  <url>
    <loc>${personal.website}${localizeHref(page.path, { locale })}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${personal.website}${page.path}" />
  </url>`
			)
			.join('\n');
	});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' }
	});
}
