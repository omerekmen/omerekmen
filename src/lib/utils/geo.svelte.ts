import { browser } from '$app/environment';

/** Countries the relocation notice stays hidden in. */
const HIDDEN_IN = new Set(['TR']);

let country = $state<string | null>(null);
let resolved = $state(false);

/**
 * Whether to show the relocation notice.
 *
 * Defaults to hidden and reveals once the country is known, so the notice can
 * never flash inside Turkey on a slow connection. A failed lookup stays hidden
 * for the same reason.
 */
export function showRelocationNotice(): boolean {
	return resolved && country !== null && !HIDDEN_IN.has(country);
}

export function resolveCountry() {
	if (!browser || resolved) return;

	fetch('/api/geo')
		.then((r) => (r.ok ? r.json() : null))
		.then((data: { country?: string | null } | null) => {
			country = data?.country ?? null;
		})
		.catch(() => {
			country = null;
		})
		.finally(() => {
			resolved = true;
		});
}
