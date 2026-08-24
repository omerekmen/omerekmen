<script lang="ts">
	const directions = [
		{
			id: 'a',
			name: 'Refined Kinetic',
			thesis: 'The current identity, executed properly.',
			detail:
				'Bagel Fat One stays, the oversized type stays, the scroll choreography stays — but with real project metrics, fixed contrast, a working reduced-motion path and Canvas 2D instead of Three.js. Lowest risk; keeps what makes the site memorable.',
			risk: 'Reads as a creative portfolio. An asset for design-adjacent roles, a mild liability for enterprise data engineering.'
		},
		{
			id: 'b',
			name: 'Systems',
			thesis: 'The display font recedes and the work becomes the visual.',
			detail:
				'The hero is the actual Fabric pipeline you operate, drawn as a diagram. Projects are records in a table with monospace metadata and a signal column, not cards. Reads like an internal engineering console.',
			risk: 'Less personality. If someone is hiring for taste as well as rigour, this says less about you.'
		},
		{
			id: 'c',
			name: 'Editorial',
			thesis: 'A publication, with the case study as the centrepiece.',
			detail:
				'New type system built on Newsreader, an asymmetric grid with a sticky metadata margin, and motion reduced to two deliberate moments. Optimised for people who actually read.',
			risk: 'Demands real writing. With thin case studies it looks empty in a way the other two do not.'
		}
	];
</script>

<svelte:head>
	<title>Design directions</title>
</svelte:head>

<div class="lab">
	<header>
		<p class="tag">Phase 04 · not indexed</p>
		<h1>Three directions</h1>
		<p class="intro">
			Each renders the <strong>same real content</strong> — the same hero copy, the same three projects,
			the same case study. Comparing them tells you something only because the words are identical; otherwise
			you would be judging the writing, not the design.
		</p>
		<p class="intro">
			Open each on your phone as well as a laptop. The switcher at the bottom moves between them.
		</p>
	</header>

	<ul class="list">
		{#each directions as d (d.id)}
			<li>
				<a href="/lab/{d.id}">
					<span class="letter">{d.id.toUpperCase()}</span>
					<div>
						<h2>{d.name}</h2>
						<p class="thesis">{d.thesis}</p>
						<p class="detail">{d.detail}</p>
						<p class="risk"><span>Trade-off</span> {d.risk}</p>
					</div>
					<span class="arrow" aria-hidden="true">&rarr;</span>
				</a>
			</li>
		{/each}
	</ul>

	<footer>
		<p>
			Nothing here is wired into the live site. Picking one means rebuilding the real pages in that
			language; the other two get deleted.
		</p>
	</footer>
</div>

<style>
	.lab {
		--paper: #0b0d0a;
		--ink: #ecf0e8;
		--ink-2: #a8b0a2;
		--dim: #737b6e;
		--line: #1e231c;
		--accent: #a9cf9f;

		min-height: 100vh;
		background: var(--paper);
		color: var(--ink);
		font-family: 'Inter', system-ui, sans-serif;
		padding: 4.5rem 1.5rem 8rem;
	}

	header,
	.list,
	footer {
		margin: 0 auto;
		max-width: 780px;
	}

	.tag {
		margin: 0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	h1 {
		margin: 1rem 0 1.5rem;
		font-size: clamp(2rem, 6vw, 3rem);
		font-weight: 700;
		letter-spacing: -0.03em;
	}

	.intro {
		margin: 0 0 1rem;
		max-width: 62ch;
		line-height: 1.72;
		color: var(--ink-2);
	}

	.intro strong {
		color: var(--ink);
		font-weight: 600;
	}

	.list {
		margin-top: 3rem;
		padding: 0;
		list-style: none;
	}

	.list li {
		margin-bottom: 0.85rem;
	}

	.list a {
		display: grid;
		align-items: start;
		gap: 1.25rem;
		grid-template-columns: auto minmax(0, 1fr) auto;
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 1.6rem;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.list a:hover,
	.list a:focus-visible {
		border-color: rgba(169, 207, 159, 0.4);
		background: rgba(169, 207, 159, 0.04);
	}

	.letter {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.6rem;
		font-weight: 700;
		line-height: 1;
		color: var(--accent);
	}

	.list h2 {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: -0.015em;
	}

	.thesis {
		margin: 0.35rem 0 0.85rem;
		font-size: 14px;
		color: var(--ink);
	}

	.detail {
		margin: 0;
		font-size: 13.5px;
		line-height: 1.7;
		color: var(--ink-2);
	}

	.risk {
		margin: 0.85rem 0 0;
		font-size: 12.5px;
		line-height: 1.65;
		color: var(--dim);
	}

	.risk span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #d6a95f;
	}

	.arrow {
		align-self: center;
		font-size: 1.1rem;
		color: var(--dim);
	}

	footer {
		margin-top: 3rem;
		border-top: 1px solid var(--line);
		padding-top: 1.5rem;
	}

	footer p {
		margin: 0;
		font-size: 12.5px;
		line-height: 1.7;
		color: var(--dim);
	}
</style>
