<script lang="ts">
	import { gsap } from '$lib/utils/gsap';
	import TrackBadge from '$lib/components/ui/TrackBadge.svelte';
	import { featuredProjects } from '$lib/content/projects';

	const projects = featuredProjects();
	const projectCount = projects.length;
	const sectionHeight = `${200 + projectCount * 200}vh`;

	// Scattered positions for each card (percentage offsets from center)
	// These create a floating, scattered feel like wodniack.dev
	const cardPositions = [
		{ x: 8, y: -5, rotate: -2 },
		{ x: -12, y: 3, rotate: 1.5 },
		{ x: 5, y: -8, rotate: -1 },
		{ x: -8, y: 6, rotate: 2 },
		{ x: 10, y: -3, rotate: -1.5 }
	];

	let reducedMotion = $state(false);
	let sectionEl: HTMLElement | undefined = $state();
	let pinEl: HTMLDivElement | undefined = $state();
	let pillEl: HTMLDivElement | undefined = $state();
	let lettersEl: HTMLDivElement | undefined = $state();
	let carouselEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!sectionEl || !pinEl || !pillEl || !lettersEl || !carouselEl) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const rows = lettersEl.querySelectorAll('.letter-row');
		const slides = carouselEl.querySelectorAll('.project-slide');
		const isMobile = window.innerWidth < 640;

		if (prefersReducedMotion) {
			// Cards are absolutely positioned for the scroll choreography. Without
			// the timeline to separate them they would all land on the same spot,
			// so hand layout back to CSS and clear GSAP's inline transforms.
			reducedMotion = true;
			gsap.set(slides, { opacity: 1, clearProps: 'transform' });
			return;
		}

		reducedMotion = false;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionEl,
				start: 'top top',
				end: 'bottom bottom',
				pin: pinEl,
				scrub: 1.5
			}
		});

		const pillDur = 0.12;
		const projectStart = 0.18;
		const projectSlice = (1 - projectStart) / projectCount;
		// Overlap: each card's exit overlaps with the next card's entrance
		const overlapFactor = 0.3;

		// ── Phase 1: Pill zooms in (portal) ──
		tl.to(pillEl, { scale: 25, opacity: 0, duration: pillDur, ease: 'power2.in' }, 0);

		// ── Phase 2: Letter rows fade in with 3D depth ──
		const rowDepths = [-30, -60, -40, -20]; // translateZ values for depth
		const rowRotations = [2, -1.5, 1, -2.5]; // rotateX for 3D feel

		rows.forEach((row, i) => {
			tl.fromTo(
				row,
				{ opacity: 0, z: rowDepths[i] - 50, rotateX: rowRotations[i] + 3 },
				{
					opacity: 0.45,
					z: rowDepths[i],
					rotateX: rowRotations[i],
					duration: 0.08,
					ease: 'power2.out'
				},
				0.08 + i * 0.015
			);
		});

		// ── Phase 2b: Letter rows slide (seamless marquee) ──
		rows.forEach((row, i) => {
			const startX = i % 2 === 0 ? 0 : -50;
			const endX = i % 2 === 0 ? -50 : 0;
			tl.fromTo(row, { xPercent: startX }, { xPercent: endX, duration: 0.85, ease: 'none' }, 0.12);
		});

		// ── Phase 3: Projects — floating cards with overlap ──
		slides.forEach((slide, i) => {
			const pos = cardPositions[i % cardPositions.length];
			const start = projectStart + i * projectSlice * (1 - overlapFactor);
			const enterEnd = start + projectSlice * 0.15;
			const holdEnd = start + projectSlice * 0.85;
			const exitEnd = holdEnd + projectSlice * 0.25;

			if (isMobile) {
				// Mobile: centered cards, no scatter, clean vertical entrance
				tl.fromTo(
					slide,
					{ yPercent: 40, opacity: 0, scale: 0.9 },
					{
						yPercent: 0,
						opacity: 1,
						scale: 1,
						duration: enterEnd - start,
						ease: 'power3.out'
					},
					start
				);

				// Exit (except last card stays)
				if (i < projectCount - 1) {
					tl.to(
						slide,
						{
							yPercent: -30,
							opacity: 0,
							scale: 0.95,
							duration: exitEnd - holdEnd,
							ease: 'power2.in'
						},
						holdEnd
					);
				}
			} else {
				// Desktop: scattered floating positions
				// Float in with scattered position
				tl.fromTo(
					slide,
					{
						xPercent: 120,
						yPercent: 20,
						opacity: 0,
						rotateY: -8,
						rotateZ: pos.rotate * 1.5,
						scale: 0.85
					},
					{
						xPercent: pos.x,
						yPercent: pos.y,
						opacity: 1,
						rotateY: 0,
						rotateZ: pos.rotate,
						scale: 1,
						duration: enterEnd - start,
						ease: 'power3.out'
					},
					start
				);

				// Subtle float while holding (parallax-like drift)
				tl.to(
					slide,
					{
						xPercent: pos.x - 3,
						yPercent: pos.y - 2,
						duration: holdEnd - enterEnd,
						ease: 'none'
					},
					enterEnd
				);

				// Exit (except last card stays)
				if (i < projectCount - 1) {
					tl.to(
						slide,
						{
							xPercent: -100,
							yPercent: -15,
							opacity: 0,
							rotateY: 5,
							rotateZ: -pos.rotate,
							scale: 0.9,
							duration: exitEnd - holdEnd,
							ease: 'power2.in'
						},
						holdEnd
					);
				}
			}
		});

		return () => tl.kill();
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
		<!-- ═══ DOT GRID BACKGROUND ═══ -->
		<div class="dot-grid"></div>

		<!-- ═══ PILL ═══ -->
		<div
			bind:this={pillEl}
			class="pill-layer pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
		>
			<div class="work-pill">
				<span class="pill-letter">W</span>
				<span class="pill-letter">O</span>
				<span class="pill-letter">R</span>
				<span class="pill-letter">K</span>
			</div>
		</div>

		<!-- ═══ LETTER ROWS (seamless marquee — 2 identical sets per row) ═══ -->
		<div
			bind:this={lettersEl}
			class="letters-layer pointer-events-none absolute inset-0 z-0 flex flex-col justify-center overflow-hidden select-none"
			aria-hidden="true"
			style="perspective: 600px; transform-style: preserve-3d;"
		>
			{#each ['W', 'O', 'R', 'K'] as letter (letter)}
				<div class="letter-row" style="opacity: 0; transform-style: preserve-3d;">
					<!-- Set 1 -->
					{#each { length: 15 } as _unused, j (j)}
						<span class="letter-char">{letter}</span>
					{/each}
					<!-- Set 2 (identical — for seamless loop) -->
					{#each { length: 15 } as _unused, j (`dup-${j}`)}
						<span class="letter-char">{letter}</span>
					{/each}
				</div>
			{/each}
		</div>

		<!-- ═══ PROJECTS CAROUSEL ═══ -->
		<div
			class="absolute inset-0 z-20 flex items-center justify-center"
			style="perspective: 1000px; transform-style: preserve-3d;"
		>
			<div bind:this={carouselEl} class="carousel relative h-full w-full">
				{#each projects as project, i (project.slug)}
					<a
						href="/projects/{project.slug}"
						class="project-slide group"
						data-cursor="View"
						style="opacity: 0;"
					>
						<!-- Browser chrome -->
						<div
							class="flex items-center gap-1.5 border-b border-border-subtle/50 px-3 py-2 sm:gap-2 sm:px-5 sm:py-3"
						>
							<span class="h-2 w-2 rounded-full bg-[#ff5f57] sm:h-3 sm:w-3"></span>
							<span class="h-2 w-2 rounded-full bg-[#febc2e] sm:h-3 sm:w-3"></span>
							<span class="h-2 w-2 rounded-full bg-[#28c840] sm:h-3 sm:w-3"></span>
							<div
								class="ml-2 flex-1 rounded-md bg-bg-tertiary/30 px-2 py-0.5 sm:ml-4 sm:px-3 sm:py-1"
							>
								<span class="font-mono text-[9px] text-text-muted/60 sm:text-[11px]">
									omerekmen.com/projects/{project.slug}
								</span>
							</div>
						</div>

						<!-- Content -->
						<div class="p-4 sm:p-6 md:p-8">
							<div class="flex items-center justify-between">
								<span class="font-mono text-[10px] tracking-widest text-text-muted/50 sm:text-xs">
									{String(i + 1).padStart(2, '0')} / {String(projectCount).padStart(2, '0')}
								</span>
								<TrackBadge track={project.track} progress={project.progress} />
							</div>

							<h3
								class="mt-3 text-lg font-bold tracking-tight text-text sm:mt-4 sm:text-2xl md:text-3xl"
								style="font-family: 'Bagel Fat One', sans-serif;"
							>
								{project.title}
							</h3>

							<p
								class="mt-2 line-clamp-2 text-xs leading-relaxed text-text-muted sm:mt-3 sm:line-clamp-3 sm:text-sm md:text-base"
							>
								{project.summary}
							</p>

							<div class="mt-3 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
								{#each project.stack.slice(0, 5) as tech (tech)}
									<span
										class="rounded-full border border-border-subtle bg-bg-tertiary/50 px-2 py-0.5 font-mono text-[9px] font-medium text-text-muted sm:px-3 sm:py-1 sm:text-[11px]"
									>
										{tech}
									</span>
								{/each}
								{#if project.stack.length > 5}
									<span
										class="rounded-full border border-border-subtle bg-bg-tertiary/50 px-2 py-0.5 font-mono text-[9px] font-medium text-text-muted sm:px-3 sm:py-1 sm:text-[11px]"
									>
										+{project.stack.length - 5}
									</span>
								{/if}
							</div>

							<div
								class="mt-3 flex items-center gap-2 text-xs font-medium text-accent transition-all duration-200 group-hover:gap-3 sm:mt-6 sm:text-sm"
							>
								<span>View Project</span>
								<svg
									class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 sm:h-4 sm:w-4"
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
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* ── Accessible section heading (the giant WORK letters are decoration) ── */
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

	/* ── Dot grid background ── */
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
		width: 200px;
		height: 520px;
		border-radius: 110px;
		background: var(--color-bg-secondary);
		border: 1.5px solid var(--color-border-subtle);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.1em;
		will-change: transform;
	}

	.pill-letter {
		font-family: 'Bagel Fat One', sans-serif;
		font-size: 4.5rem;
		line-height: 1;
		color: var(--color-accent);
		display: block;
	}

	/* ── Letter rows — seamless marquee strips with 3D ── */
	.letter-row {
		display: flex;
		align-items: center;
		white-space: nowrap;
		will-change: transform;
		width: max-content;
		transform-style: preserve-3d;
	}

	.letter-char {
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(5rem, 14vw, 12rem);
		line-height: 1.05;
		color: var(--color-accent);
		display: inline-block;
		flex-shrink: 0;
		padding: 0 0.08em;
		text-shadow: 0 4px 20px rgba(var(--color-accent-rgb), 0.15);
	}

	/* ── Project slides ── */
	.project-slide {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(78vw, 300px);
		background: var(--color-bg-secondary);
		border: 1px solid var(--color-border-subtle);
		border-radius: 12px;
		overflow: hidden;
		will-change: transform, opacity;
		display: block;
		text-decoration: none;
		box-shadow:
			0 25px 80px rgba(0, 0, 0, 0.35),
			0 0 0 0.5px rgba(var(--color-accent-rgb), 0.05);
		transition: box-shadow 0.3s ease;
	}

	@media (min-width: 640px) {
		.project-slide {
			width: min(70vw, 520px);
			border-radius: 16px;
		}
	}

	@media (min-width: 1024px) {
		.project-slide {
			width: min(60vw, 600px);
		}
	}

	.project-slide:hover {
		box-shadow:
			0 30px 100px rgba(0, 0, 0, 0.5),
			0 0 0 1px rgba(var(--color-accent-rgb), 0.2);
	}
</style>
