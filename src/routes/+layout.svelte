<script lang="ts">
	import { page } from '$app/state';
	import { onNavigate, afterNavigate } from '$app/navigation';
	import { locales, localizeHref, deLocalizeUrl } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { initTheme } from '$lib/utils/theme.svelte';
	import { personal } from '$lib/data/personal';
	import { gsap, ScrollSmoother, ScrollTrigger } from '$lib/utils/gsap';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import LanguageSwitcher from '$lib/components/ui/LanguageSwitcher.svelte';
	import CustomCursor from '$lib/components/ui/CustomCursor.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import ContactFooter from '$lib/components/layout/ContactFooter.svelte';
	import './layout.css';

	let { children } = $props();

	// The links page is a standalone card and the CV is a document — neither
	// wants a full-viewport contact footer appended to it.
	const routeId = $derived(page.route.id ?? '');
	const deLocalizedPath = $derived(deLocalizeUrl(page.url).pathname);
	const showHeader = $derived(routeId !== '/s');
	const showFooter = $derived(routeId !== '/s' && routeId !== '/cv');
	let headerEl: HTMLElement | undefined = $state();
	let wrapperEl: HTMLDivElement | undefined = $state();
	let contentEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		const cleanup = initTheme();
		return cleanup;
	});

	// ScrollSmoother — silky smooth scrolling
	$effect(() => {
		if (!wrapperEl || !contentEl) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		const smoother = ScrollSmoother.create({
			wrapper: wrapperEl,
			content: contentEl,
			smooth: 1.2,
			effects: true,
			smoothTouch: 0.1
		});

		return () => {
			smoother.kill();
			// Clean up any pinned elements
			ScrollTrigger.getAll().forEach((t) => t.refresh());
		};
	});

	// Scroll to top after every navigation
	afterNavigate(() => {
		// Reset ScrollSmoother position if active
		const smoother = ScrollSmoother.get();
		if (smoother) {
			smoother.scrollTo(0, false);
		} else {
			window.scrollTo(0, 0);
		}
	});

	// Seamless page transitions via View Transitions API
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	$effect(() => {
		if (!showHeader || !headerEl) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			gsap.set(headerEl, { opacity: 1 });
			return;
		}

		const ctx = gsap.context(() => {
			gsap.fromTo(
				headerEl!,
				{ opacity: 0, y: -10 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 }
			);
		}, headerEl!);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="author" content={personal.name} />
	<meta name="theme-color" content="#050505" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#f5f5f0" media="(prefers-color-scheme: light)" />
	<link rel="canonical" href="{personal.website}{page.url.pathname}" />
	<link rel="sitemap" href="/sitemap.xml" />
	{#each locales as locale (locale)}
		<link
			rel="alternate"
			hreflang={locale}
			href="{personal.website}{localizeHref(deLocalizedPath, { locale })}"
		/>
	{/each}
	<link rel="alternate" hreflang="x-default" href="{personal.website}{deLocalizedPath}" />
</svelte:head>

<!-- ScrollSmoother wrapper structure -->
<div bind:this={wrapperEl} id="smooth-wrapper">
	<div bind:this={contentEl} id="smooth-content">
		<main>
			{#if showHeader}
				<header
					bind:this={headerEl}
					class="absolute top-0 right-0 left-0 z-40 flex items-start gap-4 px-6 pt-6 opacity-0"
				>
					<a
						href={localizeHref('/')}
						class="header-name text-xl tracking-wide text-text transition-colors duration-200 hover:text-accent"
					>
						{personal.name.toUpperCase()}
					</a>
					<span
						class="hidden text-[11px] font-extrabold tracking-[0.18em] text-text-muted/90 uppercase sm:block"
					>
						Software Engineering & <br />Data Engineering
					</span>

					<nav class="ml-auto flex items-center gap-5 pr-14" aria-label="Primary">
						<a href={localizeHref('/projects')} class="nav-link">{m.nav_projects()}</a>
						<a href={localizeHref('/cv')} class="nav-link">{m.nav_cv()}</a>
						<a href={localizeHref('/s')} class="nav-link">{m.nav_links()}</a>
					</nav>
				</header>
			{/if}

			{@render children()}
		</main>

		{#if showFooter}
			<ContactFooter />
		{/if}
	</div>
</div>

<!-- Fixed elements — outside smooth wrapper so they don't get smoothed -->
<div
	class="fixed top-6 right-6 z-50 rounded-full border border-border-subtle/40 bg-bg/60 backdrop-blur-xl"
>
	<ThemeToggle />
</div>

<div
	class="fixed right-6 bottom-6 z-50 rounded-full border border-border-subtle/40 bg-bg/60 backdrop-blur-xl"
>
	<LanguageSwitcher direction="up" />
</div>

<CustomCursor />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<style>
	.nav-link {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		transition: color 0.2s ease;
	}

	.nav-link:hover,
	.nav-link:focus-visible {
		color: var(--color-accent);
	}

	.header-name {
		font-family: 'Bagel Fat One', sans-serif;
	}
</style>
