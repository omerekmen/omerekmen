<script lang="ts">
	import { personal } from '$lib/data/personal';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data } = $props();

	const notes = $derived(data.notes);
	const latest = $derived(notes[0]?.date ?? null);

	const formatted = $derived((iso: string) =>
		new Date(`${iso}T00:00:00Z`).toLocaleDateString(data.locale, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		})
	);
</script>

<svelte:head>
	<title>{m.notes_title()} — {personal.name}</title>
	<meta name="description" content={m.notes_intro()} />
	<meta property="og:title" content="{m.notes_title()} — {personal.name}" />
	<meta property="og:description" content={m.notes_intro()} />
</svelte:head>

<main class="notes">
	<header class="head">
		<h1>{m.notes_title()}</h1>
		<p class="intro">{m.notes_intro()}</p>
		{#if latest}
			<p class="updated">
				<span>{m.notes_updated()}</span>
				<time datetime={latest}>{formatted(latest)}</time>
			</p>
		{/if}
		{#if data.locale !== 'en'}
			<p class="english-note">{m.notes_english_only()}</p>
		{/if}
	</header>

	<ol class="list">
		{#each notes as note (note.slug)}
			<li>
				<a href={localizeHref(`/notes/${note.slug}`)}>
					<div class="meta">
						<time datetime={note.date}>{formatted(note.date)}</time>
						<span class="dot" aria-hidden="true">·</span>
						<span>{note.minutes} {m.notes_read_time()}</span>
					</div>
					<h2>{note.title}</h2>
					<p class="summary">{note.summary}</p>
					<div class="tags">
						{#each note.tags as tag (tag)}<span class="ds-pill">{tag}</span>{/each}
					</div>
				</a>
			</li>
		{/each}
	</ol>
</main>

<style>
	.notes {
		max-width: 46rem;
		margin-inline: auto;
		padding: 7rem 1.5rem 6rem;
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-bottom: 1px solid var(--color-border-subtle);
		padding-bottom: 2.5rem;
	}

	h1 {
		margin: 0;
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(2.5rem, 8vw, 4rem);
		line-height: 1;
		color: var(--color-accent);
	}

	.intro {
		margin: 0;
		max-width: 40rem;
		font-size: var(--text-xl);
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.updated {
		display: flex;
		gap: 0.5rem;
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.english-note {
		margin: 0;
		border-left: 2px solid var(--color-border);
		padding-left: 0.9rem;
		font-size: var(--text-md);
		line-height: 1.6;
		color: var(--color-text-muted);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.list a {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		border-bottom: 1px solid var(--color-border-subtle);
		padding: 2.25rem 0;
		text-decoration: none;
		color: inherit;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.list h2 {
		margin: 0;
		font-size: var(--text-4xl);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.25;
		text-wrap: balance;
		transition: color 0.2s ease;
	}

	.list a:hover h2,
	.list a:focus-visible h2 {
		color: var(--color-accent-text);
	}

	.summary {
		margin: 0;
		max-width: 42rem;
		font-size: var(--text-lg);
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-top: 0.35rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.list h2 {
			transition: none;
		}
	}
</style>
