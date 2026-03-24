<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { gsap, SplitText } from '$lib/utils/gsap';
	import { projects } from '$lib/data/projects';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';

	let { data } = $props();

	const project = $derived(data.project);
	const nextProject = $derived(data.nextProject);
	const projectIndex = $derived(projects.findIndex((p) => p.id === project.id) + 1);
	const projectNumber = $derived(String(projectIndex).padStart(2, '0'));
	const title = $derived(msg(project.titleKey).toUpperCase());

	function msg(key: string): string {
		const fn = (m as unknown as Record<string, (() => string) | undefined>)[key];
		return fn?.() ?? key;
	}

	// Element refs
	let pageEl: HTMLElement | undefined = $state();
	let heroEl: HTMLElement | undefined = $state();
	let numberEl: HTMLDivElement | undefined = $state();
	let outlineTrackEl: HTMLDivElement | undefined = $state();
	let solidTrackEl: HTMLDivElement | undefined = $state();
	let badgeEl: HTMLDivElement | undefined = $state();
	let scrollIndicatorEl: HTMLDivElement | undefined = $state();
	let descriptionEl: HTMLDivElement | undefined = $state();
	let metaEl: HTMLDivElement | undefined = $state();
	let highlightsSectionEl: HTMLElement | undefined = $state();
	let stackSectionEl: HTMLElement | undefined = $state();
	let navFooterEl: HTMLElement | undefined = $state();
	let nextTitleEl: HTMLHeadingElement | undefined = $state();
	let backBtnEl: HTMLButtonElement | undefined = $state();

	// Scroll direction tracking for marquee reversal
	let lastScrollY = 0;
	let currentTimeScale = 1;

	$effect(() => {
		if (!pageEl || !heroEl) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			const els = [
				numberEl,
				outlineTrackEl,
				solidTrackEl,
				badgeEl,
				scrollIndicatorEl,
				backBtnEl,
				descriptionEl,
				metaEl
			];
			for (const el of els) {
				if (el) gsap.set(el, { opacity: 1, visibility: 'visible' });
			}
			if (highlightsSectionEl) {
				gsap.set(highlightsSectionEl.querySelectorAll('.highlight-item'), {
					opacity: 1,
					x: 0
				});
			}
			if (stackSectionEl) {
				gsap.set(stackSectionEl.querySelectorAll('.stack-pill'), {
					opacity: 1,
					scale: 1
				});
			}
			return;
		}

		// ═══ Continuous marquee via GSAP ═══
		// Use pixel-based speed so all titles slide at the same visual rate
		// regardless of text length. Track has 2 copies; wrap at half-width.
		const pxPerSecond = 60; // fixed pixels/second
		const outlineHalf = outlineTrackEl ? outlineTrackEl.scrollWidth / 2 : 1;
		const solidHalf = solidTrackEl ? solidTrackEl.scrollWidth / 2 : 1;
		let outlineX = 0;
		let solidX = 0;

		const marqueeTicker = (_: number, delta: number) => {
			const dt = delta / 1000; // delta is ms
			const px = pxPerSecond * dt * currentTimeScale;

			outlineX = (((outlineX - px) % outlineHalf) + outlineHalf) % outlineHalf;
			solidX = (((solidX + px) % solidHalf) + solidHalf) % solidHalf;

			if (outlineTrackEl) gsap.set(outlineTrackEl, { x: -outlineX });
			if (solidTrackEl) gsap.set(solidTrackEl, { x: -solidX });
		};

		gsap.ticker.add(marqueeTicker);

		// Track scroll direction to reverse marquee
		function onScroll() {
			const currentY = window.scrollY;
			const targetDir = currentY > lastScrollY ? 1 : -1;

			// Smoothly transition timeScale
			if (targetDir !== currentTimeScale) {
				currentTimeScale = targetDir;
			}

			lastScrollY = currentY;
		}

		window.addEventListener('scroll', onScroll, { passive: true });

		const ctx = gsap.context(() => {
			// ═══ HERO ENTRANCE ═══
			const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

			if (numberEl) {
				heroTl.from(numberEl, { opacity: 0, scale: 0.8, duration: 1.2 }, 0);
			}

			if (outlineTrackEl?.parentElement) {
				heroTl.from(outlineTrackEl.parentElement, { opacity: 0, duration: 1.2 }, 0.1);
			}

			if (solidTrackEl?.parentElement) {
				heroTl.from(solidTrackEl.parentElement, { opacity: 0, duration: 1.2 }, 0.2);
			}

			if (badgeEl) {
				heroTl.from(badgeEl, { opacity: 0, y: 20, duration: 0.6 }, 0.6);
			}

			if (scrollIndicatorEl) {
				heroTl.from(scrollIndicatorEl, { opacity: 0, y: 10, duration: 0.6 }, 0.8);
			}

			if (backBtnEl) {
				heroTl.from(backBtnEl, { opacity: 0, x: -20, duration: 0.5 }, 0.5);
			}

			// ═══ INFO SECTION ═══
			if (descriptionEl) {
				const splitDesc = new SplitText(descriptionEl.querySelector('.desc-text')!, {
					type: 'lines'
				});

				gsap.from(splitDesc.lines, {
					opacity: 0,
					y: 30,
					duration: 0.8,
					stagger: 0.06,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: descriptionEl,
						start: 'top 80%',
						once: true
					}
				});
			}

			if (metaEl) {
				gsap.from(metaEl.children, {
					opacity: 0,
					y: 20,
					duration: 0.6,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: metaEl,
						start: 'top 80%',
						once: true
					}
				});
			}

			// ═══ HIGHLIGHTS ═══
			if (highlightsSectionEl) {
				const items = highlightsSectionEl.querySelectorAll('.highlight-item');
				gsap.from(items, {
					opacity: 0,
					x: -40,
					duration: 0.7,
					stagger: 0.12,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: highlightsSectionEl,
						start: 'top 80%',
						once: true
					}
				});
			}

			// ═══ STACK ═══
			if (stackSectionEl) {
				const pills = stackSectionEl.querySelectorAll('.stack-pill');
				gsap.from(pills, {
					opacity: 0,
					scale: 0.6,
					duration: 0.5,
					stagger: 0.06,
					ease: 'back.out(1.7)',
					scrollTrigger: {
						trigger: stackSectionEl,
						start: 'top 80%',
						once: true
					}
				});
			}

			// ═══ NAV FOOTER ═══
			if (navFooterEl && nextTitleEl) {
				const splitNext = new SplitText(nextTitleEl, { type: 'words' });

				splitNext.words.forEach((el: Element) => {
					const word = el as HTMLElement;
					const wrapper = word.parentElement;
					if (wrapper) {
						wrapper.style.overflow = 'hidden';
						wrapper.style.display = 'inline-block';
						wrapper.style.verticalAlign = 'top';
					}
					word.style.display = 'inline-block';
				});

				gsap.from(splitNext.words, {
					yPercent: 100,
					duration: 1,
					stagger: 0.06,
					ease: 'power4.out',
					scrollTrigger: {
						trigger: navFooterEl,
						start: 'top 80%',
						once: true
					}
				});
			}
		}, pageEl);

		return () => {
			ctx.revert();
			gsap.ticker.remove(marqueeTicker);
			window.removeEventListener('scroll', onScroll);
		};
	});

	function navigateBack() {
		window.history.back();
	}
</script>

<svelte:head>
	<title>{msg(project.titleKey)} — Ömer Ekmen</title>
	<meta name="description" content={msg(project.descriptionKey)} />
</svelte:head>

{#key project.id}
	<div bind:this={pageEl} class="relative min-h-screen bg-bg">
		<!-- Fixed back button -->
		<button
			bind:this={backBtnEl}
			onclick={navigateBack}
			class="fixed top-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-bg/80 backdrop-blur-md transition-all duration-200 hover:border-accent/40 hover:bg-bg-secondary"
			aria-label="Go back"
		>
			<svg
				class="h-4 w-4 text-text-muted transition-colors duration-200 hover:text-text"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="15 18 9 12 15 6" />
			</svg>
		</button>

		<!-- ════════════════════════════════════════ -->
		<!-- HERO SECTION                            -->
		<!-- ════════════════════════════════════════ -->
		<section
			bind:this={heroEl}
			class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
		>
			<!-- Large project number — background -->
			<div
				bind:this={numberEl}
				class="pointer-events-none absolute top-8 left-8 font-mono leading-none font-black tracking-tighter select-none sm:top-12 sm:left-12 lg:left-20"
				style="font-size: clamp(6rem, 20vw, 22rem); color: rgba(var(--color-accent-rgb), 0.05);"
				aria-hidden="true"
			>
				{projectNumber}
			</div>

			<!-- Sliding title rows — opposing angles, continuous marquee -->
			<div
				class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none"
				aria-hidden="true"
			>
				<!-- Row 1: OUTLINE — rotated 5deg, auto-slides left -->
				<div class="title-row-wrapper" style="transform: rotate(5deg);">
					<div bind:this={outlineTrackEl} class="title-track">
						{#each [0, 1, 2, 3, 4, 5] as idx (idx)}
							<span class="title-outline">{title}</span>
						{/each}
					</div>
				</div>

				<!-- Row 2: SOLID — rotated -5deg, auto-slides right -->
				<div class="title-row-wrapper" style="transform: rotate(-5deg);">
					<div bind:this={solidTrackEl} class="title-track">
						{#each [0, 1, 2, 3, 4, 5] as idx (idx)}
							<span class="title-solid">{title}</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- Status badge — bottom left -->
			<div bind:this={badgeEl} class="absolute bottom-24 left-8 z-10 sm:left-12 lg:left-20">
				<StatusBadge status={project.status} />
			</div>

			<!-- Scroll indicator -->
			<div
				bind:this={scrollIndicatorEl}
				class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
				aria-hidden="true"
			>
				<div class="flex flex-col items-center gap-2">
					<span class="font-mono text-[10px] tracking-widest text-text-muted/60 uppercase"
						>Scroll</span
					>
					<div class="scroll-line h-8 w-px"></div>
				</div>
			</div>
		</section>

		<!-- ════════════════════════════════════════ -->
		<!-- INFO SECTION                            -->
		<!-- ════════════════════════════════════════ -->
		<section class="border-t border-border-subtle px-6 py-24 sm:px-12 lg:px-24">
			<div class="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_320px]">
				<!-- Left: Description -->
				<div bind:this={descriptionEl}>
					<span class="font-mono text-xs tracking-widest text-accent uppercase">
						{m.nav_about?.() ?? 'About'}
					</span>
					<p class="desc-text mt-6 text-lg leading-relaxed text-text-secondary sm:text-xl">
						{msg(project.descriptionKey)}
					</p>
				</div>

				<!-- Right: Metadata panel -->
				<div bind:this={metaEl} class="flex flex-col gap-6">
					<div class="rounded-xl border border-border-subtle bg-bg-secondary/50 p-5">
						<span class="font-mono text-[10px] tracking-widest text-text-muted uppercase">
							Status
						</span>
						<div class="mt-2">
							<StatusBadge status={project.status} />
						</div>
					</div>

					<div class="rounded-xl border border-border-subtle bg-bg-secondary/50 p-5">
						<span class="font-mono text-[10px] tracking-widest text-text-muted uppercase">
							Technologies
						</span>
						<p class="mt-2 text-2xl font-black text-accent">
							{project.stack.length}
						</p>
					</div>

					<div class="rounded-xl border border-border-subtle bg-bg-secondary/50 p-5">
						<span class="font-mono text-[10px] tracking-widest text-text-muted uppercase">
							Source
						</span>
						<div class="mt-2">
							{#if project.github}
								<a
									href={project.github}
									target="_blank"
									rel="noopener noreferrer"
									class="group inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-200 hover:text-accent-hover"
								>
									<svg
										class="h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path
											d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
										/>
									</svg>
									<span class="transition-transform duration-200 group-hover:translate-x-0.5">
										{m.view_github?.() ?? 'View on GitHub'}
									</span>
									<svg
										class="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polyline points="9 18 15 12 9 6" />
									</svg>
								</a>
							{:else}
								<span class="inline-flex items-center gap-2 text-sm text-text-muted">
									<svg
										class="h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
										<path d="M7 11V7a5 5 0 0 1 10 0v4" />
									</svg>
									{m.private_repo?.() ?? 'Private'}
								</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ════════════════════════════════════════ -->
		<!-- HIGHLIGHTS SECTION                      -->
		<!-- ════════════════════════════════════════ -->
		{#if project.highlights.length > 0}
			<section
				bind:this={highlightsSectionEl}
				class="border-t border-border-subtle px-6 py-24 sm:px-12 lg:px-24"
			>
				<div class="mx-auto max-w-6xl">
					<span class="font-mono text-xs tracking-widest text-accent uppercase"> Highlights </span>

					<div class="mt-10 flex flex-col gap-6">
						{#each project.highlights as highlight, i (highlight)}
							<div
								class="highlight-item group flex items-start gap-6 rounded-xl border-l-2 border-accent/20 py-4 pl-6 transition-colors duration-200 hover:border-accent/60 hover:bg-bg-secondary/30"
							>
								<span
									class="shrink-0 font-mono text-2xl leading-none font-black text-accent/40 transition-colors duration-200 group-hover:text-accent"
								>
									{String(i + 1).padStart(2, '0')}
								</span>
								<p class="text-base leading-relaxed text-text-secondary sm:text-lg">
									{msg(highlight)}
								</p>
							</div>
						{/each}
					</div>
				</div>
			</section>
		{/if}

		<!-- ════════════════════════════════════════ -->
		<!-- TECH STACK SECTION                      -->
		<!-- ════════════════════════════════════════ -->
		<section
			bind:this={stackSectionEl}
			class="border-t border-border-subtle px-6 py-24 sm:px-12 lg:px-24"
		>
			<div class="mx-auto max-w-6xl">
				<span class="font-mono text-xs tracking-widest text-accent uppercase"> Tech Stack </span>

				<div class="mt-10 flex flex-wrap gap-3">
					{#each project.stack as tech (tech)}
						<span
							class="stack-pill rounded-full border border-border-subtle bg-bg-secondary/60 px-4 py-2 font-mono text-sm font-medium text-text-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
						>
							{tech}
						</span>
					{/each}
				</div>
			</div>
		</section>

		<!-- ════════════════════════════════════════ -->
		<!-- NAVIGATION FOOTER                       -->
		<!-- ════════════════════════════════════════ -->
		<section bind:this={navFooterEl} class="border-t border-border-subtle">
			<a
				href="/projects/{nextProject.id}"
				data-cursor="Next"
				class="group block px-6 py-24 transition-colors duration-300 hover:bg-bg-secondary/30 sm:px-12 lg:px-24"
			>
				<div class="mx-auto max-w-6xl">
					<span class="font-mono text-xs tracking-widest text-text-muted uppercase">
						Next Project
					</span>

					<div class="mt-6 flex items-center gap-6">
						<h2
							bind:this={nextTitleEl}
							class="leading-tight font-black tracking-tight text-text transition-colors duration-200 group-hover:text-accent"
							style="font-size: clamp(2rem, 6vw, 5rem);"
						>
							{msg(nextProject.titleKey)}
						</h2>

						<svg
							class="h-8 w-8 shrink-0 text-text-muted transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent sm:h-10 sm:w-10"
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

			<div class="border-t border-border-subtle px-6 py-8 sm:px-12 lg:px-24">
				<div class="mx-auto flex max-w-6xl items-center justify-between">
					<a
						href="/"
						class="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-text-muted uppercase transition-colors duration-200 hover:text-accent"
					>
						<svg
							class="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="19" y1="12" x2="5" y2="12" />
							<polyline points="12 19 5 12 12 5" />
						</svg>
						Home
					</a>

					<span class="font-mono text-[10px] tracking-widest text-text-muted/50 uppercase">
						{projectNumber} / {String(projects.length).padStart(2, '0')}
					</span>
				</div>
			</div>
		</section>
	</div>
{/key}

<style>
	/* ── Title row wrappers ── */
	.title-row-wrapper {
		width: 200vw;
		overflow: visible;
		display: flex;
		align-items: center;
	}

	/* ── Seamless marquee track ── */
	.title-track {
		display: flex;
		align-items: center;
		gap: 0.4em;
		white-space: nowrap;
		will-change: transform;
		font-family: 'Bagel Fat One', 'Anton', 'Impact', sans-serif;
		font-size: clamp(5rem, 15vw, 14rem);
		line-height: 0;
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	/* Outline text — clean stroke, no fill */
	.title-outline {
		color: transparent;
		-webkit-text-stroke: 1px rgba(var(--color-text-rgb), 0.2);
		paint-order: stroke fill;
	}

	/* Solid text — filled */
	.title-solid {
		color: var(--color-text);
	}

	/* Scroll indicator pulse */
	.scroll-line {
		background: linear-gradient(to bottom, rgba(var(--color-text-rgb), 0.3), transparent);
		animation: scroll-pulse 2s ease-in-out infinite;
	}

	@keyframes scroll-pulse {
		0%,
		100% {
			opacity: 0.4;
			transform: scaleY(1);
		}
		50% {
			opacity: 1;
			transform: scaleY(1.3);
			transform-origin: top;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-line {
			animation: none;
		}
	}
</style>
