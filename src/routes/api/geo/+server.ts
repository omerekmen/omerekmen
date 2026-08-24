import type { RequestHandler } from './$types';

/**
 * The one route that is not prerendered.
 *
 * Every page is baked at build time, so no server sees a visitor and
 * `request.cf` is unreachable from them. This endpoint runs on the edge purely
 * to report the visitor's country, which the relocation notice uses to stay
 * hidden inside Turkey. See docs/ROADMAP.md §"Geo-gating".
 */
export const prerender = false;

export const GET: RequestHandler = ({ platform, setHeaders }) => {
	const country = platform?.cf?.country ?? null;

	setHeaders({
		// Per-visitor by definition — caching this would serve one country's
		// answer to everyone behind the same edge node.
		'Cache-Control': 'no-store'
	});

	return new Response(JSON.stringify({ country }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
