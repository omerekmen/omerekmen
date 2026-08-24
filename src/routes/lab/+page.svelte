<script lang="ts">
	const directions = [
		{
			id: 'a',
			name: 'Refined Kinetic',
			status: 'Frontrunner',
			thesis: 'The current identity, executed properly.',
			detail:
				'Bagel Fat One stays, the oversized type stays, the scroll choreography stays. On top of that: a name that lights up under the cursor, a work index that opens in place with its numbers counting up, a case study with a contents rail that tracks where you are reading, and a contact line whose letters lean toward the pointer.',
			risk: 'Reads as a creative portfolio. An asset for design-adjacent roles, a mild liability for enterprise data engineering.',
			moves: [
				'Cursor-lit name — a second copy of the name masked to a light that follows the pointer, and drifts by itself on touch',
				'Section rail on the right edge, tracking and jumping between sections',
				'Work index rows that open in place, with a title marquee behind the live row',
				'Metrics that count up the first time you reach them, not on page load',
				'Case-study contents rail built from the article, with reading progress',
				'Magnetic “LET’S TALK” letters'
			]
		},
		{
			id: 'b',
			name: 'Systems',
			status: 'Idea source',
			thesis: 'The display font recedes and the work becomes the visual.',
			detail:
				'The hero is the actual Fabric pipeline, drawn as a diagram with packets moving through it and a note on whichever stage you point at. Projects are records in a queryable table — filter by stack or domain, sort by signal, expand a row for its full metadata.',
			risk: 'Less personality. If someone is hiring for taste as well as rigour, this says less about you.',
			moves: [
				'Pipeline stages that explain themselves on hover',
				'A filter box over the project table, with a live row count',
				'Sortable columns and expandable record detail',
				'A running clock in the instrument bar'
			]
		},
		{
			id: 'c',
			name: 'Editorial',
			status: 'Idea source',
			thesis: 'A publication, with the case study as the centrepiece.',
			detail:
				'Newsreader for the type, an asymmetric grid with a sticky metadata margin, a contents page with dot leaders, a drop cap, a read-time counted from the article itself, and a running head in the margin telling you which part you are in.',
			risk: 'Demands real writing. With thin case studies it looks empty in a way the other two do not.',
			moves: [
				'Reading progress hairline across the top',
				'Contents page with dot leaders and a read-time counted from the prose',
				'Running head in the margin, following the article',
				'Drop cap and line-by-line standfirst reveal'
			]
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
			Each renders the <strong>same real content</strong> — the same hero copy, the same projects, the
			same case study. Comparing them tells you something only because the words are identical; otherwise
			you would be judging the writing, not the design.
		</p>
		<p class="intro">
			<strong>A is the direction being built.</strong> B and C are not competing finished sites any more
			— they are kept as working prototypes to take ideas from, and each one has interactions worth stealing.
			Open each on your phone as well as a laptop; the switcher at the bottom moves between them.
		</p>
	</header>

	<ul class="list">
		{#each directions as d (d.id)}
			<li>
				<a href="/lab/{d.id}" class:lead={d.id === 'a'}>
					<span class="letter">{d.id.toUpperCase()}</span>
					<div>
						<div class="head-row">
							<h2>{d.name}</h2>
							<span class="status" class:on={d.id === 'a'}>{d.status}</span>
						</div>
						<p class="thesis">{d.thesis}</p>
						<p class="detail">{d.detail}</p>
						<ul class="moves">
							{#each d.moves as move (move)}
								<li>{move}</li>
							{/each}
						</ul>
						<p class="risk"><span>Trade-off</span> {d.risk}</p>
					</div>
					<span class="arrow" aria-hidden="true">&rarr;</span>
				</a>
			</li>
		{/each}
	</ul>

	<footer>
		<p>
			Nothing here is wired into the live site. The lab stays put: it is where an interaction gets
			tried before it earns a place on a real page, and where the ideas that did not make it into A
			are kept rather than thrown away.
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

	.list > li {
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

	.head-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.75rem;
	}

	.status {
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.15rem 0.5rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--dim);
	}

	.status.on {
		border-color: rgba(169, 207, 159, 0.45);
		background: rgba(169, 207, 159, 0.1);
		color: var(--accent);
	}

	.list a.lead {
		border-color: rgba(169, 207, 159, 0.3);
	}

	.moves {
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}

	.moves li {
		position: relative;
		margin-bottom: 0.3rem;
		padding-left: 1rem;
		font-size: 12.5px;
		line-height: 1.62;
		color: var(--ink-2);
	}

	.moves li::before {
		position: absolute;
		top: 0.62em;
		left: 0;
		width: 6px;
		height: 1px;
		background: var(--accent);
		content: '';
	}
</style>
