<script lang="ts">
	import { page } from '$app/state';
	import { onNavigate, afterNavigate } from '$app/navigation';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
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
		if (!headerEl) return;

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
	<link rel="canonical" href="https://www.omerekmen.com{page.url.pathname}" />
	<link rel="sitemap" href="/sitemap.xml" />
</svelte:head>

<!-- ScrollSmoother wrapper structure -->
<div bind:this={wrapperEl} id="smooth-wrapper">
	<div bind:this={contentEl} id="smooth-content">
		<main>
			<header
				bind:this={headerEl}
				class="absolute top-0 right-0 left-0 z-40 flex items-center gap-4 px-6 pt-6 opacity-0"
			>
				<a href="/" class="header-name text-xl tracking-wide text-text transition-colors duration-200 hover:text-accent">
					{personal.name.toUpperCase()}
				</a>
				<span class="hidden text-[10px] font-extrabold tracking-[0.2em] text-text-muted/90 uppercase sm:block">
					Data Scientist & <br/>Software Engineer
				</span>
			</header>

			{@render children()}
		</main>

		<ContactFooter />
	</div>
</div>

<!-- Fixed elements — outside smooth wrapper so they don't get smoothed -->
<div class="fixed top-6 right-6 z-50 rounded-full border border-border-subtle/40 bg-bg/60 backdrop-blur-xl">
	<ThemeToggle />
</div>

<div class="fixed right-6 bottom-6 z-50 rounded-full border border-border-subtle/40 bg-bg/60 backdrop-blur-xl">
	<LanguageSwitcher direction="up" />
</div>

<CustomCursor />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<style>
	.header-name {
		font-family: 'Bagel Fat One', sans-serif;
	}
</style>
