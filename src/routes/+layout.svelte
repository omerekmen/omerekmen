<script lang="ts">
	import { initTheme } from '$lib/utils/theme.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	let { children } = $props();

	$effect(() => {
		const cleanup = initTheme();
		return cleanup;
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Header />

<main class="pt-16 lg:pt-20">
	{@render children()}
</main>

<Footer />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
