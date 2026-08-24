import { isStaging } from '$lib/utils/site-env';
import { personal } from '$lib/data/personal';

export const prerender = true;

/**
 * Generated rather than static so staging can exclude itself from search.
 * A staging copy that gets indexed competes with the real site for its own
 * name, which is the one keyword that matters here.
 */
export function GET() {
	const body = isStaging
		? `# Staging — not for indexing
User-agent: *
Disallow: /
`
		: `# ${personal.website}
User-agent: *
Allow: /
Disallow: /lab

# Sitemap
Sitemap: ${personal.website}/sitemap.xml

# AI Agents
# See /llms.txt for structured information about this site and its owner
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'max-age=3600' }
	});
}
