import { projects } from '$lib/data/projects';

export const prerender = true;

export function GET() {
	const baseUrl = 'https://www.omerekmen.com';
	const today = new Date().toISOString().split('T')[0];

	const staticPages = [
		{ path: '/', priority: '1.0', changefreq: 'weekly' },
		{ path: '/cv', priority: '0.9', changefreq: 'monthly' },
		{ path: '/s', priority: '0.7', changefreq: 'monthly' }
	];

	const projectPages = projects.map((p) => ({
		path: `/projects/${p.id}`,
		priority: '0.8',
		changefreq: 'monthly'
	}));

	const allPages = [...staticPages, ...projectPages];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page) => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
