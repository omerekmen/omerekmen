<script lang="ts">
	import { personal } from '$lib/data/personal';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { getProject } from '$lib/content/projects';
	import { gsap } from '$lib/utils/gsap';
	import TrackBadge from '$lib/components/ui/TrackBadge.svelte';

	let { data } = $props();

	const meta = $derived(data.meta);
	const entry = $derived(getProject(meta.slug, data.locale));
	const Body = $derived(entry?.body ?? null);
	const number = $derived(String(data.index).padStart(2, '0'));

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: meta.title,
		description: meta.summary,
		url: `${personal.website}/projects/${meta.slug}`,
		author: { '@type': 'Person', name: personal.name, url: personal.website },
		keywords: [...meta.stack, ...meta.domains].join(', '),
		...(meta.links.github ? { codeRepository: meta.links.github } : {})
	});
	const ogImage = $derived(`${personal.website}/og/${meta.slug}.jpg`);

	const jsonLdTag = $derived(
		`<script type="application/ld+json">${JSON.stringify(jsonLd)}${'<'}/script>`
	);

	/** The marquee repeats the title, so it reads better uppercase. */
	const marqueeTitle = $derived(meta.title.toUpperCase());

	let pageEl: HTMLElement | undefined = $state();
	let heroEl: HTMLElement | undefined = $state();
	let numberEl: HTMLDivElement | undefined = $state();
	let outlineTrackEl: HTMLDivElement | undefined = $state();
	let solidTrackEl: HTMLDivElement | undefined = $state();
	let badgeEl: HTMLDivElement | undefined = $state();
	let scrollIndicatorEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!pageEl || !heroEl) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			gsap.set(pageEl.querySelectorAll('.reveal, .hero-meta'), { opacity: 1, y: 0 });
			return;
		}

		// ═══ Continuous marquee ═══
		// Pixel-based speed, so a long title and a short one slide at the same
		// visual rate. Each track holds two copies and wraps at half its width.
		const pxPerSecond = 60;
		let direction = 1;
		let lastScrollY = window.scrollY;
		let outlineX = 0;
		let solidX = 0;

		const tick = (_time: number, delta: number) => {
			const outlineHalf = outlineTrackEl ? outlineTrackEl.scrollWidth / 2 : 1;
			const solidHalf = solidTrackEl ? solidTrackEl.scrollWidth / 2 : 1;
			const px = pxPerSecond * (delta / 1000) * direction;

			outlineX = (((outlineX - px) % outlineHalf) + outlineHalf) % outlineHalf;
			solidX = (((solidX + px) % solidHalf) + solidHalf) % solidHalf;

			if (outlineTrackEl) gsap.set(outlineTrackEl, { x: -outlineX });
			if (solidTrackEl) gsap.set(solidTrackEl, { x: -solidX });
		};
		gsap.ticker.add(tick);

		// Scrolling down runs the rows one way, scrolling up reverses them.
		const onScroll = () => {
			const y = window.scrollY;
			if (y !== lastScrollY) direction = y > lastScrollY ? 1 : -1;
			lastScrollY = y;
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
			if (numberEl) tl.from(numberEl, { opacity: 0, scale: 0.85, duration: 1.1 }, 0);
			if (outlineTrackEl?.parentElement)
				tl.from(outlineTrackEl.parentElement, { opacity: 0, duration: 1.1 }, 0.1);
			if (solidTrackEl?.parentElement)
				tl.from(solidTrackEl.parentElement, { opacity: 0, duration: 1.1 }, 0.2);
			tl.from('.hero-meta', { opacity: 0, y: 14, duration: 0.6 }, 0.5);
			if (badgeEl) tl.from(badgeEl, { opacity: 0, y: 16, duration: 0.6 }, 0.6);
			if (scrollIndicatorEl) tl.from(scrollIndicatorEl, { opacity: 0, y: 10, duration: 0.6 }, 0.8);

			pageEl!.querySelectorAll('.reveal').forEach((el) => {
				gsap.from(el, {
					opacity: 0,
					y: 24,
					duration: 0.6,
					scrollTrigger: { trigger: el, start: 'top 85%', once: true }
				});
			});
		}, pageEl);

		return () => {
			ctx.revert();
			gsap.ticker.remove(tick);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<svelte:head>
	<title>{meta.title} — {personal.name}</title>
	<meta name="description" content={meta.summary} />

	<meta property="og:type" content="article" />
	<meta property="og:url" content="{personal.website}/projects/{meta.slug}" />
	<meta property="og:title" content="{meta.title} — {personal.name}" />
	<meta property="og:description" content={meta.summary} />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{meta.title} — {personal.name}" />
	<meta name="twitter:description" content={meta.summary} />
	<meta name="twitter:image" content={ogImage} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdTag}
</svelte:head>

{#key meta.slug}
	<article bind:this={pageEl} class="min-h-screen">
		<!-- ═══ HERO ═══ -->
		<header
			bind:this={heroEl}
			class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden border-b border-border-subtle"
		>
			<!-- Oversized project number, sitting behind everything -->
			<div
				bind:this={numberEl}
				class="number pointer-events-none absolute top-24 left-8 select-none sm:left-12 lg:left-20"
				aria-hidden="true"
			>
				{number}
			</div>

			<!-- The title is carried by the marquee below, which is decorative.
			     This keeps a real heading for assistive tech and search. -->
			<h1 class="sr-only">{meta.title}</h1>

			<!-- Counter-rotating marquee: an outlined row sliding one way, a
			     filled row the other. Direction flips with scroll direction. -->
			<div
				class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none"
				aria-hidden="true"
			>
				<div class="title-row-wrapper" style="transform: rotate(5deg);">
					<div bind:this={outlineTrackEl} class="title-track">
						{#each [0, 1, 2, 3, 4, 5] as idx (idx)}
							<span class="title-outline">{marqueeTitle}</span>
						{/each}
					</div>
				</div>

				<div class="title-row-wrapper" style="transform: rotate(-5deg);">
					<div bind:this={solidTrackEl} class="title-track">
						{#each [0, 1, 2, 3, 4, 5] as idx (idx)}
							<span class="title-solid">{marqueeTitle}</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- Breadcrumb, top -->
			<div
				class="hero-meta absolute top-28 right-8 left-8 z-10 flex items-center gap-3 font-mono text-[11px] tracking-widest text-text-muted sm:left-12 lg:left-20"
			>
				<a href={localizeHref('/projects')} class="transition-colors hover:text-accent-text"
					>{m.projects_eyebrow()}</a
				>
				<span aria-hidden="true">/</span>
				<span class="tabular-nums">{number} of {String(data.total).padStart(2, '0')}</span>
			</div>

			<!-- Status and period, bottom left -->
			<div
				bind:this={badgeEl}
				class="absolute bottom-24 left-8 z-10 flex flex-wrap items-center gap-3 sm:left-12 lg:left-20"
			>
				<TrackBadge track={meta.track} progress={meta.progress} />
				<span class="font-mono text-[11px] tracking-wide text-text-muted">{meta.period}</span>
			</div>

			<!-- Scroll indicator -->
			<div
				bind:this={scrollIndicatorEl}
				class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
				aria-hidden="true"
			>
				<div class="flex flex-col items-center gap-2">
					<span class="font-mono text-[10px] tracking-widest text-text-muted uppercase"
						>{m.nav_scroll()}</span
					>
					<div class="scroll-line h-8 w-px"></div>
				</div>
			</div>
		</header>

		<!-- ═══ SUMMARY ═══ -->
		<section class="reveal border-b border-border-subtle px-6 py-14 sm:px-10 lg:px-16">
			<div class="mx-auto max-w-4xl">
				{#if data.untranslated}
					<p class="untranslated">{m.project_untranslated()}</p>
				{/if}
				<p class="text-lg leading-relaxed text-text-secondary">{meta.summary}</p>
			</div>
		</section>

		<!-- ═══ AT A GLANCE ═══ -->
		<section class="reveal border-b border-border-subtle px-6 py-12 sm:px-10 lg:px-16">
			<div class="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2">
				<div>
					<h2 class="section-label">{m.detail_role()}</h2>
					<p class="mt-3 leading-relaxed text-text-secondary">{meta.role}</p>
				</div>

				<div>
					<h2 class="section-label">{m.detail_links()}</h2>
					<div class="mt-3 flex flex-col gap-2">
						{#if meta.links.github}
							<a href={meta.links.github} target="_blank" rel="noopener noreferrer" class="link">
								{m.detail_source_github()} &rarr;
							</a>
						{/if}
						{#if meta.links.demo}
							<a href={meta.links.demo} target="_blank" rel="noopener noreferrer" class="link">
								{m.detail_demo()} &rarr;
							</a>
						{/if}
						{#if !meta.links.github && !meta.links.demo}
							<p class="text-sm text-text-muted">
								{meta.confidential ? m.detail_confidential() : m.detail_no_repo()}
							</p>
						{/if}
					</div>
				</div>

				{#if meta.metrics.length > 0}
					<div class="sm:col-span-2">
						<h2 class="section-label">{m.detail_outcome()}</h2>
						<dl class="mt-4 flex flex-wrap gap-x-12 gap-y-4">
							{#each meta.metrics as metric (metric.label)}
								<div>
									<dt class="font-mono text-[10px] tracking-widest text-text-muted uppercase">
										{metric.label}
									</dt>
									<dd class="mt-1 font-mono text-2xl font-black text-accent-text tabular-nums">
										{metric.value}
									</dd>
								</div>
							{/each}
						</dl>
					</div>
				{/if}

				<div class="sm:col-span-2">
					<h2 class="section-label">{m.detail_stack()}</h2>
					<div class="mt-4 flex flex-wrap gap-2">
						{#each meta.stack as tech (tech)}
							<span class="tech">{tech}</span>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<!-- ═══ CASE STUDY ═══ -->
		{#if Body}
			<section class="px-6 py-16 sm:px-10 lg:px-16">
				<div class="prose-body reveal mx-auto max-w-2xl">
					<Body />
				</div>
			</section>
		{/if}

		<!-- ═══ NEXT ═══ -->
		{#if data.next}
			<nav class="border-t border-border-subtle" aria-label="Next project">
				<a
					href={localizeHref(`/projects/${data.next.slug}`)}
					data-cursor="Next"
					class="group block px-6 py-16 transition-colors duration-300 hover:bg-bg-secondary/40 sm:px-10 lg:px-16"
				>
					<div class="mx-auto max-w-4xl">
						<span class="font-mono text-[11px] tracking-widest text-text-muted uppercase">
							{m.detail_next()}
						</span>
						<div class="mt-4 flex items-center gap-5">
							<h2
								class="next-title text-text transition-colors duration-200 group-hover:text-accent-text"
							>
								{data.next.title}
							</h2>
							<svg
								class="h-7 w-7 shrink-0 text-text-muted transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent-text"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<line x1="5" y1="12" x2="19" y2="12" />
								<polyline points="12 5 19 12 12 19" />
							</svg>
						</div>
					</div>
				</a>
			</nav>
		{/if}
	</article>
{/key}

<style>
	.untranslated {
		display: inline-block;
		margin-bottom: 1.25rem;
		border: 1px solid var(--color-border-subtle);
		border-radius: 999px;
		background: var(--color-bg-secondary);
		padding: 0.3rem 0.8rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		color: var(--color-text-muted);
	}

	/* ── Hero marquee ── */
	.title-row-wrapper {
		display: flex;
		width: 200vw;
		align-items: center;
		overflow: visible;
	}

	.title-track {
		display: flex;
		align-items: center;
		gap: 0.4em;
		white-space: nowrap;
		font-family: 'Bagel Fat One', 'Anton', 'Impact', sans-serif;
		font-size: clamp(5rem, 15vw, 14rem);
		line-height: 0;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		will-change: transform;
	}

	/* Stroke only — reads as the ghost behind the filled row. */
	.title-outline {
		color: transparent;
		-webkit-text-stroke: 1px rgba(var(--color-text-rgb), 0.2);
		paint-order: stroke fill;
	}

	.title-solid {
		color: var(--color-text);
	}

	.number {
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(6rem, 20vw, 22rem);
		font-weight: 900;
		line-height: 1;
		letter-spacing: -0.05em;
		color: rgba(var(--color-accent-rgb), 0.06);
	}

	.scroll-line {
		background: linear-gradient(to bottom, rgba(var(--color-text-rgb), 0.35), transparent);
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
		.scroll-line {
			animation: none;
		}
	}

	.next-title {
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(1.75rem, 5vw, 3.25rem);
		line-height: 1.1;
	}

	.section-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-accent-text);
	}

	.link {
		font-size: 14px;
		font-weight: 500;
		color: var(--color-accent-text);
		transition: color 0.15s ease;
	}

	.link:hover {
		color: var(--color-accent-hover);
	}

	.tech {
		border-radius: 999px;
		border: 1px solid var(--color-border-subtle);
		background: var(--color-bg-secondary);
		padding: 0.4rem 0.9rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		color: var(--color-text-secondary);
	}

	/* ── Case-study prose ── */
	.prose-body :global(h2) {
		margin: 3rem 0 1rem;
		font-size: 1.35rem;
		font-weight: 700;
		letter-spacing: -0.015em;
		color: var(--color-text);
	}

	.prose-body :global(h2:first-child) {
		margin-top: 0;
	}

	.prose-body :global(h3) {
		margin: 2rem 0 0.75rem;
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.prose-body :global(p) {
		margin-bottom: 1.15rem;
		line-height: 1.75;
		color: var(--color-text-secondary);
	}

	.prose-body :global(ul),
	.prose-body :global(ol) {
		margin: 0 0 1.4rem;
		padding-left: 1.25rem;
		list-style: disc;
	}

	.prose-body :global(ol) {
		list-style: decimal;
	}

	.prose-body :global(li) {
		margin-bottom: 0.5rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.prose-body :global(strong) {
		font-weight: 600;
		color: var(--color-text);
	}

	.prose-body :global(a) {
		color: var(--color-accent-text);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.prose-body :global(code) {
		border-radius: 4px;
		background: var(--color-bg-tertiary);
		padding: 0.1rem 0.35rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.85em;
	}

	.prose-body :global(pre) {
		overflow-x: auto;
		border: 1px solid var(--color-border-subtle);
		border-radius: 10px;
		background: var(--color-bg-secondary);
		padding: 1rem 1.15rem;
		margin-bottom: 1.4rem;
	}

	.prose-body :global(pre code) {
		background: none;
		padding: 0;
	}

	.prose-body :global(blockquote) {
		margin: 0 0 1.4rem;
		border-left: 2px solid rgba(var(--color-accent-rgb), 0.4);
		padding-left: 1.1rem;
		color: var(--color-text-muted);
	}

	.prose-body :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 10px;
		border: 1px solid var(--color-border-subtle);
	}
</style>
