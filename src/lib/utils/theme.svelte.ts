import { browser } from '$app/environment';
import type { Theme, ResolvedTheme } from '$lib/types';

const STORAGE_KEY = 'theme-preference';

function getSystemTheme(): ResolvedTheme {
	if (!browser) return 'dark';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
	if (!browser) return 'auto';
	return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'auto';
}

function applyTheme(resolved: ResolvedTheme) {
	if (!browser) return;
	document.documentElement.setAttribute('data-theme', resolved);
}

let theme = $state<Theme>(getStoredTheme());

// eslint-disable-next-line prefer-const
let resolvedTheme = $derived<ResolvedTheme>(theme === 'auto' ? getSystemTheme() : theme);

export function getTheme(): Theme {
	return theme;
}

export function getResolvedTheme(): ResolvedTheme {
	return resolvedTheme;
}

export function setTheme(newTheme: Theme) {
	theme = newTheme;
	if (browser) {
		localStorage.setItem(STORAGE_KEY, newTheme);
		applyTheme(newTheme === 'auto' ? getSystemTheme() : newTheme);
	}
}

export function toggleTheme() {
	const cycle: Theme[] = ['light', 'dark', 'auto'];
	const next = cycle[(cycle.indexOf(theme) + 1) % cycle.length];
	setTheme(next);
}

export function initTheme() {
	if (!browser) return;

	applyTheme(resolvedTheme);

	const mql = window.matchMedia('(prefers-color-scheme: dark)');
	const handler = () => {
		if (theme === 'auto') {
			applyTheme(getSystemTheme());
		}
	};
	mql.addEventListener('change', handler);

	return () => mql.removeEventListener('change', handler);
}
