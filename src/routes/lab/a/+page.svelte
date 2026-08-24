<script lang="ts">
	import { sample, capabilities } from '../sample';
	import NetworkBackground from '$lib/components/visualizations/NetworkBackground.svelte';
	import { gsap, SplitText } from '$lib/utils/gsap';

	let root: HTMLElement | undefined = $state();
	let nameEl: HTMLHeadingElement | undefined = $state();

	$effect(() => {
		if (!root || !nameEl) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(root.querySelectorAll('.rise'), { opacity: 1, y: 0 });
			return;
		}
		const ctx = gsap.context(() => {
			const split = new SplitText(nameEl!, { type: 'chars' });
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
			tl.from(split.chars, {
				opacity: 0,
				yPercent: 110,
				rotateX: -70,
				stagger: 0.035,
				duration: 0.9
			});
			tl.from('.hero-line', { scaleX: 0, duration: 0.7, transformOrigin: 'left' }, '-=0.5');
			tl.from('.rise', { opacity: 0, y: 22, stagger: 0.07, duration: 0.6 }, '-=0.45');

			root!.querySelectorAll('.on-scroll').forEach((el) => {
				gsap.from(el, {
					opacity: 0,
					y: 34,
					duration: 0.7,
					scrollTrigger: { trigger: el, start: 'top 88%', once: true }
				});
			});
		}, root);
		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Direction A — Refined Kinetic</title>
</svelte:head>

<div bind:this={root} class="dir-a">
	<!-- ═══ HERO ═══ -->
	<section class="hero">
		<NetworkBackground />
		<div class="hero-inner">
			<p class="rise eyebrow">
				<span class="dot" aria-hidden="true"></span>
				{sample.currentRole.role} · {sample.currentRole.company}
			</p>

			<h1 bind:this={nameEl} class="display">{sample.name.toUpperCase()}</h1>
			<div class="hero-line" aria-hidden="true"></div>

			<p class="rise lede">{sample.title}</p>
			<p class="rise blurb">{sample.summary}</p>

			<div class="rise caps">
				{#each capabilities as group (group.label)}
					<div class="cap">
						<span class="cap-label">{group.label}</span>
						<span class="cap-items">{group.items.join(' · ')}</span>
					</div>
				{/each}
			</div>
		</div>
		<div class="scroll-cue" aria-hidden="true"><span>Scroll</span><i></i></div>
	</section>

	<!-- ═══ WORK ═══ -->
	<section class="work">
		<header class="work-head on-scroll">
			<span class="section-tag">Selected work</span>
			<h2 class="display work-title">WORK</h2>
		</header>

		<div class="cards">
			{#each sample.projects as project, i (project.slug)}
				<article class="card on-scroll">
					<div class="card-top">
						<span class="index">{String(i + 1).padStart(2, '0')}</span>
						<span class="track track-{project.track}">
							{project.progress ?? project.track.replace('-', ' ')}
						</span>
					</div>
					<h3 class="card-title">{project.title}</h3>
					<p class="card-role">{project.role}</p>
					<p class="card-summary">{project.summary}</p>

					{#if project.metrics.length}
						<div class="metrics">
							{#each project.metrics as metric (metric.label)}
								<div>
									<span class="m-value">{metric.value}</span>
									<span class="m-label">{metric.label}</span>
								</div>
							{/each}
						</div>
					{/if}

					<div class="chips">
						{#each project.stack.slice(0, 6) as tech (tech)}<span>{tech}</span>{/each}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<!-- ═══ CASE STUDY ═══ -->
	{#if sample.caseStudy}
		{@const Body = sample.caseStudy.body}
		<section class="case on-scroll">
			<span class="section-tag">Case study</span>
			<h2 class="case-title display">{sample.caseStudy.meta.title}</h2>
			<div class="prose">
				<Body />
			</div>
		</section>
	{/if}

	<!-- ═══ CTA ═══ -->
	<footer class="cta">
		<a href="mailto:{sample.email}" class="cta-text display">LET'S TALK</a>
		<div class="cta-links">
			<a href={sample.github}>GitHub</a>
			<a href={sample.linkedin}>LinkedIn</a>
			<a href="/cv">CV</a>
		</div>
	</footer>
</div>

<style>
	.dir-a {
		--ink: #f2f4ef;
		--ink-2: #b9c0b3;
		--muted: #7d857a;
		--ground: #070806;
		--surface: #0e100d;
		--surface-2: #151813;
		--line: #1e231c;
		--accent: #b8d8b0;
		--accent-rgb: 184, 216, 176;

		background: var(--ground);
		color: var(--ink);
		font-family: 'Inter', system-ui, sans-serif;
	}

	.display {
		font-family: 'Bagel Fat One', system-ui, sans-serif;
		font-weight: 400;
		letter-spacing: -0.005em;
	}

	/* ── Hero ── */
	.hero {
		position: relative;
		display: flex;
		min-height: 100vh;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
		padding: 6rem 1.5rem 5rem;
	}

	.hero-inner {
		position: relative;
		z-index: 2;
		margin: 0 auto;
		width: 100%;
		max-width: 1100px;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.15);
	}

	h1.display {
		margin: 1.25rem 0 0;
		font-size: clamp(3rem, 12vw, 9rem);
		line-height: 0.92;
		perspective: 500px;
	}

	.hero-line {
		height: 2px;
		width: min(100%, 620px);
		margin: 1.5rem 0 1.75rem;
		background: linear-gradient(90deg, var(--accent), transparent);
	}

	.lede {
		max-width: 40ch;
		font-size: clamp(1.15rem, 2.6vw, 1.7rem);
		font-weight: 500;
		line-height: 1.25;
		color: var(--ink);
	}

	.blurb {
		margin-top: 1.1rem;
		max-width: 62ch;
		font-size: 0.98rem;
		line-height: 1.7;
		color: var(--ink-2);
	}

	.caps {
		display: flex;
		flex-wrap: wrap;
		gap: 1.75rem;
		margin-top: 2.5rem;
	}

	.cap {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.cap-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.cap-items {
		font-size: 13px;
		color: var(--muted);
	}

	.scroll-cue {
		position: absolute;
		bottom: 1.75rem;
		left: 50%;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		transform: translateX(-50%);
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.scroll-cue i {
		display: block;
		height: 34px;
		width: 1px;
		background: linear-gradient(var(--accent), transparent);
	}

	/* ── Work ── */
	.work {
		padding: 7rem 1.5rem;
		border-top: 1px solid var(--line);
	}

	.work-head {
		margin: 0 auto 3rem;
		max-width: 1100px;
	}

	.section-tag {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.work-title {
		margin: 0.75rem 0 0;
		font-size: clamp(3rem, 11vw, 8rem);
		line-height: 0.9;
		color: transparent;
		-webkit-text-stroke: 1.5px rgba(var(--accent-rgb), 0.42);
	}

	.cards {
		display: grid;
		gap: 1.25rem;
		margin: 0 auto;
		max-width: 1100px;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--line);
		border-radius: 18px;
		background: linear-gradient(160deg, var(--surface-2), var(--surface));
		padding: 1.6rem;
		transition:
			border-color 0.25s ease,
			transform 0.25s ease;
	}

	.card:hover {
		border-color: rgba(var(--accent-rgb), 0.4);
		transform: translateY(-4px);
	}

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.index {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.12em;
		color: var(--muted);
	}

	.track {
		border-radius: 999px;
		padding: 0.22rem 0.6rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.track-production {
		background: rgba(144, 212, 168, 0.13);
		color: #90d4a8;
	}

	.track-in-progress {
		background: rgba(240, 208, 140, 0.13);
		color: #f0d08c;
	}

	.card-title {
		margin: 1.1rem 0 0.3rem;
		font-size: 1.3rem;
		font-weight: 700;
		letter-spacing: -0.015em;
	}

	.card-role {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10.5px;
		color: var(--muted);
	}

	.card-summary {
		margin: 0.9rem 0 0;
		font-size: 0.9rem;
		line-height: 1.62;
		color: var(--ink-2);
	}

	.metrics {
		display: flex;
		gap: 1.75rem;
		margin-top: 1.4rem;
	}

	.metrics div {
		display: flex;
		flex-direction: column;
	}

	.m-value {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}

	.m-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: auto;
		padding-top: 1.4rem;
	}

	.chips span {
		border: 1px solid var(--line);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.02);
		padding: 0.22rem 0.6rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		color: var(--muted);
	}

	/* ── Case study ── */
	.case {
		border-top: 1px solid var(--line);
		padding: 7rem 1.5rem;
	}

	.case > :global(*) {
		margin-inline: auto;
		max-width: 680px;
	}

	.case-title {
		margin: 0.75rem 0 2.5rem;
		font-size: clamp(2rem, 6vw, 3.4rem);
		line-height: 1.02;
	}

	.prose :global(h2) {
		margin: 2.75rem 0 0.9rem;
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--ink);
	}

	.prose :global(h2:first-child) {
		margin-top: 0;
	}

	.prose :global(p) {
		margin-bottom: 1.05rem;
		line-height: 1.78;
		color: var(--ink-2);
	}

	.prose :global(ul) {
		margin: 0 0 1.3rem;
		padding-left: 1.15rem;
		list-style: disc;
	}

	.prose :global(li) {
		margin-bottom: 0.45rem;
		line-height: 1.7;
		color: var(--ink-2);
	}

	.prose :global(strong) {
		color: var(--ink);
	}

	/* ── CTA ── */
	.cta {
		border-top: 1px solid var(--line);
		background: var(--accent);
		color: var(--ground);
		padding: 5rem 1.5rem 3rem;
	}

	.cta-text {
		display: block;
		margin: 0 auto;
		max-width: 1100px;
		font-size: clamp(3rem, 15vw, 11rem);
		line-height: 0.86;
		color: var(--ground);
		text-decoration: none;
	}

	.cta-links {
		display: flex;
		gap: 1.5rem;
		margin: 2.5rem auto 0;
		max-width: 1100px;
		font-size: 13px;
		font-weight: 600;
	}

	.cta-links a {
		color: rgba(7, 8, 6, 0.72);
		text-decoration: none;
	}

	.cta-links a:hover {
		color: var(--ground);
	}

	@media (prefers-reduced-motion: reduce) {
		.card:hover {
			transform: none;
		}
	}
</style>
