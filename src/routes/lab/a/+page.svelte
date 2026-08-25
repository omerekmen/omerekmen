<script lang="ts">
	import { sample, capabilities, sections } from '../sample';
	import NetworkBackground from '$lib/components/visualizations/NetworkBackground.svelte';
	import { gsap, ScrollTrigger, SplitText } from '$lib/utils/gsap';
	import { parseMetric, formatMetric } from '$lib/utils/metric';

	const projects = sample.projects;
	const ctaLetters = "LET'S TALK".split('');
	/** Enough copies of a title to fill the widest row twice over. */
	const repeats = [0, 1, 2, 3, 4, 5, 6, 7];

	let root: HTMLElement | undefined = $state();
	let heroEl: HTMLElement | undefined = $state();
	let nameEl: HTMLHeadingElement | undefined = $state();
	let litEl: HTMLDivElement | undefined = $state();
	let workTitleEl: HTMLHeadingElement | undefined = $state();
	let proseEl: HTMLDivElement | undefined = $state();
	let ctaEl: HTMLElement | undefined = $state();

	/** Marquee tracks, one per work row, indexed to match `projects`. */
	let trackEls: HTMLDivElement[] = [];

	let openIndex = $state(0);
	let hoverIndex = $state(-1);
	let activeSection = $state('intro');
	let chapters: { id: string; label: string }[] = $state([]);
	let activeChapter = $state('');
	let readProgress = $state(0);

	/**
	 * Plain mirrors of the two indices above. The ticker runs every frame and
	 * only needs the current value, so it reads these rather than the runes.
	 */
	let openMirror = 0;
	let hoverMirror = -1;

	function openRow(i: number) {
		openIndex = openIndex === i ? -1 : i;
		openMirror = openIndex;
		// The panel changes the page height, so every trigger below it has moved.
		setTimeout(() => ScrollTrigger.refresh(), 500);
	}

	function hoverRow(i: number) {
		hoverIndex = i;
		hoverMirror = i;
	}

	/** Roving focus, so the index is usable without a mouse. */
	function onIndexKey(event: KeyboardEvent, i: number) {
		const next = event.key === 'ArrowDown' ? i + 1 : event.key === 'ArrowUp' ? i - 1 : -1;
		if (next < 0 || next >= projects.length) return;
		event.preventDefault();
		const buttons = root?.querySelectorAll<HTMLButtonElement>('.row-head');
		buttons?.[next]?.focus();
	}

	function scrollTo(id: string) {
		document.getElementById(id)?.scrollIntoView({
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
			block: 'start'
		});
	}

	/** Counts every `[data-count]` in a panel once, the first time it opens. */
	const counted: boolean[] = [];
	/** The first row is open by default; its numbers wait until you get there. */
	let workSeen = $state(false);
	function countPanel(i: number) {
		if (counted[i]) return;
		counted[i] = true;
		const panel = root?.querySelectorAll<HTMLElement>('.row-panel')[i];
		if (!panel) return;
		panel.querySelectorAll<HTMLElement>('[data-count]').forEach((el, mi) => {
			const parsed = parseMetric(el.dataset.final ?? '');
			if (parsed.literal) return;
			const counter = { v: 0 };
			gsap.to(counter, {
				v: parsed.value,
				duration: 1.1,
				delay: mi * 0.08,
				ease: 'power2.out',
				onUpdate: () => {
					el.textContent = formatMetric(parsed, counter.v);
				}
			});
		});
	}

	$effect(() => {
		if (workSeen && openIndex >= 0) countPanel(openIndex);
	});

	$effect(() => {
		if (!root || !heroEl || !nameEl || !litEl) return;

		// The count-ups wait until the section is actually on screen. An observer
		// measures at the moment of intersection, so it cannot be thrown off by
		// the page growing after the triggers were first laid out.
		const workEl = document.getElementById('work');
		const seen = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					workSeen = true;
					seen.disconnect();
				}
			},
			{ rootMargin: '0px 0px -15% 0px' }
		);
		if (workEl) seen.observe(workEl);

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// The panels count up on open, which never happens without motion.
		if (reduced) {
			root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
				el.textContent = el.dataset.final ?? el.textContent;
			});
			projects.forEach((_, i) => (counted[i] = true));
			gsap.set(root.querySelectorAll('.rise, .on-scroll'), { opacity: 1, y: 0 });
			litEl.style.setProperty('--lit-o', '0');
		}

		const ctx = gsap.context(() => {
			// ═══ Entrance ═══
			if (!reduced) {
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

				// The section word drifts sideways as you pass it. Small, but it
				// stops the outline type from reading as a static graphic.
				if (workTitleEl) {
					gsap.fromTo(
						workTitleEl,
						{ xPercent: -4 },
						{
							xPercent: 4,
							ease: 'none',
							scrollTrigger: {
								trigger: workTitleEl,
								start: 'top bottom',
								end: 'bottom top',
								scrub: 1
							}
						}
					);
				}
			}

			const workEl = document.getElementById('work');
			if (workEl) {
				gsap.timeline({
					scrollTrigger: {
						trigger: workEl,
						start: 'top 85%',
						once: true,
						onEnter: () => (workSeen = true)
					}
				});
			}

			// ═══ Section rail ═══
			sections.forEach((section) => {
				const el = document.getElementById(section.id);
				if (!el) return;
				const setActive = () => (activeSection = section.id);
				gsap.timeline({
					scrollTrigger: {
						trigger: el,
						start: 'top 45%',
						end: 'bottom 45%',
						onEnter: setActive,
						onEnterBack: setActive
					}
				});
			});

			// ═══ Case-study reading progress ═══
			if (proseEl) {
				// Built into a local first. Reading `chapters` back inside the effect
				// that writes it is what an effect loop is made of.
				const list = Array.from(proseEl.querySelectorAll<HTMLElement>('h2')).map((h, i) => {
					const id = h.id || `chapter-${i + 1}`;
					h.id = id;
					return { id, label: h.textContent?.trim() ?? `Section ${i + 1}` };
				});
				chapters = list;
				if (list.length) activeChapter = list[0].id;

				list.forEach((chapter) => {
					const el = document.getElementById(chapter.id);
					if (!el) return;
					const setActive = () => (activeChapter = chapter.id);
					gsap.timeline({
						scrollTrigger: {
							trigger: el,
							start: 'top 30%',
							end: 'bottom 30%',
							onEnter: setActive,
							onEnterBack: setActive
						}
					});
				});

				gsap.timeline({
					scrollTrigger: {
						trigger: proseEl,
						start: 'top 70%',
						end: 'bottom 90%',
						scrub: true,
						onUpdate: (self) => (readProgress = self.progress)
					}
				});
			}
		}, root);

		// Display faces and the case-study prose both land after the first layout
		// pass, and every trigger start below them is wrong until they do.
		void document.fonts?.ready.then(() => ScrollTrigger.refresh());

		if (reduced)
			return () => {
				seen.disconnect();
				ctx.revert();
			};

		// ═══ Cursor-lit name ═══
		// A second copy of the name in solid accent sits under a radial mask that
		// chases the pointer. With no pointer it drifts on its own, so the effect
		// is not something only desktop visitors ever see.
		const lit = litEl!;
		const coarse = window.matchMedia('(pointer: coarse)').matches;
		let targetX = 0.32;
		let targetY = 0.5;
		let x = targetX;
		let y = targetY;
		let idleSince = performance.now();

		const onPointer = (event: PointerEvent) => {
			const box = heroEl!.getBoundingClientRect();
			targetX = (event.clientX - box.left) / box.width;
			targetY = (event.clientY - box.top) / box.height;
			idleSince = performance.now();
		};
		if (!coarse) heroEl!.addEventListener('pointermove', onPointer);

		const litTick = () => {
			// Two seconds without a pointer and the light takes over by itself.
			const now = performance.now();
			if (coarse || now - idleSince > 2000) {
				const t = now / 1000;
				targetX = 0.5 + Math.sin(t * 0.34) * 0.34;
				targetY = 0.5 + Math.cos(t * 0.23) * 0.22;
			}
			x += (targetX - x) * 0.08;
			y += (targetY - y) * 0.08;
			lit.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
			lit.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);
		};
		gsap.ticker.add(litTick);

		// ═══ Row marquees ═══
		// Only the hovered or open row moves — no work is done for the rest.
		const offsets = projects.map(() => 0);
		const marqueeTick = (_t: number, delta: number) => {
			for (let i = 0; i < trackEls.length; i++) {
				const track = trackEls[i];
				if (!track) continue;
				const live = i === hoverMirror || i === openMirror;
				if (!live) continue;
				const half = track.scrollWidth / 2 || 1;
				offsets[i] = (offsets[i] + 42 * (delta / 1000)) % half;
				track.style.transform = `translate3d(${-offsets[i]}px,0,0)`;
			}
		};
		gsap.ticker.add(marqueeTick);

		// ═══ Magnetic CTA ═══
		let letterTo: ((v: number) => void)[][] = [];
		const cta = ctaEl;
		let onCtaMove: ((event: PointerEvent) => void) | undefined;
		let onCtaLeave: (() => void) | undefined;
		if (cta && !coarse) {
			const letters = Array.from(cta.querySelectorAll<HTMLElement>('.cta-letter'));
			letterTo = letters.map((el) => [
				gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }),
				gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
			]);
			onCtaMove = (event: PointerEvent) => {
				letters.forEach((el, i) => {
					const box = el.getBoundingClientRect();
					const dx = event.clientX - (box.left + box.width / 2);
					const dy = event.clientY - (box.top + box.height / 2);
					const dist = Math.hypot(dx, dy);
					const pull = Math.max(0, 1 - dist / 320);
					letterTo[i][0](dx * 0.16 * pull);
					letterTo[i][1](dy * 0.22 * pull);
				});
			};
			onCtaLeave = () => letterTo.forEach(([tx, ty]) => (tx(0), ty(0)));
			cta.addEventListener('pointermove', onCtaMove);
			cta.addEventListener('pointerleave', onCtaLeave);
		}

		return () => {
			seen.disconnect();
			gsap.ticker.remove(litTick);
			gsap.ticker.remove(marqueeTick);
			if (!coarse) heroEl?.removeEventListener('pointermove', onPointer);
			if (cta && onCtaMove) cta.removeEventListener('pointermove', onCtaMove);
			if (cta && onCtaLeave) cta.removeEventListener('pointerleave', onCtaLeave);
			ctx.revert();
		};
	});
</script>

<svelte:head>
	<title>Direction A — Refined Kinetic</title>
</svelte:head>

<div bind:this={root} class="dir-a">
	<!-- Section rail: navigation, and a constant sense of where you are. -->
	<nav class="rail" aria-label="Sections">
		{#each sections as section (section.id)}
			<button
				class="rail-dot"
				class:on={activeSection === section.id}
				onclick={() => scrollTo(section.id)}
			>
				<span class="rail-label">{section.label}</span>
				<span class="rail-mark" aria-hidden="true"></span>
			</button>
		{/each}
	</nav>

	<!-- ═══ HERO ═══ -->
	<section bind:this={heroEl} id="intro" class="hero">
		<NetworkBackground />
		<div class="hero-inner">
			<p class="rise eyebrow">
				<span class="dot" aria-hidden="true"></span>
				{sample.currentRole.role} · {sample.currentRole.company}
			</p>

			<div class="name-stack">
				<h1 bind:this={nameEl} class="display name">{sample.name.toUpperCase()}</h1>
				<div bind:this={litEl} class="display name name-lit" aria-hidden="true">
					{sample.name.toUpperCase()}
				</div>
			</div>
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
	<section id="work" class="work">
		<header class="work-head on-scroll">
			<span class="section-tag">Selected work</span>
			<h2 bind:this={workTitleEl} class="display work-title">WORK</h2>
			<p class="work-hint">{projects.length} systems · open one to read the detail</p>
		</header>

		<ul class="index">
			{#each projects as project, i (project.slug)}
				<li
					class="row"
					class:open={openIndex === i}
					class:live={hoverIndex === i || openIndex === i}
				>
					<!-- Repeated title behind the row, moving only while the row is live. -->
					<div class="row-marquee" aria-hidden="true">
						<div class="row-track" bind:this={trackEls[i]}>
							{#each repeats as r (r)}
								<span>{project.title.toUpperCase()}</span><span class="sep">◦</span>
							{/each}
						</div>
					</div>

					<button
						class="row-head"
						aria-expanded={openIndex === i}
						aria-controls="panel-{project.slug}"
						onclick={() => openRow(i)}
						onmouseenter={() => hoverRow(i)}
						onmouseleave={() => hoverRow(-1)}
						onfocus={() => hoverRow(i)}
						onblur={() => hoverRow(-1)}
						onkeydown={(e) => onIndexKey(e, i)}
					>
						<span class="row-num">{String(i + 1).padStart(2, '0')}</span>
						<span class="row-title">{project.title}</span>
						<span class="row-meta">
							<span class="track track-{project.track}">
								{project.progress ?? project.track.replace('-', ' ')}
							</span>
							<span class="row-period">{project.period}</span>
						</span>
						<span class="row-plus" aria-hidden="true"></span>
					</button>

					<div class="row-panel" id="panel-{project.slug}">
						<div class="row-panel-inner">
							<div class="panel-copy">
								<p class="panel-role">{project.role}</p>
								<p class="panel-summary">{project.summary}</p>
								<div class="chips">
									{#each project.stack.slice(0, 8) as tech (tech)}<span>{tech}</span>{/each}
								</div>
							</div>
							{#if project.metrics.length}
								<div class="metrics">
									{#each project.metrics as metric (metric.label)}
										{@const parsed = parseMetric(metric.value)}
										<div>
											<span
												class="m-value"
												data-count={parsed.literal ? undefined : parsed.value}
												data-final={metric.value}
											>
												{parsed.literal ? metric.value : formatMetric(parsed, 0)}
											</span>
											<span class="m-label">{metric.label}</span>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</section>

	<!-- ═══ CASE STUDY ═══ -->
	{#if sample.caseStudy}
		{@const Body = sample.caseStudyBody}
		<section id="case" class="case">
			<aside class="contents" aria-label="Case study contents">
				<div class="contents-sticky">
					<span class="section-tag">Case study</span>
					<p class="contents-title">{sample.caseStudy.meta.title}</p>
					<div class="progress" aria-hidden="true">
						<span style="transform: scaleX({readProgress})"></span>
					</div>
					<ol class="chapter-list">
						{#each chapters as chapter (chapter.id)}
							<li>
								<button
									class:on={activeChapter === chapter.id}
									onclick={() => scrollTo(chapter.id)}
								>
									{chapter.label}
								</button>
							</li>
						{/each}
					</ol>
				</div>
			</aside>
			<div class="case-body">
				<h2 class="case-title display on-scroll">{sample.caseStudy.meta.title}</h2>
				<div bind:this={proseEl} class="prose">
					<Body />
				</div>
			</div>
		</section>
	{/if}

	<!-- ═══ CTA ═══ -->
	<footer bind:this={ctaEl} id="contact" class="cta">
		<a href="mailto:{sample.email}" class="cta-text display" aria-label="Let's talk">
			{#each ctaLetters as letter, i (i)}
				{#if letter === ' '}
					<span class="cta-space" aria-hidden="true">&nbsp;</span>
				{:else}
					<span class="cta-letter" aria-hidden="true">{letter}</span>
				{/if}
			{/each}
		</a>
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

	.section-tag {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	/* ── Section rail ── */
	.rail {
		position: fixed;
		top: 50%;
		right: 18px;
		z-index: 40;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 14px;
		transform: translateY(-50%);
	}

	.rail-dot {
		display: flex;
		align-items: center;
		gap: 10px;
		border: 0;
		background: none;
		padding: 0;
		cursor: pointer;
		color: var(--muted);
	}

	.rail-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0;
		transform: translateX(6px);
		transition:
			opacity 0.25s ease,
			transform 0.25s ease;
	}

	.rail-mark {
		display: block;
		width: 18px;
		height: 2px;
		border-radius: 2px;
		background: currentColor;
		opacity: 0.4;
		transition:
			width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.25s ease;
	}

	.rail-dot:hover,
	.rail-dot:focus-visible {
		color: var(--ink);
	}

	.rail-dot:hover .rail-label,
	.rail-dot:focus-visible .rail-label {
		opacity: 1;
		transform: none;
	}

	.rail-dot.on {
		color: var(--accent);
	}

	.rail-dot.on .rail-mark {
		width: 34px;
		opacity: 1;
	}

	.rail-dot.on .rail-label {
		opacity: 1;
		transform: none;
	}

	@media (max-width: 900px) {
		.rail {
			display: none;
		}
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

	/* The lit copy is stacked exactly on the base copy and masked to a moving
	   circle, so the accent colour reads as a light travelling over the name. */
	.name-stack {
		position: relative;
		margin: 1.25rem 0 0;
	}

	.name {
		margin: 0;
		font-size: clamp(3rem, 12vw, 9rem);
		line-height: 0.92;
		perspective: 500px;
	}

	.name-lit {
		--mx: 32%;
		--my: 50%;
		--lit-o: 1;
		position: absolute;
		inset: 0;
		color: var(--accent);
		opacity: var(--lit-o);
		pointer-events: none;
		-webkit-mask-image: radial-gradient(
			circle 190px at var(--mx) var(--my),
			#000 0%,
			rgba(0, 0, 0, 0.55) 45%,
			transparent 72%
		);
		mask-image: radial-gradient(
			circle 190px at var(--mx) var(--my),
			#000 0%,
			rgba(0, 0, 0, 0.55) 45%,
			transparent 72%
		);
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
		margin: 0 auto 2.5rem;
		max-width: 1100px;
	}

	.work-title {
		margin: 0.75rem 0 0;
		font-size: clamp(3rem, 11vw, 8rem);
		line-height: 0.9;
		color: transparent;
		-webkit-text-stroke: 1.5px rgba(var(--accent-rgb), 0.42);
	}

	.work-hint {
		margin: 0.5rem 0 0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		color: var(--muted);
	}

	.index {
		margin: 0 auto;
		max-width: 1100px;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--line);
	}

	.row {
		position: relative;
		border-bottom: 1px solid var(--line);
		overflow: hidden;
	}

	.row-marquee {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.35s ease;
	}

	.row.live .row-marquee {
		opacity: 1;
	}

	.row-track {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: 0.6rem;
		white-space: nowrap;
		font-family: 'Bagel Fat One', system-ui, sans-serif;
		font-size: clamp(2.4rem, 6vw, 4.2rem);
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px rgba(var(--accent-rgb), 0.13);
		will-change: transform;
	}

	.row-track .sep {
		-webkit-text-stroke: 1px rgba(var(--accent-rgb), 0.09);
	}

	.row-head {
		position: relative;
		z-index: 1;
		display: grid;
		width: 100%;
		align-items: center;
		gap: 1.25rem;
		grid-template-columns: auto minmax(0, 1fr) auto auto;
		border: 0;
		background: none;
		padding: 1.5rem 0.5rem;
		cursor: pointer;
		text-align: left;
		color: inherit;
		transition: padding-left 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.row.live .row-head {
		padding-left: 1.1rem;
	}

	.row-head:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -2px;
	}

	.row-num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.12em;
		color: var(--muted);
		transition: color 0.25s ease;
	}

	.row.live .row-num {
		color: var(--accent);
	}

	.row-title {
		font-size: clamp(1.15rem, 2.6vw, 1.65rem);
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.row-meta {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.row-period {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10.5px;
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
		white-space: nowrap;
	}

	.track-production {
		background: rgba(144, 212, 168, 0.13);
		color: #90d4a8;
	}

	.track-in-progress {
		background: rgba(240, 208, 140, 0.13);
		color: #f0d08c;
	}

	.track-lab,
	.track-archive {
		background: rgba(255, 255, 255, 0.06);
		color: var(--ink-2);
	}

	/* A plus that becomes a minus, drawn rather than typed. */
	.row-plus {
		position: relative;
		width: 14px;
		height: 14px;
	}

	.row-plus::before,
	.row-plus::after {
		position: absolute;
		top: 50%;
		left: 0;
		width: 14px;
		height: 1.5px;
		background: var(--accent);
		content: '';
		transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.row-plus::after {
		transform: rotate(90deg);
	}

	.row.open .row-plus::after {
		transform: rotate(0deg);
	}

	/* 0fr → 1fr animates the panel to its natural height with no JS. */
	.row-panel {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.row.open .row-panel {
		grid-template-rows: 1fr;
	}

	.row-panel-inner {
		display: grid;
		gap: 2rem;
		grid-template-columns: minmax(0, 1fr) auto;
		overflow: hidden;
		opacity: 0;
		transition: opacity 0.3s ease 0.1s;
	}

	.row.open .row-panel-inner {
		opacity: 1;
	}

	.panel-copy {
		padding: 0 0.5rem 2rem;
	}

	.panel-role {
		margin: 0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10.5px;
		color: var(--muted);
	}

	.panel-summary {
		margin: 0.75rem 0 0;
		max-width: 62ch;
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--ink-2);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 1.25rem;
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

	.metrics {
		display: flex;
		gap: 1.75rem;
		align-self: start;
		padding: 0 0.5rem 2rem;
	}

	.metrics div {
		display: flex;
		flex-direction: column;
	}

	.m-value {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.5rem;
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

	@media (max-width: 760px) {
		.row-head {
			grid-template-columns: auto minmax(0, 1fr) auto;
			row-gap: 0.5rem;
		}

		.row-meta {
			grid-column: 2 / 4;
		}

		.row-panel-inner {
			grid-template-columns: minmax(0, 1fr);
		}

		.metrics {
			padding-top: 0;
		}
	}

	/* ── Case study ── */
	.case {
		display: grid;
		gap: 3rem;
		margin: 0 auto;
		max-width: 1100px;
		grid-template-columns: 210px minmax(0, 1fr);
		border-top: 1px solid var(--line);
		padding: 7rem 1.5rem;
	}

	.contents-sticky {
		position: sticky;
		top: 6rem;
	}

	.contents-title {
		margin: 0.6rem 0 1rem;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.4;
	}

	.progress {
		height: 2px;
		width: 100%;
		overflow: hidden;
		border-radius: 2px;
		background: var(--line);
	}

	.progress span {
		display: block;
		height: 100%;
		width: 100%;
		transform-origin: left;
		transform: scaleX(0);
		background: var(--accent);
	}

	.chapter-list {
		margin: 1.1rem 0 0;
		padding: 0;
		list-style: none;
		counter-reset: chapter;
	}

	.chapter-list li {
		counter-increment: chapter;
	}

	.chapter-list button {
		display: block;
		width: 100%;
		border: 0;
		border-left: 1px solid var(--line);
		background: none;
		padding: 0.4rem 0 0.4rem 0.75rem;
		cursor: pointer;
		text-align: left;
		font-size: 12px;
		line-height: 1.45;
		color: var(--muted);
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.chapter-list button::before {
		content: counter(chapter, decimal-leading-zero) ' ';
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		opacity: 0.7;
	}

	.chapter-list button:hover,
	.chapter-list button:focus-visible {
		color: var(--ink-2);
	}

	.chapter-list button.on {
		border-color: var(--accent);
		color: var(--accent);
	}

	.case-body {
		max-width: 680px;
	}

	.case-title {
		margin: 0 0 2.5rem;
		font-size: clamp(2rem, 6vw, 3.4rem);
		line-height: 1.02;
	}

	@media (max-width: 900px) {
		.case {
			grid-template-columns: minmax(0, 1fr);
		}

		.contents {
			display: none;
		}
	}

	.prose :global(h2) {
		margin: 2.75rem 0 0.9rem;
		font-size: 1.2rem;
		font-weight: 700;
		scroll-margin-top: 5rem;
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
		display: flex;
		flex-wrap: wrap;
		margin: 0 auto;
		max-width: 1100px;
		font-size: clamp(3rem, 15vw, 11rem);
		line-height: 0.86;
		color: var(--ground);
		text-decoration: none;
	}

	.cta-letter {
		display: inline-block;
		will-change: transform;
	}

	.cta-space {
		display: inline-block;
		width: 0.32em;
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
		position: relative;
		color: rgba(7, 8, 6, 0.72);
		text-decoration: none;
	}

	.cta-links a::after {
		position: absolute;
		bottom: -3px;
		left: 0;
		height: 1px;
		width: 100%;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
		content: '';
	}

	.cta-links a:hover,
	.cta-links a:focus-visible {
		color: var(--ground);
	}

	.cta-links a:hover::after,
	.cta-links a:focus-visible::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	@media (prefers-reduced-motion: reduce) {
		.row-marquee {
			display: none;
		}

		.row-panel,
		.row-panel-inner,
		.rail-mark,
		.rail-label,
		.row-head,
		.cta-links a::after {
			transition: none;
		}
	}
</style>
