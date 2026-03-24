<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { gsap, SplitText } from '$lib/utils/gsap';
	import { personal } from '$lib/data/personal';
	import { skillGroups } from '$lib/data/skills';
	import NeuralNetwork3D from '$lib/components/visualizations/NeuralNetwork3D.svelte';

	// Safe dynamic message lookup
	function msg(key: string): string {
		const fn = (m as unknown as Record<string, (() => string) | undefined>)[key];
		return fn?.() ?? key;
	}

	// Refs
	let sectionEl: HTMLElement | undefined = $state();
	let nameEl: HTMLHeadingElement | undefined = $state();
	let titleEl: HTMLParagraphElement | undefined = $state();
	let badgeEl: HTMLDivElement | undefined = $state();
	let aboutEl: HTMLParagraphElement | undefined = $state();
	let focusEl: HTMLDivElement | undefined = $state();
	let socialsEl: HTMLDivElement | undefined = $state();
	let marqueeEl: HTMLDivElement | undefined = $state();
	let watermarkDataEl: HTMLDivElement | undefined = $state();
	let watermarkCodeEl: HTMLDivElement | undefined = $state();
	let scrollIndicatorEl: HTMLDivElement | undefined = $state();

	// Hero animation
	$effect(() => {
		if (!sectionEl || !nameEl) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			const elements = [
				nameEl,
				titleEl,
				badgeEl,
				aboutEl,
				focusEl,
				socialsEl,
				marqueeEl,
				watermarkDataEl,
				watermarkCodeEl,
				scrollIndicatorEl
			];
			for (const el of elements) {
				if (el) gsap.set(el, { opacity: 1 });
			}
			return;
		}

		const ctx = gsap.context(() => {
			const splitName = new SplitText(nameEl!, { type: 'chars' });
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

			tl.from(splitName.chars, {
				opacity: 0,
				y: 80,
				rotateX: -90,
				stagger: 0.04,
				duration: 1,
				delay: 0.3
			});

			if (titleEl) tl.from(titleEl, { opacity: 0, y: 30, duration: 0.8 }, '-=0.4');
			if (badgeEl) tl.from(badgeEl, { opacity: 0, y: 20, duration: 0.6 }, '-=0.5');
			if (aboutEl) tl.from(aboutEl, { opacity: 0, y: 20, duration: 0.8 }, '-=0.3');
			if (focusEl) tl.from(focusEl, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4');
			if (socialsEl) tl.from(socialsEl, { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');

			if (watermarkDataEl) {
				tl.from(watermarkDataEl, { opacity: 0, duration: 1.5, ease: 'power2.out' }, 0.3);
				gsap.fromTo(
					watermarkDataEl,
					{ xPercent: -10 },
					{
						xPercent: 20,
						ease: 'none',
						scrollTrigger: {
							trigger: sectionEl,
							start: 'top top',
							end: 'bottom top',
							scrub: true
						}
					}
				);
			}
			if (watermarkCodeEl) {
				tl.from(watermarkCodeEl, { opacity: 0, duration: 1.5, ease: 'power2.out' }, 0.5);
				gsap.fromTo(
					watermarkCodeEl,
					{ xPercent: 10 },
					{
						xPercent: -20,
						ease: 'none',
						scrollTrigger: {
							trigger: sectionEl,
							start: 'top top',
							end: 'bottom top',
							scrub: true
						}
					}
				);
			}

			if (marqueeEl) tl.from(marqueeEl, { opacity: 0, y: 20, duration: 0.8 }, '-=0.8');
			if (scrollIndicatorEl) tl.from(scrollIndicatorEl, { opacity: 0, y: 10, duration: 0.6 }, '-=0.5');
		}, sectionEl);

		return () => ctx.revert();
	});

	// Marquee items
	interface MarqueeItem {
		text: string;
		isCategory: boolean;
	}
	const marqueeItems: MarqueeItem[] = skillGroups.flatMap((g) => [
		{ text: g.categoryKey, isCategory: true },
		...g.skills.map((s) => ({ text: s, isCategory: false }))
	]);
</script>

<section bind:this={sectionEl} id="top" class="relative flex min-h-screen flex-col overflow-hidden">
	<NeuralNetwork3D />

	<!-- Background watermark text — opposing scroll directions -->
	<div
		class="pointer-events-none absolute top-1/2 right-0 z-1 -translate-y-1/2 select-none"
		aria-hidden="true"
	>
		<div
			bind:this={watermarkDataEl}
			class="leading-none font-black tracking-tighter text-text/3"
			style="font-size: clamp(8rem, 20vw, 28rem);"
		>
			DATA
		</div>
		<div
			bind:this={watermarkCodeEl}
			class="leading-none font-black tracking-tighter text-text/3"
			style="font-size: clamp(8rem, 20vw, 28rem);"
		>
			CODE
		</div>
	</div>

	<!-- Main content area -->
	<div
		class="relative z-10 flex flex-1 flex-col justify-center gap-8 px-4 py-24 sm:px-8 lg:px-16"
	>
		<!-- Personal card -->
		<div
			class="hero-card w-full max-w-md rounded-2xl border border-border-subtle bg-bg/70 p-8 backdrop-blur-xl"
		>
			<!-- Eyebrow -->
			<p
				bind:this={badgeEl}
				class="flex items-center gap-2 font-mono text-[11px] tracking-widest text-accent uppercase"
			>
				<span class="relative flex h-1.5 w-1.5">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60"
					></span>
					<span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent"></span>
				</span>
				Open to opportunities
			</p>

			<!-- Name -->
			<h1
				bind:this={nameEl}
				class="mt-4 text-4xl tracking-tight text-text sm:text-5xl"
				style="perspective: 400px; font-family: 'Bagel Fat One', sans-serif;"
			>
				{personal.name.toUpperCase()}
			</h1>

			<!-- Tagline -->
			<p bind:this={titleEl} class="mt-3 text-lg leading-snug font-medium text-text-secondary">
				{m.hero_title()}
			</p>

			<!-- Divider -->
			<div bind:this={aboutEl} class="mt-6">
				<div class="mb-4 h-px w-12 bg-accent/40"></div>
				<p class="text-sm leading-relaxed text-text-muted">
					{m.hero_about?.() ?? m.hero_subtitle()}
				</p>
			</div>

			<!-- Focus pills -->
			<div bind:this={focusEl} class="mt-5 flex flex-wrap gap-2">
				{#each (m.hero_focus_items?.() ?? 'Rust Systems · Data Pipelines · Cloud Platforms').split(' · ') as item (item)}
					<span
						class="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent"
					>
						{item}
					</span>
				{/each}
			</div>

			<!-- Social Links -->
			<div bind:this={socialsEl} class="mt-8 flex items-center justify-between">
				<div class="flex items-center gap-5">
					<a
						href={personal.github}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-text"
						aria-label="GitHub"
					>
						<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
						<span>GitHub</span>
					</a>

					<a
						href={personal.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-text"
						aria-label="LinkedIn"
					>
						<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
						</svg>
						<span>LinkedIn</span>
					</a>

					<a
						href="mailto:{personal.email}"
						class="flex items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-text"
						aria-label="Email"
					>
						<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
							<polyline points="22,6 12,13 2,6" />
						</svg>
						<span>Email</span>
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Tech marquee at the bottom of hero -->
	<div
		bind:this={marqueeEl}
		class="marquee-container relative z-10 mb-25 overflow-hidden border-y border-border-subtle/30 bg-bg/30 py-3 backdrop-blur-sm"
	>
		<div class="marquee-track flex items-center gap-8 whitespace-nowrap">
			{#each [0, 1] as set (set)}
				{#each marqueeItems as item, idx (set + '-' + idx)}
					{#if item.isCategory}
						<span class="text-xs font-bold tracking-widest text-accent/70 uppercase">
							{msg(item.text)}
						</span>
						<span class="text-accent/30">--</span>
					{:else}
						<span
							class="font-mono text-xs font-medium tracking-wider text-text-muted/60 uppercase"
						>
							{item.text}
						</span>
						<span class="text-accent/20">·</span>
					{/if}
				{/each}
				<span class="text-accent/40">///</span>
			{/each}
		</div>
	</div>

	<!-- Scroll indicator -->
	<div
		bind:this={scrollIndicatorEl}
		class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
		aria-hidden="true"
	>
		<div class="flex flex-col items-center gap-2">
			<span class="font-mono text-[10px] tracking-widest text-text-muted/60 uppercase">Scroll</span>
			<div class="scroll-line h-8 w-px"></div>
		</div>
	</div>
</section>

<style>
	.marquee-track {
		animation: marquee 40s linear infinite;
		width: max-content;
	}
	.marquee-container:hover .marquee-track {
		animation-play-state: paused;
	}
	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
	.scroll-line {
		background: linear-gradient(
			to bottom,
			rgba(var(--color-accent-rgb), 0.4),
			transparent
		);
		animation: scroll-pulse 2s ease-in-out infinite;
	}

	@keyframes scroll-pulse {
		0%,
		100% {
			opacity: 0.4;
			transform: scaleY(1);
		}
		50% {
			opacity: 1;
			transform: scaleY(1.3);
			transform-origin: top;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}
		.scroll-line {
			animation: none;
		}
	}
</style>
