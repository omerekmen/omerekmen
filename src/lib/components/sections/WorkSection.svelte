<script lang="ts">
	import { gsap } from '$lib/utils/gsap';
	import TrackBadge from '$lib/components/ui/TrackBadge.svelte';
	import { featuredProjects } from '$lib/content/projects';
	import { parseMetric, formatMetric } from '$lib/utils/metric';

	const projects = featuredProjects();
	const projectCount = projects.length;
	const sectionHeight = `${180 + projectCount * 190}vh`;

	// Scatter keeps the stack from reading as a slideshow.
	const cardPositions = [
		{ x: 7, y: -4, rotate: -1.8 },
		{ x: -10, y: 3, rotate: 1.4 },
		{ x: 4, y: -7, rotate: -1 },
		{ x: -7, y: 5, rotate: 1.8 },
		{ x: 9, y: -2, rotate: -1.4 }
	];

	let reducedMotion = $state(false);
	let activeIndex = $state(0);
	let sectionEl: HTMLElement | undefined = $state();
	let pinEl: HTMLDivElement | undefined = $state();
	let pillEl: HTMLDivElement | undefined = $state();
	let lettersEl: HTMLDivElement | undefined = $state();
	let carouselEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!sectionEl || !pinEl || !pillEl || !lettersEl || !carouselEl) return;

		const rows = lettersEl.querySelectorAll('.letter-row');
		const slides = Array.from(carouselEl.querySelectorAll<HTMLElement>('.project-slide'));
		const isMobile = window.innerWidth < 640;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			// Cards are absolutely positioned for the choreography; without the
			// timeline they would all land on the same spot. Hand layout to CSS.
			reducedMotion = true;
			gsap.set(slides, { opacity: 1, clearProps: 'transform' });
			for (const el of carouselEl.querySelectorAll<HTMLElement>('[data-count]')) {
				el.textContent = el.dataset.final ?? el.textContent;
			}
			gsap.set(carouselEl.querySelectorAll('.chip'), { opacity: 1, y: 0 });
			return;
		}

		reducedMotion = false;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionEl,
				start: 'top top',
				end: 'bottom bottom',
				pin: pinEl,
				scrub: 1.2,
				onUpdate: (self) => {
					const span = 1 - 0.18;
					const raw = (self.progress - 0.18) / span;
					activeIndex = Math.max(0, Math.min(projectCount - 1, Math.floor(raw * projectCount)));
				}
			}
		});

		const pillDur = 0.12;
		const projectStart = 0.18;
		const slice = (1 - projectStart) / projectCount;
		const overlap = 0.3;

		// ── Pill opens like a portal ──
		tl.to(pillEl, { scale: 25, opacity: 0, duration: pillDur, ease: 'power2.in' }, 0);

		// ── Letter rows fade in with depth, then drift ──
		const depths = [-30, -60, -40, -20];
		const tilts = [2, -1.5, 1, -2.5];
		rows.forEach((row, i) => {
			tl.fromTo(
				row,
				{ opacity: 0, z: depths[i] - 50, rotateX: tilts[i] + 3 },
				{ opacity: 0.4, z: depths[i], rotateX: tilts[i], duration: 0.08, ease: 'power2.out' },
				0.08 + i * 0.015
			);
			tl.fromTo(
				row,
				{ xPercent: i % 2 === 0 ? 0 : -50 },
				{ xPercent: i % 2 === 0 ? -50 : 0, duration: 0.85, ease: 'none' },
				0.12
			);
		});

		// ── Cards ──
		slides.forEach((slide, i) => {
			const pos = cardPositions[i % cardPositions.length];
			const start = projectStart + i * slice * (1 - overlap);
			const enterEnd = start + slice * 0.16;
			const holdEnd = start + slice * 0.85;
			const exitEnd = holdEnd + slice * 0.25;
			const enterDur = enterEnd - start;

			if (isMobile) {
				tl.fromTo(
					slide,
					{ yPercent: 36, opacity: 0, scale: 0.92 },
					{ yPercent: 0, opacity: 1, scale: 1, duration: enterDur, ease: 'power3.out' },
					start
				);
			} else {
				tl.fromTo(
					slide,
					{
						xPercent: 118,
						yPercent: 18,
						opacity: 0,
						rotateY: -9,
						rotateZ: pos.rotate * 1.6,
						scale: 0.86
					},
					{
						xPercent: pos.x,
						yPercent: pos.y,
						opacity: 1,
						rotateY: 0,
						rotateZ: pos.rotate,
						scale: 1,
						duration: enterDur,
						ease: 'power3.out'
					},
					start
				);
				// Slow drift while the card holds, so it never feels parked.
				tl.to(
					slide,
					{ xPercent: pos.x - 3, yPercent: pos.y - 2, duration: holdEnd - enterEnd, ease: 'none' },
					enterEnd
				);
			}

			// Accent rail sweeps across the card as it lands.
			const rail = slide.querySelector('.rail-fill');
			if (rail) {
				tl.fromTo(
					rail,
					{ scaleX: 0 },
					{ scaleX: 1, duration: enterDur * 1.3, ease: 'power2.out', transformOrigin: 'left' },
					start + enterDur * 0.3
				);
			}

			// Metrics count up as the card scrolls in — the numbers are the point.
			slide.querySelectorAll<HTMLElement>('[data-count]').forEach((el, mi) => {
				const target = Number(el.dataset.count);
				const decimals = Number(el.dataset.decimals ?? 0);
				const prefix = el.dataset.prefix ?? '';
				const suffix = el.dataset.suffix ?? '';
				const counter = { v: 0 };
				tl.to(
					counter,
					{
						v: target,
						duration: enterDur * 1.6,
						ease: 'power2.out',
						onUpdate: () => {
							el.textContent = `${prefix}${counter.v.toFixed(decimals)}${suffix}`;
						}
					},
					start + enterDur * 0.35 + mi * 0.006
				);
			});

			// Stack chips cascade in behind the metrics.
			const chips = slide.querySelectorAll('.chip');
			if (chips.length) {
				tl.fromTo(
					chips,
					{ opacity: 0, y: 10 },
					{
						opacity: 1,
						y: 0,
						duration: enterDur * 0.9,
						stagger: enterDur * 0.08,
						ease: 'power2.out'
					},
					start + enterDur * 0.5
				);
			}

			if (i < projectCount - 1) {
				const exit = isMobile
					? { yPercent: -28, opacity: 0, scale: 0.95 }
					: {
							xPercent: -100,
							yPercent: -15,
							opacity: 0,
							rotateY: 6,
							rotateZ: -pos.rotate,
							scale: 0.9
						};
				tl.to(slide, { ...exit, duration: exitEnd - holdEnd, ease: 'power2.in' }, holdEnd);
			}
		});

		return () => {
			tl.scrollTrigger?.kill();
			tl.kill();
		};
	});
</script>

<section
	id="work"
	bind:this={sectionEl}
	class="relative"
	class:reduced-motion={reducedMotion}
	style={reducedMotion ? '' : `height: ${sectionHeight};`}
>
	<h2 class="work-heading">Work</h2>

	<div bind:this={pinEl} class="pin-container relative h-screen w-full overflow-hidden bg-bg">
		<div class="dot-grid"></div>

		<!-- ═══ PILL ═══ -->
		<div
			bind:this={pillEl}
			class="pill-layer pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
		>
			<div class="work-pill">
				{#each ['W', 'O', 'R', 'K'] as letter (letter)}
					<span class="pill-letter">{letter}</span>
				{/each}
			</div>
		</div>

		<!-- ═══ LETTER ROWS ═══ -->
		<div
			bind:this={lettersEl}
			class="letters-layer pointer-events-none absolute inset-0 z-0 flex flex-col justify-center overflow-hidden select-none"
			aria-hidden="true"
			style="perspective: 600px; transform-style: preserve-3d;"
		>
			{#each ['W', 'O', 'R', 'K'] as letter (letter)}
				<div class="letter-row" style="opacity: 0; transform-style: preserve-3d;">
					{#each { length: 15 } as _unused, j (j)}
						<span class="letter-char">{letter}</span>
					{/each}
					{#each { length: 15 } as _unused, j (`dup-${j}`)}
						<span class="letter-char">{letter}</span>
					{/each}
				</div>
			{/each}
		</div>

		<!-- ═══ PROGRESS RAIL ═══ -->
		{#if !reducedMotion}
			<div class="progress-rail" aria-hidden="true">
				{#each projects as project, i (project.slug)}
					<span class="tick" class:on={i === activeIndex}>
						{String(i + 1).padStart(2, '0')}
					</span>
				{/each}
			</div>
		{/if}

		<!-- ═══ CARDS ═══ -->
		<div
			class="absolute inset-0 z-20 flex items-center justify-center"
			style="perspective: 1000px; transform-style: preserve-3d;"
		>
			<div bind:this={carouselEl} class="carousel relative h-full w-full">
				{#each projects as project, i (project.slug)}
					<a href="/projects/{project.slug}" class="project-slide group" data-cursor="View">
						<!-- Browser chrome -->
						<div class="chrome">
							<span class="dot red"></span>
							<span class="dot amber"></span>
							<span class="dot green"></span>
							<div class="url">
								<span>omerekmen.com/projects/{project.slug}</span>
							</div>
						</div>

						<div class="rail"><span class="rail-fill"></span></div>

						<div class="body">
							<div class="head">
								<span class="counter">
									{String(i + 1).padStart(2, '0')} / {String(projectCount).padStart(2, '0')}
								</span>
								<TrackBadge track={project.track} progress={project.progress} />
							</div>

							<h3 class="title">{project.title}</h3>
							<p class="role">{project.role}</p>
							<p class="summary">{project.summary}</p>

							{#if project.metrics.length}
								<dl class="metrics">
									{#each project.metrics.slice(0, 3) as metric (metric.label)}
										{@const parsed = parseMetric(metric.value)}
										<div>
											<dd
												data-count={parsed.literal ? undefined : parsed.value}
												data-decimals={parsed.decimals}
												data-prefix={parsed.prefix}
												data-suffix={parsed.suffix}
												data-final={metric.value}
											>
												{parsed.literal ? metric.value : formatMetric(parsed, 0)}
											</dd>
											<dt>{metric.label}</dt>
										</div>
									{/each}
								</dl>
							{/if}

							<div class="chips">
								{#each project.stack.slice(0, 5) as tech (tech)}
									<span class="chip">{tech}</span>
								{/each}
								{#if project.stack.length > 5}
									<span class="chip">+{project.stack.length - 5}</span>
								{/if}
							</div>

							<span class="cta">
								View project
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<line x1="5" y1="12" x2="19" y2="12" />
									<polyline points="12 5 19 12 12 19" />
								</svg>
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* ── Accessible heading (the giant WORK letters are decoration) ── */
	.work-heading {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}

	.dot-grid {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background-image: radial-gradient(
			circle,
			rgba(var(--color-accent-rgb), 0.1) 1px,
			transparent 1px
		);
		background-size: 28px 28px;
		mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%);
		-webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%);
	}

	/* ── Pill ── */
	.work-pill {
		display: flex;
		width: 200px;
		height: 520px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.1em;
		border: 1.5px solid var(--color-border-subtle);
		border-radius: 110px;
		background: var(--color-bg-secondary);
		will-change: transform;
	}

	.pill-letter {
		display: block;
		font-family: 'Bagel Fat One', sans-serif;
		font-size: 4.5rem;
		line-height: 1;
		color: var(--color-accent);
	}

	/* ── Letter rows ── */
	.letter-row {
		display: flex;
		width: max-content;
		align-items: center;
		white-space: nowrap;
		transform-style: preserve-3d;
		will-change: transform;
	}

	.letter-char {
		display: inline-block;
		flex-shrink: 0;
		padding: 0 0.08em;
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(5rem, 14vw, 12rem);
		line-height: 1.05;
		color: var(--color-accent);
		text-shadow: 0 4px 20px rgba(var(--color-accent-rgb), 0.15);
	}

	/* ── Progress rail ── */
	.progress-rail {
		position: absolute;
		top: 50%;
		right: 1.5rem;
		z-index: 25;
		display: none;
		flex-direction: column;
		gap: 0.7rem;
		transform: translateY(-50%);
	}

	@media (min-width: 900px) {
		.progress-rail {
			display: flex;
		}
	}

	.tick {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		opacity: 0.4;
		transition:
			opacity 0.3s ease,
			color 0.3s ease,
			transform 0.3s ease;
	}

	.tick.on {
		color: var(--color-accent-text);
		opacity: 1;
		transform: translateX(-4px) scale(1.15);
	}

	/* ── Cards ── */
	.project-slide {
		position: absolute;
		top: 50%;
		left: 50%;
		display: block;
		width: min(78vw, 320px);
		overflow: hidden;
		border: 1px solid var(--color-border-subtle);
		border-radius: 14px;
		background: var(--color-bg-secondary);
		text-decoration: none;
		transform: translate(-50%, -50%);
		box-shadow:
			0 25px 80px rgba(0, 0, 0, 0.3),
			0 0 0 0.5px rgba(var(--color-accent-rgb), 0.05);
		transition: box-shadow 0.3s ease;
		will-change: transform, opacity;
	}

	@media (min-width: 640px) {
		.project-slide {
			width: min(70vw, 540px);
			border-radius: 18px;
		}
	}

	@media (min-width: 1024px) {
		.project-slide {
			width: min(58vw, 620px);
		}
	}

	.project-slide:hover {
		box-shadow:
			0 30px 100px rgba(0, 0, 0, 0.42),
			0 0 0 1px rgba(var(--color-accent-rgb), 0.25);
	}

	.chrome {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		border-bottom: 1px solid var(--color-border-subtle);
		padding: 0.6rem 0.9rem;
	}

	@media (min-width: 640px) {
		.chrome {
			gap: 0.5rem;
			padding: 0.75rem 1.2rem;
		}
	}

	.chrome .dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.chrome .red {
		background: #ff5f57;
	}
	.chrome .amber {
		background: #febc2e;
	}
	.chrome .green {
		background: #28c840;
	}

	.url {
		margin-left: 0.6rem;
		flex: 1;
		overflow: hidden;
		border-radius: 6px;
		background: rgba(var(--color-text-rgb), 0.04);
		padding: 0.15rem 0.6rem;
	}

	.url span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		color: var(--color-text-muted);
		opacity: 0.75;
	}

	/* Accent sweep as the card lands */
	.rail {
		height: 2px;
		width: 100%;
		background: rgba(var(--color-accent-rgb), 0.1);
	}

	.rail-fill {
		display: block;
		height: 100%;
		width: 100%;
		background: linear-gradient(90deg, var(--color-accent), transparent);
	}

	.body {
		padding: 1.1rem 1.1rem 1.3rem;
	}

	@media (min-width: 640px) {
		.body {
			padding: 1.6rem 1.7rem 1.8rem;
		}
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.counter {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.12em;
		color: var(--color-text-muted);
	}

	.title {
		margin: 0.85rem 0 0.25rem;
		font-family: 'Bagel Fat One', sans-serif;
		font-size: 1.25rem;
		line-height: 1.15;
		color: var(--color-text);
	}

	@media (min-width: 640px) {
		.title {
			font-size: 1.75rem;
		}
	}

	.role {
		margin: 0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		line-height: 1.5;
		color: var(--color-text-muted);
	}

	.summary {
		margin: 0.8rem 0 0;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
		font-size: 0.85rem;
		line-height: 1.65;
		color: var(--color-text-secondary);
	}

	@media (min-width: 640px) {
		.summary {
			font-size: 0.93rem;
		}
	}

	.metrics {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin: 1.15rem 0 0;
	}

	.metrics div {
		display: flex;
		flex-direction: column;
	}

	.metrics dd {
		margin: 0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.3rem;
		font-weight: 700;
		line-height: 1.1;
		color: var(--color-accent-text);
		font-variant-numeric: tabular-nums;
	}

	.metrics dt {
		margin-top: 0.2rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-top: 1.2rem;
	}

	.chip {
		border: 1px solid var(--color-border-subtle);
		border-radius: 999px;
		background: var(--color-bg-tertiary);
		padding: 0.2rem 0.6rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		color: var(--color-text-muted);
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1.3rem;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--color-accent-text);
		transition: gap 0.2s ease;
	}

	.project-slide:hover .cta {
		gap: 0.8rem;
	}

	.cta svg {
		width: 14px;
		height: 14px;
	}

	/* ── Reduced motion: a plain, readable vertical list ── */
	.reduced-motion .pin-container {
		height: auto;
		overflow: visible;
		padding: 5rem 1rem;
	}

	.reduced-motion .pill-layer,
	.reduced-motion .letters-layer {
		display: none;
	}

	.reduced-motion .carousel {
		display: flex;
		height: auto;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.reduced-motion .carousel > :global(.project-slide) {
		position: relative;
		top: auto;
		left: auto;
		transform: none;
	}

	.reduced-motion .work-heading {
		position: static;
		width: auto;
		height: auto;
		margin: 0 0 2.5rem;
		clip-path: none;
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(2.5rem, 8vw, 5rem);
		color: var(--color-accent);
		text-align: center;
	}
</style>
