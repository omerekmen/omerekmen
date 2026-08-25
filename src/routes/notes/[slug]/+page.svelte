<script lang="ts">
	import { personal } from '$lib/data/personal';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { getNoteBody } from '$lib/content/note-bodies';

	let { data } = $props();

	const meta = $derived(data.meta);
	const Body = $derived(getNoteBody(meta.slug));

	const formatted = $derived(
		new Date(`${meta.date}T00:00:00Z`).toLocaleDateString(data.locale, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		})
	);

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: meta.title,
		description: meta.summary,
		datePublished: meta.date,
		inLanguage: 'en',
		url: `${personal.website}/notes/${meta.slug}`,
		author: { '@type': 'Person', name: personal.name, url: personal.website },
		keywords: meta.tags.join(', ')
	});

	const jsonLdTag = $derived(
		`<script type="application/ld+json">${JSON.stringify(jsonLd)}${'<'}/script>`
	);
</script>

<svelte:head>
	<title>{meta.title} — {personal.name}</title>
	<meta name="description" content={meta.summary} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.summary} />
	<meta property="article:published_time" content={meta.date} />
	<!-- JSON-LD built from typed frontmatter, not from user input. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdTag}
</svelte:head>

<main class="note">
	<nav class="crumb" aria-label="Breadcrumb">
		<a href={localizeHref('/notes')}>{m.notes_all()}</a>
	</nav>

	<header class="head">
		<div class="meta">
			<time datetime={meta.date}>{formatted}</time>
			<span aria-hidden="true">·</span>
			<span>{meta.minutes} {m.notes_read_time()}</span>
		</div>
		<h1>{meta.title}</h1>
		<p class="standfirst">{meta.summary}</p>
		<div class="tags">
			{#each meta.tags as tag (tag)}<span class="tag">{tag}</span>{/each}
		</div>
	</header>

	{#if data.locale !== 'en'}
		<p class="english-note">{m.notes_english_only()}</p>
	{/if}

	{#if data.related}
		<!-- The work the argument came out of, so it can be checked rather than
		     taken on trust. -->
		<a class="related" href={localizeHref(`/projects/${data.related.slug}`)}>
			<span class="related-label">{m.notes_from_project()}</span>
			<span class="related-title">{data.related.title}</span>
		</a>
	{/if}

	{#if Body}
		<div class="prose-body">
			<Body />
		</div>
	{/if}

	{#if data.next && data.next.slug !== meta.slug}
		<a class="next" href={localizeHref(`/notes/${data.next.slug}`)}>
			<span class="next-label">{m.notes_next()}</span>
			<span class="next-title">{data.next.title}</span>
		</a>
	{/if}
</main>

<style>
	.note {
		max-width: 42rem;
		margin-inline: auto;
		padding: 6rem 1.5rem 6rem;
	}

	.crumb {
		margin-bottom: 2.5rem;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.crumb a {
		color: var(--color-text-muted);
		text-decoration: none;
	}

	.crumb a:hover {
		color: var(--color-accent-text);
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	h1 {
		margin: 0;
		font-size: clamp(1.9rem, 5.5vw, 2.9rem);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.12;
		text-wrap: balance;
	}

	.standfirst {
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.65;
		color: var(--color-text-secondary);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.tag {
		border: 1px solid var(--color-border-subtle);
		border-radius: 999px;
		padding: 0.2rem 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		color: var(--color-text-muted);
	}

	.english-note {
		margin: 2rem 0 0;
		border-left: 2px solid var(--color-border);
		padding-left: 0.9rem;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-text-muted);
	}

	.related,
	.next {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		border: 1px solid var(--color-border-subtle);
		border-radius: 12px;
		padding: 1rem 1.25rem;
		text-decoration: none;
		transition: border-color 0.2s ease;
	}

	.related {
		margin-top: 2.5rem;
	}

	.next {
		margin-top: 4rem;
	}

	.related:hover,
	.related:focus-visible,
	.next:hover,
	.next:focus-visible {
		border-color: rgba(var(--color-accent-rgb), 0.5);
	}

	.related-label,
	.next-label {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-accent-text);
	}

	.related-title,
	.next-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
	}

	/* ── Prose ── */
	.prose-body {
		margin-top: 3rem;
	}

	.prose-body :global(h2) {
		margin: 2.75rem 0 0.9rem;
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.015em;
		color: var(--color-text);
	}

	.prose-body :global(p) {
		margin-bottom: 1.15rem;
		font-size: 1.0125rem;
		line-height: 1.78;
		color: var(--color-text-secondary);
	}

	.prose-body :global(ul),
	.prose-body :global(ol) {
		margin: 0 0 1.3rem;
		padding-left: 1.2rem;
		list-style: disc;
	}

	.prose-body :global(li) {
		margin-bottom: 0.5rem;
		line-height: 1.72;
		color: var(--color-text-secondary);
	}

	.prose-body :global(strong) {
		font-weight: 600;
		color: var(--color-text);
	}

	.prose-body :global(em) {
		font-style: italic;
	}

	.prose-body :global(code) {
		border-radius: 4px;
		background: var(--color-bg-secondary);
		padding: 0.1rem 0.35rem;
		font-family: var(--font-mono);
		font-size: 0.875em;
	}

	@media (prefers-reduced-motion: reduce) {
		.related,
		.next {
			transition: none;
		}
	}
</style>
