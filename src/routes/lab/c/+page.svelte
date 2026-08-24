<script lang="ts">
	import { sample } from '../sample';
	import { gsap } from '$lib/utils/gsap';

	let root: HTMLElement | undefined = $state();

	// Motion is deliberately sparse here: one entrance, one reveal per section.
	$effect(() => {
		if (!root) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(root.querySelectorAll('.enter, .on-scroll'), { opacity: 1, y: 0 });
			return;
		}
		const ctx = gsap.context(() => {
			gsap.from('.enter', {
				opacity: 0,
				y: 18,
				stagger: 0.09,
				duration: 0.85,
				ease: 'power2.out'
			});
			root!.querySelectorAll('.on-scroll').forEach((el) => {
				gsap.from(el, {
					opacity: 0,
					y: 20,
					duration: 0.7,
					ease: 'power2.out',
					scrollTrigger: { trigger: el, start: 'top 88%', once: true }
				});
			});
		}, root);
		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Direction C — Editorial</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400&display=swap"
	/>
</svelte:head>

<div bind:this={root} class="dir-c">
	<!-- ═══ MASTHEAD ═══ -->
	<header class="masthead">
		<div class="rule" aria-hidden="true"></div>
		<div class="mast-row">
			<span class="mast-name">{sample.name}</span>
			<span class="mast-meta">{sample.location} &middot; {sample.currentRole.company}</span>
		</div>
		<div class="rule" aria-hidden="true"></div>
	</header>

	<!-- ═══ LEDE ═══ -->
	<section class="lede-block">
		<div class="col-side">
			<p class="side-label">Currently</p>
			<p class="side-text">
				{sample.currentRole.role}<br />
				{sample.currentRole.company}<br />
				<span class="side-dim">{sample.currentRole.period}</span>
			</p>
		</div>
		<div class="col-main">
			<h1 class="enter">{sample.title}</h1>
			<p class="enter standfirst">{sample.summary}</p>
			<div class="enter byline">
				<a href="mailto:{sample.email}">{sample.email}</a>
				<a href={sample.github}>GitHub</a>
				<a href={sample.linkedin}>LinkedIn</a>
				<a href="/cv">Curriculum vitae</a>
			</div>
		</div>
	</section>

	<!-- ═══ INDEX OF WORK ═══ -->
	<section class="work">
		<div class="col-side">
			<p class="side-label">Selected work</p>
		</div>
		<div class="col-main">
			<ol class="index-list">
				{#each sample.projects as project, i (project.slug)}
					<li class="on-scroll">
						<div class="entry-head">
							<span class="entry-num">{String(i + 1).padStart(2, '0')}</span>
							<h2>{project.title}</h2>
						</div>
						<p class="entry-meta">
							{project.role} &middot; {project.period}
							{#if project.progress}&middot; <em>{project.progress}</em>{/if}
						</p>
						<p class="entry-summary">{project.summary}</p>
						{#if project.metrics.length}
							<p class="entry-metrics">
								{#each project.metrics as metric, mi (metric.label)}
									<span><strong>{metric.value}</strong> {metric.label.toLowerCase()}</span
									>{#if mi < project.metrics.length - 1}<span class="sep">/</span>{/if}
								{/each}
							</p>
						{/if}
						<p class="entry-stack">{project.stack.join(' · ')}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<!-- ═══ THE ARTICLE ═══ -->
	{#if sample.caseStudy}
		{@const Body = sample.caseStudy.body}
		<article class="feature">
			<div class="col-side">
				<p class="side-label">Case study</p>
				<p class="side-text">
					{sample.caseStudy.meta.role}<br />
					<span class="side-dim">{sample.caseStudy.meta.period}</span>
				</p>
			</div>
			<div class="col-main">
				<h2 class="feature-title on-scroll">{sample.caseStudy.meta.title}</h2>
				<p class="feature-standfirst on-scroll">{sample.caseStudy.meta.summary}</p>
				<div class="on-scroll prose"><Body /></div>
			</div>
		</article>
	{/if}

	<!-- ═══ COLOPHON ═══ -->
	<footer class="colophon">
		<div class="rule" aria-hidden="true"></div>
		<div class="colo-row">
			<span>&copy; {new Date().getFullYear()} {sample.name}</span>
			<a href="mailto:{sample.email}">Get in touch &rarr;</a>
		</div>
	</footer>
</div>

<style>
	.dir-c {
		--paper: #fbfcf9;
		--paper-2: #f2f4ee;
		--ink: #14170f;
		--ink-2: #3f4639;
		--ink-3: #6f7768;
		--rule: #d7dcd0;
		--accent: #3d6b3f;

		background: var(--paper);
		color: var(--ink);
		font-family: 'Inter', system-ui, sans-serif;
		padding-bottom: 5rem;
	}

	@media (prefers-color-scheme: dark) {
		.dir-c {
			--paper: #0d0f0b;
			--paper-2: #141810;
			--ink: #eef1e9;
			--ink-2: #b6bdae;
			--ink-3: #838b7b;
			--rule: #242a20;
			--accent: #a9cf9f;
		}
	}

	/* ── Editorial grid: a wide metadata margin, then the text column ── */
	.lede-block,
	.work,
	.feature {
		display: grid;
		gap: 1.75rem 3rem;
		margin: 0 auto;
		max-width: 1060px;
		padding: 4.5rem 1.5rem;
		grid-template-columns: 1fr;
	}

	@media (min-width: 900px) {
		.lede-block,
		.work,
		.feature {
			grid-template-columns: 190px minmax(0, 1fr);
		}
	}

	.col-side {
		position: relative;
	}

	@media (min-width: 900px) {
		.col-side {
			position: sticky;
			top: 2.5rem;
			align-self: start;
		}
	}

	.side-label {
		margin: 0 0 0.65rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9.5px;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.side-text {
		margin: 0;
		font-size: 12.5px;
		line-height: 1.75;
		color: var(--ink-2);
	}

	.side-dim {
		color: var(--ink-3);
	}

	/* ── Masthead ── */
	.masthead {
		margin: 0 auto;
		max-width: 1060px;
		padding: 2rem 1.5rem 0;
	}

	.rule {
		height: 1px;
		background: var(--rule);
	}

	.mast-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.7rem 0;
	}

	.mast-name {
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.05rem;
		font-weight: 500;
		letter-spacing: 0.02em;
	}

	.mast-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	/* ── Lede ── */
	h1 {
		margin: 0;
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(2.3rem, 6vw, 4.1rem);
		font-weight: 400;
		line-height: 1.06;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.standfirst {
		margin: 1.75rem 0 0;
		max-width: 60ch;
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.18rem;
		font-weight: 300;
		line-height: 1.62;
		color: var(--ink-2);
	}

	.byline {
		display: flex;
		flex-wrap: wrap;
		gap: 1.4rem;
		margin-top: 2.2rem;
		font-size: 13px;
	}

	.byline a {
		color: var(--accent);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		padding-bottom: 1px;
		transition: border-color 0.15s ease;
	}

	.byline a:hover {
		border-bottom-color: var(--accent);
	}

	/* ── Index of work ── */
	.work {
		border-top: 1px solid var(--rule);
	}

	.index-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.index-list li {
		border-bottom: 1px solid var(--rule);
		padding-bottom: 2.25rem;
		margin-bottom: 2.25rem;
	}

	.index-list li:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.entry-head {
		display: flex;
		align-items: baseline;
		gap: 0.9rem;
	}

	.entry-num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		color: var(--ink-3);
	}

	.index-list h2 {
		margin: 0;
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(1.45rem, 3.4vw, 2.05rem);
		font-weight: 500;
		line-height: 1.16;
		letter-spacing: -0.015em;
	}

	.entry-meta {
		margin: 0.5rem 0 0 calc(11px + 0.9rem);
		font-family: 'JetBrains Mono', monospace;
		font-size: 10.5px;
		letter-spacing: 0.03em;
		color: var(--ink-3);
	}

	.entry-summary {
		margin: 1rem 0 0 calc(11px + 0.9rem);
		max-width: 60ch;
		font-size: 15px;
		line-height: 1.72;
		color: var(--ink-2);
	}

	.entry-metrics {
		margin: 0.9rem 0 0 calc(11px + 0.9rem);
		font-family: 'Newsreader', Georgia, serif;
		font-size: 15px;
		color: var(--ink-2);
	}

	.entry-metrics strong {
		font-weight: 600;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}

	.sep {
		padding: 0 0.45em;
		color: var(--ink-3);
	}

	.entry-stack {
		margin: 0.9rem 0 0 calc(11px + 0.9rem);
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		line-height: 1.7;
		color: var(--ink-3);
	}

	/* ── Feature article ── */
	.feature {
		border-top: 1px solid var(--rule);
	}

	.feature-title {
		margin: 0;
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(2rem, 5vw, 3.2rem);
		font-weight: 400;
		line-height: 1.08;
		letter-spacing: -0.02em;
	}

	.feature-standfirst {
		margin: 1.4rem 0 2.75rem;
		max-width: 58ch;
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.22rem;
		font-weight: 300;
		font-style: italic;
		line-height: 1.58;
		color: var(--ink-2);
	}

	.prose {
		max-width: 66ch;
	}

	.prose :global(h2) {
		margin: 2.9rem 0 0.9rem;
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.5rem;
		font-weight: 500;
		letter-spacing: -0.012em;
		color: var(--ink);
	}

	.prose :global(h2:first-child) {
		margin-top: 0;
	}

	.prose :global(p) {
		margin-bottom: 1.25rem;
		font-size: 16.5px;
		line-height: 1.78;
		color: var(--ink-2);
	}

	.prose :global(ul) {
		margin: 0 0 1.5rem;
		padding-left: 1.1rem;
		list-style: none;
	}

	.prose :global(li) {
		position: relative;
		margin-bottom: 0.6rem;
		font-size: 16px;
		line-height: 1.7;
		color: var(--ink-2);
	}

	.prose :global(li::before) {
		content: '—';
		position: absolute;
		left: -1.1rem;
		color: var(--ink-3);
	}

	.prose :global(strong) {
		font-weight: 600;
		color: var(--ink);
	}

	.prose :global(a) {
		color: var(--accent);
	}

	/* ── Colophon ── */
	.colophon {
		margin: 0 auto;
		max-width: 1060px;
		padding: 0 1.5rem;
	}

	.colo-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1.1rem 0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10.5px;
		letter-spacing: 0.06em;
		color: var(--ink-3);
	}

	.colo-row a {
		color: var(--accent);
		text-decoration: none;
	}
</style>
