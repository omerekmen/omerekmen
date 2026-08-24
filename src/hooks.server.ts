import type { Handle, HandleServerError } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

export const handle: Handle = handleParaglide;

/**
 * Shapes what a 500 shows a visitor.
 *
 * SvelteKit's default surfaces "Internal Error" with no context; this keeps the
 * message generic on screen while logging the real one, so the error page can
 * say something useful without leaking a stack trace.
 */
export const handleError: HandleServerError = ({ error, event, status, message }) => {
	console.error(`[${status}] ${event.url.pathname}`, error);
	return { message: status >= 500 ? 'Unexpected error' : message };
};
