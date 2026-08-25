<script lang="ts">
	import { gsap, ScrollTrigger } from '$lib/utils/gsap';
	import TrackBadge from '$lib/components/ui/TrackBadge.svelte';
	import { featuredProjects } from '$lib/content/projects';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { parseMetric, formatMetric } from '$lib/utils/metric';

	const projects = featuredProjects(getLocale());
	const total = projects.length;

	/**
	 * How the section behaves, decided once from the visitor's own settings.
	 *
	 * - `pinned` — vertical scroll drives horizontal travel. The default on a
	 *   mouse, where scroll is the only gesture available.
	 * - `swipe` — a natively scrollable track with snap points. Touch already has
	 *   a horizontal gesture; taking the vertical one away and translating it is
	 *   what makes these sections hated on phones.
	 * - `list` — a plain vertical list. Not a degraded pinned mode: no pinning, no
	 *   translation, nothing left mid-animation.
	 */
	type Mode = 'pinned' | 'swipe' | 'list';
	let mode = $state<Mode>('list');

	let activeIndex = $state(0);
	let progress = $state(0);

	const LETTERS = ['W', 'O', 'R', 'K'];

	let sectionEl: HTMLElement | undefined = $state();
	let lettersEl: HTMLDivElement | undefined = $state();
	let pinEl: HTMLDivElement | undefined = $state();
	let trackEl: HTMLDivElement | undefined = $state();
	let sectionHeight = $state('auto');

	const panelEls: HTMLElement[] = [];
	/** Metrics count once, the first time their panel is reached. */
	const counted: boolean[] = [];

	function countPanel(index: number) {
		if (counted[index]) return;
		counted[index] = true;
		const panel = panelEls[index];
		if (!panel) return;
		panel.querySelectorAll<HTMLElement>('[data-count]').forEach((el, i) => {
			const parsed = parseMetric(el.dataset.final ?? '');
			if (parsed.literal) return;
			const counter = { v: 0 };
			gsap.to(counter, {
				v: parsed.value,
				duration: 1,
				delay: i * 0.08,
				ease: 'power2.out',
				onUpdate: () => {
					el.textContent = formatMetric(parsed, counter.v);
				}
			});
		});
	}

	function setActive(index: number) {
		const clamped = Math.max(0, Math.min(total - 1, index));
		if (clamped !== activeIndex) activeIndex = clamped;
		countPanel(clamped);
	}

	/** Left edge of a panel within the track, in track coordinates. */
	function panelOffset(index: number): number {
		const panel = panelEls[index];
		if (!panel || !trackEl) return 0;
		return panel.offsetLeft - trackEl.offsetLeft;
	}

	let travel = 0;
	let triggerStart = 0;
	let triggerEnd = 0;
	/** The scrubbed tween and its trigger, so a focus jump can bypass the lag. */
	let scrubTween: gsap.core.Tween | undefined;
	let scrubTrigger: ScrollTrigger | undefined;

	/**
	 * Scrubbing is what makes the travel feel weighted, and it is exactly wrong
	 * when focus moves: the page jumps instantly, the track follows 0.6s later,
	 * and for that window the focused panel is still off screen. Snap the tween
	 * to the new scroll position so focus and the panel arrive together.
	 */
	function snapTrack() {
		if (!scrubTween || !scrubTrigger) return;
		ScrollTrigger.update();
		scrubTween.progress(scrubTrigger.progress);
	}

	/**
	 * Brings a panel into view in whichever mode is running. In `pinned` mode the
	 * track's position is a function of page scroll, so moving to a panel means
	 * scrolling the page to the offset that puts it there.
	 */
	function goToPanel(index: number, smooth = true) {
		const clamped = Math.max(0, Math.min(total - 1, index));
		const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto';

		if (mode === 'swipe' && trackEl) {
			trackEl.scrollTo({ left: panelOffset(clamped), behavior });
			return;
		}
		if (mode === 'pinned' && travel > 0) {
			const ratio = Math.max(0, Math.min(1, panelOffset(clamped) / travel));
			window.scrollTo({ top: triggerStart + (triggerEnd - triggerStart) * ratio, behavior });
			if (!smooth) snapTrack();
			return;
		}
		panelEls[clamped]?.scrollIntoView({ behavior, block: 'nearest' });
	}

	/** Sends the track all the way to the end cap. */
	function scrollToEnd() {
		if (mode === 'swipe' && trackEl) {
			trackEl.scrollTo({ left: trackEl.scrollWidth, behavior: 'auto' });
			return;
		}
		if (mode === 'pinned') {
			window.scrollTo({ top: triggerEnd, behavior: 'auto' });
			snapTrack();
		}
	}

	function onKeydown(event: KeyboardEvent) {
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (step === 0) return;
		event.preventDefault();
		goToPanel(activeIndex + step);
	}

	/**
	 * Tabbing must not move focus to something off screen. In `pinned` mode the
	 * browser cannot scroll a translated track into view by itself, so the page
	 * scroll is moved instead.
	 */
	function onFocusIn(event: FocusEvent) {
		const panel = (event.target as HTMLElement)?.closest<HTMLElement>('.panel');
		if (!panel) return;

		const box = panel.getBoundingClientRect();
		const onScreen = box.left >= 0 && box.right <= window.innerWidth;

		const index = panelEls.indexOf(panel);
		if (index === -1) {
			// The end cap sits past the last panel and is not one of them, so it has
			// no index to scroll to — send the track to the end instead. Without
			// this, tabbing to it leaves focus on something off screen.
			if (!onScreen) scrollToEnd();
			return;
		}

		if (!onScreen) goToPanel(index, false);
		setActive(index);
	}

	/** Progress in `swipe` mode comes from the track's own scroll position. */
	function onTrackScroll() {
		if (mode !== 'swipe' || !trackEl) return;
		const max = trackEl.scrollWidth - trackEl.clientWidth;
		progress = max > 0 ? trackEl.scrollLeft / max : 0;
		let nearest = 0;
		let best = Infinity;
		for (let i = 0; i < total; i++) {
			const distance = Math.abs(panelOffset(i) - trackEl.scrollLeft);
			if (distance < best) {
				best = distance;
				nearest = i;
			}
		}
		setActive(nearest);
	}

	$effect(() => {
		if (!sectionEl || !pinEl || !trackEl) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		const coarse = window.matchMedia('(pointer: coarse)');

		let ctx: gsap.Context | undefined;

		const build = () => {
			ctx?.revert();
			ctx = undefined;
			gsap.set(trackEl!, { clearProps: 'transform' });
			sectionHeight = 'auto';
			scrubTween = undefined;
			scrubTrigger = undefined;

			mode = reduced.matches ? 'list' : coarse.matches ? 'swipe' : 'pinned';

			if (mode === 'list') {
				// Every metric is final immediately; nothing here waits on a timeline.
				for (const el of sectionEl!.querySelectorAll<HTMLElement>('[data-count]')) {
					el.textContent = el.dataset.final ?? el.textContent;
				}
				projects.forEach((_, i) => (counted[i] = true));
				progress = 0;
				return;
			}

			if (mode === 'swipe') {
				onTrackScroll();
				countPanel(0);
				return;
			}

			ctx = gsap.context(() => {
				travel = trackEl!.scrollWidth - window.innerWidth;
				if (travel <= 0) return;

				/*
				 * Scroll distance is deliberately shorter than the travel, so the
				 * track moves faster than the page and the section costs about three
				 * screens instead of one per project. The cap is what stops a
				 * twentieth project adding twenty screens: past roughly a dozen the
				 * panels start moving fast enough that curating beats scrolling, and
				 * that is the signal to curate rather than to raise the cap.
				 */
				const distance = Math.min(travel * 0.6, window.innerHeight * 3.2);
				sectionHeight = `${window.innerHeight + distance}px`;

				scrubTween = gsap.to(trackEl!, {
					x: -travel,
					ease: 'none',
					scrollTrigger: {
						trigger: sectionEl!,
						start: 'top top',
						end: 'bottom bottom',
						pin: pinEl!,
						scrub: 0.6,
						invalidateOnRefresh: true,
						onRefresh: (self) => {
							travel = trackEl!.scrollWidth - window.innerWidth;
							triggerStart = self.start;
							triggerEnd = self.end;
							scrubTrigger = self;
						},
						onUpdate: (self) => {
							progress = self.progress;
							// Each row drifts at its own rate, against the track.
							if (lettersEl) {
								const rows = lettersEl.querySelectorAll<HTMLElement>('.letter-row');
								rows.forEach((row, i) => {
									const rate = 0.12 + i * 0.05;
									row.style.transform = `translate3d(${self.progress * travel * rate}px,0,0)`;
								});
							}
							const x = self.progress * travel;
							let nearest = 0;
							let best = Infinity;
							for (let i = 0; i < total; i++) {
								const d = Math.abs(panelOffset(i) - x);
								if (d < best) {
									best = d;
									nearest = i;
								}
							}
							setActive(nearest);
						}
					}
				});
			}, sectionEl);

			// Display faces land after first layout and every measurement above
			// depends on them.
			void document.fonts?.ready.then(() => ScrollTrigger.refresh());
		};

		build();
		reduced.addEventListener('change', build);
		coarse.addEventListener('change', build);

		return () => {
			reduced.removeEventListener('change', build);
			coarse.removeEventListener('change', build);
			ctx?.revert();
		};
	});
</script>

<section
	id="work"
	bind:this={sectionEl}
	class="work mode-{mode}"
	style={mode === 'pinned' ? `height: ${sectionHeight};` : ''}
>
	<h2 class="sr-only">{m.work_heading()}</h2>

	<div bind:this={pinEl} class="stage">
		<div class="dot-grid" aria-hidden="true"></div>

		<!--
			The oversized WORK rows are part of the site's identity, kept from the
			stacked version. They run counter to the track so the two layers read as
			depth rather than as one sheet sliding.
		-->
		<div bind:this={lettersEl} class="letters" aria-hidden="true">
			{#each LETTERS as letter, row (letter)}
				<div class="letter-row" data-row={row}>
					{#each { length: 18 } as _unused, i (i)}
						<span>{letter}</span>
					{/each}
				</div>
			{/each}
		</div>

		<header class="stage-head">
			<span class="stage-label">{m.work_heading()}</span>

			{#if mode !== 'list'}
				<!-- Progress is not decoration: a horizontal section that hides its own
				     length is the thing that makes people distrust them. -->
				<div class="progress" role="group" aria-label={m.work_position()}>
					<span class="position">
						<b>{String(activeIndex + 1).padStart(2, '0')}</b>
						<i>/</i>
						{String(total).padStart(2, '0')}
					</span>
					<div class="bar">
						<span style="transform: scaleX({Math.max(0.02, progress)})"></span>
					</div>
				</div>
			{/if}
		</header>

		<!--
			A scrollable region must be reachable and operable from the keyboard, or
			a keyboard user cannot read past the first panel — WCAG 2.1.1, and the
			reason browsers focus overflow containers natively. The rules below fire
			on the generic pattern and do not know about the scrollable-region
			exception, so they are silenced here rather than the markup made worse.
		-->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			bind:this={trackEl}
			class="track"
			role="region"
			aria-label={m.work_heading()}
			tabindex="0"
			onscroll={onTrackScroll}
			onkeydown={onKeydown}
			onfocusin={onFocusIn}
		>
			{#each projects as project, i (project.slug)}
				<article class="panel" class:on={i === activeIndex} bind:this={panelEls[i]}>
					<div class="panel-head">
						<span class="index">{String(i + 1).padStart(2, '0')}</span>
						<TrackBadge track={project.track} progress={project.progress} />
					</div>

					<h3 class="title">
						<a href={localizeHref(`/projects/${project.slug}`)} data-cursor="View">
							{project.title}
						</a>
					</h3>
					<p class="role">{project.role}</p>
					<p class="summary">{project.summary}</p>

					{#if project.metrics.length}
						<dl class="metrics">
							{#each project.metrics.slice(0, 3) as metric (metric.label)}
								{@const parsed = parseMetric(metric.value)}
								<div>
									<dd
										data-count={parsed.literal ? undefined : parsed.value}
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

					<span class="cta" aria-hidden="true">
						{m.work_view_project()}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					</span>
				</article>
			{/each}

			<!-- The end cap. The homepage is a pass through the work, not the index. -->
			<a href={localizeHref('/projects')} class="panel panel-more">
				<span class="more-count">{String(total).padStart(2, '0')}</span>
				<span class="more-label">{m.work_all_projects()}</span>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<line x1="5" y1="12" x2="19" y2="12" />
					<polyline points="12 5 19 12 12 19" />
				</svg>
			</a>
		</div>

		{#if mode !== 'list'}
			<p class="hint">{mode === 'swipe' ? m.work_swipe_hint() : m.work_scroll_hint()}</p>
		{/if}
	</div>
</section>

<style>
	.sr-only {
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

	.work {
		position: relative;
	}

	.stage {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1.75rem;
		overflow: hidden;
		background: var(--color-bg);
	}

	.mode-pinned .stage,
	.mode-swipe .stage {
		height: 100vh;
		width: 100%;
	}

	.mode-list .stage {
		padding: 4rem 0;
	}

	.dot-grid {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background-image: radial-gradient(
			circle,
			rgba(var(--color-accent-rgb), 0.1) 1px,
			transparent 1px
		);
		background-size: 28px 28px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 78%);
		-webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 78%);
	}

	/* ── Identity layer ── */
	.letters {
		position: absolute;
		inset: 0;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;
		overflow: hidden;
		pointer-events: none;
		user-select: none;
		mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
		-webkit-mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
	}

	.letter-row {
		display: flex;
		gap: 2.5rem;
		white-space: nowrap;
		will-change: transform;
	}

	.letter-row:nth-child(even) {
		margin-left: -8rem;
	}

	.letter-row span {
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(4rem, 11vw, 9rem);
		line-height: 0.9;
		color: transparent;
		-webkit-text-stroke: 1px rgba(var(--color-accent-rgb), 0.16);
	}

	.mode-list .letters {
		display: none;
	}

	/* ── Head ── */
	.stage-head {
		position: relative;
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-inline: clamp(1.5rem, 5vw, 4rem);
	}

	.stage-label {
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(1.75rem, 4vw, 2.75rem);
		line-height: 1;
		color: var(--color-accent);
	}

	.progress {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.position {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}

	.position b {
		color: var(--color-text);
		font-weight: 600;
	}

	.position i {
		margin-inline: 0.15rem;
		font-style: normal;
	}

	.bar {
		position: relative;
		width: clamp(80px, 18vw, 200px);
		height: 2px;
		border-radius: 2px;
		background: var(--color-border);
		overflow: hidden;
	}

	.bar span {
		position: absolute;
		inset: 0;
		background: var(--color-accent);
		transform-origin: left;
		transition: transform 0.15s linear;
	}

	/* ── Track ── */
	.track {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: stretch;
		gap: 1.5rem;
		padding-inline: clamp(1.5rem, 5vw, 4rem);
	}

	.mode-pinned .track {
		width: max-content;
		will-change: transform;
	}

	.mode-swipe .track {
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: thin;
		-webkit-overflow-scrolling: touch;
	}

	.mode-swipe .panel {
		scroll-snap-align: start;
	}

	.mode-list .track {
		flex-direction: column;
		align-items: stretch;
		max-width: 46rem;
		margin-inline: auto;
		gap: 1.25rem;
	}

	/* ── Panel ── */
	.panel {
		display: flex;
		width: min(26rem, 78vw);
		flex: 0 0 auto;
		flex-direction: column;
		gap: 0.6rem;
		border: 1px solid var(--color-border);
		border-radius: 18px;
		background: var(--color-bg-secondary);
		padding: 1.5rem;
		transition:
			border-color 0.3s ease,
			transform 0.3s ease;
	}

	.mode-list .panel {
		width: auto;
	}

	.mode-pinned .panel.on,
	.mode-swipe .panel.on {
		border-color: rgba(var(--color-accent-rgb), 0.55);
		transform: translateY(-6px);
	}

	.panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.index {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}

	.title {
		margin: 0.35rem 0 0;
		font-size: 1.3rem;
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 1.2;
	}

	.title a {
		color: var(--color-text);
		text-decoration: none;
	}

	/* The whole panel is the target; the link keeps the accessible name. */
	.title a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.panel {
		position: relative;
	}

	.title a:hover,
	.title a:focus-visible {
		color: var(--color-accent-text);
	}

	.role {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--color-text-muted);
	}

	.summary {
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
		line-height: 1.65;
		color: var(--color-text-secondary);
	}

	.metrics {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin: 1rem 0 0;
	}

	.metrics div {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.metrics dd {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-accent-text);
		font-variant-numeric: tabular-nums;
	}

	.metrics dt {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-top: auto;
		padding-top: 1.1rem;
	}

	/*
	 * Pushing the chips to the bottom keeps the panels aligned on a wide screen.
	 * On a phone the panel is far taller than its content, so the same rule opens
	 * a hole in the middle of every card — pack the content instead and let the
	 * spare room fall below it.
	 */
	@media (max-width: 640px) {
		.chips {
			margin-top: 0.75rem;
		}
	}

	.chip {
		border: 1px solid var(--color-border-subtle);
		border-radius: 999px;
		padding: 0.2rem 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		color: var(--color-text-muted);
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.9rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--color-accent-text);
	}

	.cta svg {
		width: 14px;
		height: 14px;
	}

	/* ── End cap ── */
	.panel-more {
		align-items: flex-start;
		justify-content: center;
		width: min(18rem, 70vw);
		gap: 0.75rem;
		border-style: dashed;
		background: transparent;
		color: var(--color-text);
		text-decoration: none;
	}

	.panel-more:hover,
	.panel-more:focus-visible {
		border-color: rgba(var(--color-accent-rgb), 0.55);
	}

	.more-count {
		font-family: 'Bagel Fat One', sans-serif;
		font-size: 3rem;
		line-height: 1;
		color: var(--color-accent);
	}

	.more-label {
		font-size: 1rem;
		font-weight: 600;
	}

	.panel-more svg {
		width: 22px;
		height: 22px;
		color: var(--color-accent-text);
	}

	/* ── Hint ── */
	.hint {
		position: relative;
		z-index: 2;
		margin: 0;
		padding-inline: clamp(1.5rem, 5vw, 4rem);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.panel,
		.bar span {
			transition: none;
		}
	}
</style>
