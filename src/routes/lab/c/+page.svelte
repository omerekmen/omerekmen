<script lang="ts">
	import { sample, readingMinutes } from '../sample';
	import { gsap, SplitText } from '$lib/utils/gsap';

	let root: HTMLElement | undefined = $state();
	let proseEl: HTMLDivElement | undefined = $state();
	let standfirstEl: HTMLParagraphElement | undefined = $state();

	let progress = $state(0);
	let minutes = $state(0);
	let currentChapter = $state('');

	function scrollTo(id: string, event: MouseEvent) {
		const target = document.getElementById(id);
		if (!target) return;
		event.preventDefault();
		target.scrollIntoView({
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
			block: 'start'
		});
	}

	// Motion is deliberately sparse here: one entrance, one reveal per section.
	$effect(() => {
		if (!root) return;

		// Read time and contents come from the article itself, so they cannot
		// drift out of date the way a hand-written figure would.
		// Built into a local first: reading `chapters` back inside the effect that
		// writes it would make the effect depend on its own output.
		let chapterList: { id: string; label: string }[] = [];
		if (proseEl) {
			const words = (proseEl.textContent ?? '').trim().split(/\s+/).filter(Boolean).length;
			minutes = readingMinutes(words);
			chapterList = Array.from(proseEl.querySelectorAll<HTMLElement>('h2')).map((h, i) => {
				const id = h.id || `section-${i + 1}`;
				h.id = id;
				return { id, label: h.textContent?.trim() ?? `Section ${i + 1}` };
			});
			if (chapterList.length) currentChapter = chapterList[0].label;
		}

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
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

			// The standfirst arrives a line at a time — the one flourish the
			// page allows itself, and it reads as typesetting rather than motion.
			if (standfirstEl) {
				const split = new SplitText(standfirstEl, { type: 'lines' });
				gsap.from(split.lines, {
					opacity: 0,
					yPercent: 40,
					stagger: 0.07,
					duration: 0.75,
					delay: 0.25,
					ease: 'power2.out'
				});
			}

			root!.querySelectorAll('.on-scroll').forEach((el) => {
				gsap.from(el, {
					opacity: 0,
					y: 20,
					duration: 0.7,
					ease: 'power2.out',
					scrollTrigger: { trigger: el, start: 'top 88%', once: true }
				});
			});

			// A hairline progress rule across the top, the way a long read
			// usually signals how much is left.
			gsap.timeline({
				scrollTrigger: {
					trigger: root!,
					start: 'top top',
					end: 'bottom bottom',
					scrub: true,
					onUpdate: (self) => (progress = self.progress)
				}
			});

			// The margin keeps a running head of wherever you are in the article.
			chapterList.forEach((chapter) => {
				const el = document.getElementById(chapter.id);
				if (!el) return;
				const setCurrent = () => (currentChapter = chapter.label);
				gsap.timeline({
					scrollTrigger: {
						trigger: el,
						start: 'top 35%',
						end: 'bottom 35%',
						onEnter: setCurrent,
						onEnterBack: setCurrent
					}
				});
			});
		}, root);
		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Direction C — Editorial</title>
	<link
		rel="preload"
		href="/fonts/Newsreader-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<div bind:this={root} class="dir-c">
	<div class="progress-rule" aria-hidden="true">
		<span style="transform: scaleX({progress})"></span>
	</div>

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
			<p bind:this={standfirstEl} class="standfirst">{sample.summary}</p>
			<div class="enter byline">
				<a href="mailto:{sample.email}">{sample.email}</a>
				<a href={sample.github}>GitHub</a>
				<a href={sample.linkedin}>LinkedIn</a>
				<a href="/cv">Curriculum vitae</a>
			</div>

			<!-- Contents, the way a magazine opens. -->
			<nav class="enter contents" aria-label="In this issue">
				<p class="contents-label">In this issue</p>
				<ol>
					<li>
						<a href="#work" onclick={(e) => scrollTo('work', e)}>
							Selected work<span class="leader" aria-hidden="true"></span>
							<span class="contents-note">{sample.projects.length} entries</span>
						</a>
					</li>
					{#if sample.caseStudy}
						<li>
							<a href="#feature" onclick={(e) => scrollTo('feature', e)}>
								{sample.caseStudy.meta.title}<span class="leader" aria-hidden="true"></span>
								<span class="contents-note">{minutes || '—'} min read</span>
							</a>
						</li>
					{/if}
				</ol>
			</nav>
		</div>
	</section>

	<!-- ═══ INDEX OF WORK ═══ -->
	<section id="work" class="work">
		<div class="col-side">
			<p class="side-label">Selected work</p>
			<p class="side-text side-dim">
				{sample.projects.length} entries, most recent first.
			</p>
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
		{@const Body = sample.caseStudyBody}
		<article id="feature" class="feature">
			<div class="col-side">
				<p class="side-label">Case study</p>
				<p class="side-text">
					{sample.caseStudy.meta.role}<br />
					<span class="side-dim">{sample.caseStudy.meta.period}</span>
				</p>
				{#if minutes}
					<p class="side-text side-dim read-time">{minutes} min read</p>
				{/if}
				{#if currentChapter}
					<!-- Running head: which part of the article you are in. -->
					<p class="running-head">
						<span class="running-mark" aria-hidden="true"></span>
						{currentChapter}
					</p>
				{/if}
			</div>
			<div class="col-main">
				<h2 class="feature-title on-scroll">{sample.caseStudy.meta.title}</h2>
				<p class="feature-standfirst on-scroll">{sample.caseStudy.meta.summary}</p>
				<div bind:this={proseEl} class="on-scroll prose"><Body /></div>
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
	@font-face {
		font-family: 'Newsreader';
		src: url('/fonts/Newsreader-Variable.woff2') format('woff2');
		font-weight: 300 600;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'Newsreader';
		src: url('/fonts/Newsreader-VariableItalic.woff2') format('woff2');
		font-weight: 300 600;
		font-style: italic;
		font-display: swap;
	}

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

	/* ── Reading progress ── */
	.progress-rule {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		height: 2px;
		width: 100%;
		background: transparent;
	}

	.progress-rule span {
		display: block;
		height: 100%;
		width: 100%;
		transform: scaleX(0);
		transform-origin: left;
		background: var(--accent);
	}

	/* ── Contents ── */
	.contents {
		margin-top: 3rem;
		border-top: 1px solid var(--rule);
		padding-top: 1.4rem;
		max-width: 42rem;
	}

	.contents-label {
		margin: 0 0 0.75rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9.5px;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	.contents ol {
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: toc;
	}

	.contents li {
		counter-increment: toc;
	}

	.contents a {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		padding: 0.45rem 0;
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.02rem;
		color: var(--ink);
		text-decoration: none;
	}

	.contents a::before {
		content: counter(toc, decimal-leading-zero);
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		color: var(--ink-3);
	}

	/* Dot leaders, the way a printed contents page sets them. */
	.leader {
		flex: 1;
		height: 1px;
		min-width: 2rem;
		background-image: radial-gradient(circle, var(--rule) 1px, transparent 1px);
		background-size: 5px 1px;
		background-repeat: repeat-x;
		transform: translateY(-3px);
	}

	.contents-note {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		white-space: nowrap;
		color: var(--ink-3);
	}

	.contents a:hover,
	.contents a:focus-visible {
		color: var(--accent);
	}

	/* ── Running head ── */
	.read-time {
		margin-top: 0.9rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.running-head {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin: 1.4rem 0 0;
		border-top: 1px solid var(--rule);
		padding-top: 0.9rem;
		font-size: 12px;
		line-height: 1.55;
		color: var(--ink-2);
	}

	.running-mark {
		width: 12px;
		height: 1px;
		flex-shrink: 0;
		background: var(--accent);
		transform: translateY(-4px);
	}

	/* ── Drop cap ── */
	.prose :global(p:first-of-type)::first-letter {
		float: left;
		margin: 0.06em 0.08em 0 0;
		font-family: 'Newsreader', Georgia, serif;
		font-size: 3.4em;
		font-weight: 400;
		line-height: 0.82;
		color: var(--accent);
	}

	.prose :global(h2) {
		scroll-margin-top: 3rem;
	}

	/* ── Index entries respond to the pointer, quietly ── */
	.index-list li {
		transition: border-color 0.25s ease;
	}

	.index-list h2 {
		background-image: linear-gradient(var(--accent), var(--accent));
		background-position: 0 100%;
		background-repeat: no-repeat;
		background-size: 0% 1px;
		transition: background-size 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.index-list li:hover h2 {
		background-size: 100% 1px;
	}

	@media (prefers-reduced-motion: reduce) {
		.index-list h2,
		.index-list li,
		.contents a {
			transition: none;
		}
	}
</style>
