<script lang="ts">
	import { personal } from '$lib/data/personal';
	import { getProject } from '$lib/content/projects';
	import { gsap, SplitText } from '$lib/utils/gsap';
	import TrackBadge from '$lib/components/ui/TrackBadge.svelte';

	let { data } = $props();

	const meta = $derived(data.meta);
	const entry = $derived(getProject(meta.slug));
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
	const jsonLdTag = $derived(
		`<script type="application/ld+json">${JSON.stringify(jsonLd)}${'<'}/script>`
	);

	let pageEl: HTMLElement | undefined = $state();
	let titleEl: HTMLHeadingElement | undefined = $state();

	$effect(() => {
		if (!pageEl || !titleEl) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			gsap.set(pageEl.querySelectorAll('.reveal'), { opacity: 1, y: 0 });
			return;
		}

		const ctx = gsap.context(() => {
			const split = new SplitText(titleEl!, { type: 'words' });
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
			tl.from(split.words, { opacity: 0, y: 40, stagger: 0.06, duration: 0.7, delay: 0.1 });
			tl.from('.hero-meta', { opacity: 0, y: 16, duration: 0.5 }, '-=0.35');

			pageEl!.querySelectorAll('.reveal').forEach((el) => {
				gsap.from(el, {
					opacity: 0,
					y: 24,
					duration: 0.6,
					scrollTrigger: { trigger: el, start: 'top 85%', once: true }
				});
			});
		}, pageEl);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>{meta.title} — {personal.name}</title>
	<meta name="description" content={meta.summary} />

	<meta property="og:type" content="article" />
	<meta property="og:url" content="{personal.website}/projects/{meta.slug}" />
	<meta property="og:title" content="{meta.title} — {personal.name}" />
	<meta property="og:description" content={meta.summary} />
	<meta property="og:image" content="{personal.website}/og-image.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{meta.title} — {personal.name}" />
	<meta name="twitter:description" content={meta.summary} />
	<meta name="twitter:image" content="{personal.website}/og-image.jpg" />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdTag}
</svelte:head>

{#key meta.slug}
	<article bind:this={pageEl} class="min-h-screen">
		<!-- ═══ HERO ═══ -->
		<header class="border-b border-border-subtle px-6 pt-28 pb-14 sm:px-10 lg:px-16">
			<div class="mx-auto max-w-4xl">
				<div class="flex items-center gap-3 font-mono text-[11px] tracking-widest text-text-muted">
					<a href="/projects" class="transition-colors hover:text-accent">Projects</a>
					<span aria-hidden="true">/</span>
					<span class="tabular-nums">{number} of {String(data.total).padStart(2, '0')}</span>
				</div>

				<h1 bind:this={titleEl} class="project-title mt-6 text-text">{meta.title}</h1>

				<div class="hero-meta mt-7 flex flex-wrap items-center gap-3">
					<TrackBadge track={meta.track} progress={meta.progress} />
					<span class="font-mono text-[11px] tracking-wide text-text-muted">{meta.period}</span>
				</div>

				<p class="hero-meta mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
					{meta.summary}
				</p>
			</div>
		</header>

		<!-- ═══ AT A GLANCE ═══ -->
		<section class="reveal border-b border-border-subtle px-6 py-12 sm:px-10 lg:px-16">
			<div class="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2">
				<div>
					<h2 class="section-label">Role</h2>
					<p class="mt-3 leading-relaxed text-text-secondary">{meta.role}</p>
				</div>

				<div>
					<h2 class="section-label">Links</h2>
					<div class="mt-3 flex flex-col gap-2">
						{#if meta.links.github}
							<a href={meta.links.github} target="_blank" rel="noopener noreferrer" class="link">
								Source on GitHub &rarr;
							</a>
						{/if}
						{#if meta.links.demo}
							<a href={meta.links.demo} target="_blank" rel="noopener noreferrer" class="link">
								Live demo &rarr;
							</a>
						{/if}
						{#if !meta.links.github && !meta.links.demo}
							<p class="text-sm text-text-muted">
								{meta.confidential
									? 'Client work — source not public.'
									: 'No public repository yet.'}
							</p>
						{/if}
					</div>
				</div>

				{#if meta.metrics.length > 0}
					<div class="sm:col-span-2">
						<h2 class="section-label">Outcome</h2>
						<dl class="mt-4 flex flex-wrap gap-x-12 gap-y-4">
							{#each meta.metrics as metric (metric.label)}
								<div>
									<dt class="font-mono text-[10px] tracking-widest text-text-muted uppercase">
										{metric.label}
									</dt>
									<dd class="mt-1 font-mono text-2xl font-black text-accent tabular-nums">
										{metric.value}
									</dd>
								</div>
							{/each}
						</dl>
					</div>
				{/if}

				<div class="sm:col-span-2">
					<h2 class="section-label">Stack</h2>
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
					href="/projects/{data.next.slug}"
					data-cursor="Next"
					class="group block px-6 py-16 transition-colors duration-300 hover:bg-bg-secondary/40 sm:px-10 lg:px-16"
				>
					<div class="mx-auto max-w-4xl">
						<span class="font-mono text-[11px] tracking-widest text-text-muted uppercase">
							Next project
						</span>
						<div class="mt-4 flex items-center gap-5">
							<h2
								class="next-title text-text transition-colors duration-200 group-hover:text-accent"
							>
								{data.next.title}
							</h2>
							<svg
								class="h-7 w-7 shrink-0 text-text-muted transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent"
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
	.project-title {
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(2.25rem, 7vw, 4.5rem);
		line-height: 1.03;
		letter-spacing: -0.01em;
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
		color: var(--color-accent);
	}

	.link {
		font-size: 14px;
		font-weight: 500;
		color: var(--color-accent);
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
		color: var(--color-accent);
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
