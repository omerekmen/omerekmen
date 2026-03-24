<script lang="ts">
	import { getTheme, toggleTheme } from '$lib/utils/theme.svelte';
	import type { Theme } from '$lib/types';

	const theme: Theme = $derived(getTheme());
</script>

<button
	onclick={toggleTheme}
	class="group relative flex h-10 w-10 items-center justify-center rounded-full bg-transparent transition-colors duration-200 hover:border-border hover:bg-bg-secondary"
	aria-label="Toggle theme"
>
	<!-- Sun icon (light mode) -->
	<svg
		class="absolute h-5 w-5 text-text-secondary transition-all duration-300 {theme === 'light'
			? 'scale-100 rotate-0 opacity-100'
			: 'scale-0 rotate-90 opacity-0'}"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="12" cy="12" r="5" />
		<line x1="12" y1="1" x2="12" y2="3" />
		<line x1="12" y1="21" x2="12" y2="23" />
		<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
		<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
		<line x1="1" y1="12" x2="3" y2="12" />
		<line x1="21" y1="12" x2="23" y2="12" />
		<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
		<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
	</svg>

	<!-- Moon icon (dark mode) -->
	<svg
		class="absolute h-5 w-5 text-text-secondary transition-all duration-300 {theme === 'dark'
			? 'scale-100 rotate-0 opacity-100'
			: 'scale-0 -rotate-90 opacity-0'}"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	</svg>

	<!-- Auto icon (system mode) -->
	<svg
		class="absolute h-5 w-5 text-text-secondary transition-all duration-300 {theme === 'auto'
			? 'scale-100 rotate-0 opacity-100'
			: 'scale-0 rotate-90 opacity-0'}"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
		<line x1="8" y1="21" x2="16" y2="21" />
		<line x1="12" y1="17" x2="12" y2="21" />
	</svg>
</button>
