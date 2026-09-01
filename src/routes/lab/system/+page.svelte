<script lang="ts">
	/**
	 * The design system, as it actually is.
	 *
	 * Every value here is read from the live stylesheet rather than written into
	 * this page. A style guide that restates its tokens by hand is a second
	 * source of truth and starts drifting the day after it is written; this one
	 * cannot be wrong about the CSS because it asks the CSS.
	 */
	const TYPE = [
		'--text-2xs',
		'--text-xs',
		'--text-sm',
		'--text-md',
		'--text-base',
		'--text-lg',
		'--text-xl',
		'--text-2xl',
		'--text-3xl',
		'--text-4xl',
		'--text-5xl',
		'--text-6xl'
	];
	const DISPLAY = ['--display-sm', '--display-md', '--display-lg', '--display-xl'];
	const SPACE = [
		'--space-1',
		'--space-2',
		'--space-3',
		'--space-4',
		'--space-5',
		'--space-6',
		'--space-7',
		'--space-8',
		'--space-9'
	];
	const RADII = [
		'--radius-xs',
		'--radius-sm',
		'--radius-md',
		'--radius-lg',
		'--radius-xl',
		'--radius-pill'
	];
	const SURFACES = ['--color-bg', '--color-bg-secondary', '--color-bg-tertiary'];
	const INK = ['--color-text', '--color-text-secondary', '--color-text-muted'];
	const LINES = ['--color-border', '--color-border-subtle'];
	const ACCENTS = [
		'--color-accent',
		'--color-accent-text',
		'--color-ongoing-text',
		'--color-completed-text'
	];

	let resolved = $state<Record<string, string>>({});

	$effect(() => {
		const styles = getComputedStyle(document.documentElement);
		const out: Record<string, string> = {};
		for (const name of [
			...TYPE,
			...DISPLAY,
			...SPACE,
			...RADII,
			...SURFACES,
			...INK,
			...LINES,
			...ACCENTS
		]) {
			out[name] = styles.getPropertyValue(name).trim();
		}
		resolved = out;
	});

	/** Computed size in px, so a rem token can be checked against the floors. */
	function px(value: string): string {
		if (!value || value.startsWith('clamp')) return '';
		const n = parseFloat(value);
		if (Number.isNaN(n)) return '';
		return value.endsWith('rem') ? `${Math.round(n * 16 * 10) / 10}px` : value;
	}
</script>

<svelte:head>
	<title>Design system</title>
</svelte:head>

<div class="system">
	<header class="head">
		<p class="ds-eyebrow">Reference · not indexed</p>
		<h1>Design system</h1>
		<p class="intro">
			Every value below is read from the live stylesheet at runtime. If this page and
			<code>layout.css</code> ever disagree, this page is wrong and the CSS is right — which is the only
			arrangement that survives six months.
		</p>
		<p class="intro">
			Switch the theme with the toggle to check both. The floors from
			<code>GUIDELINE.md</code> still hold: <code>--text-sm</code> is the smallest sentence-case
			size,
			<code>--text-2xs</code> is for tracked uppercase mono only.
		</p>
	</header>

	<!-- ═══ TYPE ═══ -->
	<section>
		<h2>Type</h2>
		<p class="note">
			Fixed steps. An audit found 45 distinct font sizes across the site, eight of them inside a
			quarter-rem — these are drawn from what was already in use, so snapping to them is a tidy-up
			rather than a redesign.
		</p>
		<ul class="rows">
			{#each TYPE as token (token)}
				<li>
					<code class="token">{token}</code>
					<span class="value">{resolved[token] ?? '—'} <i>{px(resolved[token] ?? '')}</i></span>
					<span class="sample" style="font-size: var({token})">
						Engineering judgement is demonstrable
					</span>
				</li>
			{/each}
		</ul>

		<h3>Display</h3>
		<p class="note">Fluid on purpose — these scale with the viewport rather than stepping.</p>
		<ul class="rows display-rows">
			{#each DISPLAY as token (token)}
				<li>
					<code class="token">{token}</code>
					<span class="value">{resolved[token] ?? '—'}</span>
					<span class="sample display" style="font-size: var({token})">Work</span>
				</li>
			{/each}
		</ul>
	</section>

	<!-- ═══ COLOUR ═══ -->
	<section>
		<h2>Colour</h2>
		<p class="note">
			Every pair is asserted at build time by <code>bun run check:contrast</code>, including badge
			text over its own composited pill. Nothing here is eyeballed.
		</p>

		{#each [{ label: 'Surfaces', tokens: SURFACES }, { label: 'Ink', tokens: INK }, { label: 'Lines', tokens: LINES }, { label: 'Accents', tokens: ACCENTS }] as group (group.label)}
			<h3>{group.label}</h3>
			<ul class="swatches">
				{#each group.tokens as token (token)}
					<li>
						<span class="chip-colour" style="background: var({token})"></span>
						<code class="token">{token}</code>
						<span class="value">{resolved[token] ?? '—'}</span>
					</li>
				{/each}
			</ul>
		{/each}
	</section>

	<!-- ═══ SPACE ═══ -->
	<section>
		<h2>Spacing</h2>
		<ul class="rows">
			{#each SPACE as token (token)}
				<li>
					<code class="token">{token}</code>
					<span class="value">{resolved[token] ?? '—'} <i>{px(resolved[token] ?? '')}</i></span>
					<span class="bar" style="width: var({token})"></span>
				</li>
			{/each}
		</ul>
	</section>

	<!-- ═══ RADII ═══ -->
	<section>
		<h2>Radii</h2>
		<ul class="radii">
			{#each RADII as token (token)}
				<li>
					<span class="radius-demo" style="border-radius: var({token})"></span>
					<code class="token">{token}</code>
					<span class="value">{resolved[token] ?? '—'}</span>
				</li>
			{/each}
		</ul>
	</section>

	<!-- ═══ PRIMITIVES ═══ -->
	<section>
		<h2>Primitives</h2>
		<p class="note">
			The three patterns every section was re-declaring. Global classes rather than components,
			because they carry no behaviour — a component per class buys an import and a wrapper element
			for nothing.
		</p>

		<h3><code>.ds-eyebrow</code></h3>
		<div class="demo">
			<span class="ds-eyebrow">Selected work</span>
			<span class="ds-eyebrow ds-eyebrow-muted">4 min read</span>
		</div>

		<h3><code>.ds-pill</code></h3>
		<div class="demo">
			<span class="ds-pill">Microsoft Fabric</span>
			<span class="ds-pill">.NET 8</span>
			<span class="ds-pill">PostgreSQL</span>
			<span class="ds-pill">+4</span>
		</div>

		<h3><code>.ds-card</code></h3>
		<div class="demo demo-block">
			<div class="ds-card">
				<span class="ds-eyebrow">Default</span>
				<p class="demo-copy">Surface background, full border, extra-large radius.</p>
			</div>
			<a href="#top" class="ds-card ds-card-quiet ds-card-link">
				<span class="ds-eyebrow">Quiet, and a link</span>
				<p class="demo-copy">Transparent, subtle border, accent on hover and focus.</p>
			</a>
		</div>
	</section>

	<!-- ═══ MOTION ═══ -->
	<section>
		<h2>Motion</h2>
		<p class="note">
			One easing and three durations. More than that is indecision, and every extra curve is another
			thing two sections can disagree about.
		</p>
		<ul class="rows">
			{#each ['--duration-fast', '--duration-base', '--duration-slow'] as token (token)}
				<li>
					<code class="token">{token}</code>
					<span class="value"
						>{token === '--duration-fast'
							? '0.2s'
							: token === '--duration-base'
								? '0.3s'
								: '0.6s'}</span
					>
					<span class="motion-demo" style="transition-duration: var({token})"></span>
				</li>
			{/each}
		</ul>
		<p class="note">Hover a bar to see its duration. All of it is skipped under reduced motion.</p>
	</section>
</div>

<style>
	.system {
		max-width: 60rem;
		margin-inline: auto;
		padding: var(--space-9) var(--space-5) var(--space-9);
		background: var(--color-bg);
		color: var(--color-text);
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		border-bottom: 1px solid var(--color-border-subtle);
		padding-bottom: var(--space-6);
	}

	h1 {
		margin: 0;
		font-family: 'Bagel Fat One', sans-serif;
		font-size: var(--display-md);
		line-height: 1;
		color: var(--color-accent);
	}

	.intro {
		margin: 0;
		max-width: var(--measure-prose);
		font-size: var(--text-lg);
		line-height: var(--leading-body);
		color: var(--color-text-secondary);
	}

	section {
		margin-top: var(--space-8);
	}

	h2 {
		margin: 0 0 var(--space-3);
		font-size: var(--text-3xl);
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	h3 {
		margin: var(--space-6) 0 var(--space-3);
		font-size: var(--text-xl);
		font-weight: 600;
	}

	.note {
		margin: 0 0 var(--space-5);
		max-width: var(--measure-prose);
		font-size: var(--text-base);
		line-height: var(--leading-body);
		color: var(--color-text-muted);
	}

	code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		color: var(--color-accent-text);
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rows li {
		display: grid;
		align-items: center;
		gap: var(--space-4);
		grid-template-columns: 9rem 8rem minmax(0, 1fr);
		border-top: 1px solid var(--color-border-subtle);
		padding: var(--space-3) 0;
	}

	.rows li:last-child {
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.token {
		font-size: var(--text-md);
	}

	.value {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}

	.value i {
		font-style: normal;
		opacity: 0.7;
	}

	.sample {
		line-height: var(--leading-tight);
		color: var(--color-text);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.display-rows li {
		align-items: baseline;
	}

	.sample.display {
		font-family: 'Bagel Fat One', sans-serif;
		line-height: 1;
		color: var(--color-accent);
	}

	.swatches {
		display: grid;
		gap: var(--space-2);
		grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.swatches li {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-2) var(--space-3);
	}

	.chip-colour {
		width: 2rem;
		height: 2rem;
		flex: 0 0 auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}

	.bar {
		height: 0.75rem;
		border-radius: var(--radius-xs);
		background: var(--color-accent);
	}

	.radii {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-5);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.radii li {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.radius-demo {
		width: 5rem;
		height: 3.5rem;
		border: 1px solid var(--color-accent);
		background: var(--color-bg-secondary);
	}

	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
	}

	.demo-block {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		align-items: stretch;
	}

	.demo-copy {
		margin: var(--space-2) 0 0;
		font-size: var(--text-base);
		line-height: var(--leading-body);
		color: var(--color-text-secondary);
	}

	.motion-demo {
		height: 0.75rem;
		width: 3rem;
		border-radius: var(--radius-xs);
		background: var(--color-accent);
		transition-property: width;
		transition-timing-function: var(--ease);
	}

	.rows li:hover .motion-demo {
		width: 100%;
	}

	@media (prefers-reduced-motion: reduce) {
		.motion-demo {
			transition: none;
		}
	}

	@media (max-width: 640px) {
		.rows li {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--space-1);
		}
	}
</style>
