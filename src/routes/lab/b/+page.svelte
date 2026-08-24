<script lang="ts">
	import { sample, pipelineStages, capabilities } from '../sample';
	import { gsap } from '$lib/utils/gsap';
	import { parseMetric } from '$lib/utils/metric';

	type SortKey = 'index' | 'system' | 'signal';

	let root: HTMLElement | undefined = $state();
	let query = $state('');
	let sortKey: SortKey = $state('index');
	let sortDesc = $state(false);
	let activeStage = $state(pipelineStages[0].id);
	let expanded = $state<string | null>(null);
	let clock = $state('');

	const stageDetail = $derived(
		pipelineStages.find((s) => s.id === activeStage) ?? pipelineStages[0]
	);

	/** Highest numeric metric on a project, used as the sortable "signal". */
	function signalOf(project: (typeof sample.projects)[number]): number {
		const values = project.metrics
			.map((m) => parseMetric(m.value))
			.filter((m) => !m.literal)
			.map((m) => Math.abs(m.value));
		return values.length ? Math.max(...values) : -1;
	}

	const rows = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const matched = sample.projects
			.map((project, index) => ({ project, index }))
			.filter(({ project }) => {
				if (!q) return true;
				const haystack = [
					project.title,
					project.summary,
					project.role,
					...project.stack,
					...project.domains
				]
					.join(' ')
					.toLowerCase();
				return haystack.includes(q);
			});

		const sorted = [...matched].sort((a, b) => {
			if (sortKey === 'system') return a.project.title.localeCompare(b.project.title);
			if (sortKey === 'signal') return signalOf(b.project) - signalOf(a.project);
			return a.index - b.index;
		});
		return sortDesc ? sorted.reverse() : sorted;
	});

	function toggleSort(key: SortKey) {
		if (sortKey === key) {
			sortDesc = !sortDesc;
		} else {
			sortKey = key;
			sortDesc = false;
		}
	}

	function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
		if (sortKey !== key) return 'none';
		return sortDesc ? 'descending' : 'ascending';
	}

	function toggleRow(slug: string) {
		expanded = expanded === slug ? null : slug;
	}

	$effect(() => {
		if (!root) return;

		// A console shows the time. Local to the author, refreshed every second.
		const tick = () => {
			clock = new Intl.DateTimeFormat('en-GB', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				timeZone: 'Europe/Istanbul'
			}).format(new Date());
		};
		tick();
		const clockId = setInterval(tick, 1000);

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			gsap.set(root.querySelectorAll('.fade'), { opacity: 1, y: 0 });
			gsap.set(root.querySelectorAll('.flow'), { opacity: 1 });
			return () => clearInterval(clockId);
		}

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
			tl.from('.fade', { opacity: 0, y: 14, stagger: 0.05, duration: 0.5 });
			// Trace the pipeline left to right — the diagram is the hero.
			tl.from('.stage', { opacity: 0, x: -14, stagger: 0.09, duration: 0.45 }, '-=0.2');
			tl.from('.flow', { scaleX: 0, transformOrigin: 'left', stagger: 0.09, duration: 0.35 }, '<');

			// Packets crossing the connectors. Decorative, but it makes the
			// diagram read as something running rather than something drawn.
			gsap.set('.packet', { opacity: 0 });
			gsap.to('.packet', {
				keyframes: {
					xPercent: [0, 600],
					opacity: [0, 1, 1, 0],
					easeEach: 'none'
				},
				duration: 1.5,
				repeat: -1,
				repeatDelay: 0.8,
				stagger: 0.3
			});

			root!.querySelectorAll('.on-scroll').forEach((el) => {
				gsap.from(el, {
					opacity: 0,
					y: 18,
					duration: 0.5,
					scrollTrigger: { trigger: el, start: 'top 90%', once: true }
				});
			});
		}, root);

		return () => {
			clearInterval(clockId);
			ctx.revert();
		};
	});
</script>

<svelte:head>
	<title>Direction B — Systems</title>
</svelte:head>

<div bind:this={root} class="dir-b">
	<!-- ═══ HEADER ═══ -->
	<header class="bar">
		<span class="mono id">{sample.name}</span>
		<span class="mono role">{sample.title}</span>
		<span class="mono loc">
			{sample.location}
			<span class="clock" aria-hidden="true">{clock}</span>
		</span>
	</header>

	<!-- ═══ HERO: the pipeline is the visual ═══ -->
	<section class="hero">
		<div class="wrap">
			<h1 class="fade">{sample.title}</h1>
			<p class="fade sub">{sample.summary}</p>

			<div class="pipeline">
				{#each pipelineStages as stage, i (stage.id)}
					<button
						class="stage"
						class:on={activeStage === stage.id}
						aria-pressed={activeStage === stage.id}
						onclick={() => (activeStage = stage.id)}
						onmouseenter={() => (activeStage = stage.id)}
						onfocus={() => (activeStage = stage.id)}
					>
						<span class="stage-idx mono">{String(i + 1).padStart(2, '0')}</span>
						<span class="stage-label">{stage.label}</span>
						<span class="stage-detail mono">{stage.detail}</span>
					</button>
					{#if i < pipelineStages.length - 1}
						<div class="flow" aria-hidden="true"><i class="packet"></i></div>
					{/if}
				{/each}
			</div>

			<!-- What the selected stage actually involves. -->
			<p class="stage-note">
				<span class="mono stage-note-key">{stageDetail.label}</span>
				{stageDetail.note}
			</p>

			<dl class="capstrip fade">
				{#each capabilities as group (group.label)}
					<div>
						<dt class="mono">{group.label}</dt>
						<dd>{group.items.join(' / ')}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</section>

	<!-- ═══ WORK: records, not cards ═══ -->
	<section class="work">
		<div class="wrap">
			<div class="work-bar">
				<h2 class="mono heading">Systems built</h2>
				<div class="query">
					<label class="sr-only" for="filter">Filter systems</label>
					<span class="mono prompt" aria-hidden="true">where</span>
					<input
						id="filter"
						class="mono"
						type="search"
						placeholder="stack, domain or name"
						bind:value={query}
						autocomplete="off"
					/>
					<span class="mono count" aria-live="polite">
						{rows.length}/{sample.projects.length}
					</span>
				</div>
			</div>

			<table class="records">
				<thead>
					<tr>
						<th scope="col" class="mono">#</th>
						<th scope="col" class="mono" aria-sort={ariaSort('system')}>
							<button class="mono sort" onclick={() => toggleSort('system')}>
								System<span class="caret" aria-hidden="true"
									>{sortKey === 'system' ? (sortDesc ? '▾' : '▴') : '·'}</span
								>
							</button>
						</th>
						<th scope="col" class="mono">Role</th>
						<th scope="col" class="mono">Stack</th>
						<th scope="col" class="mono num" aria-sort={ariaSort('signal')}>
							<button class="mono sort" onclick={() => toggleSort('signal')}>
								Signal<span class="caret" aria-hidden="true"
									>{sortKey === 'signal' ? (sortDesc ? '▾' : '▴') : '·'}</span
								>
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as { project, index } (project.slug)}
						<tr class="on-scroll record" class:open={expanded === project.slug}>
							<td class="mono dim">{String(index + 1).padStart(2, '0')}</td>
							<td>
								<button
									class="sys-toggle"
									aria-expanded={expanded === project.slug}
									onclick={() => toggleRow(project.slug)}
								>
									<span class="sys-name">{project.title}</span>
									<span class="sys-caret mono" aria-hidden="true">›</span>
								</button>
								<span class="sys-sum">{project.summary}</span>
								<span class="state mono state-{project.track}">
									{project.progress ?? project.track.replace('-', ' ')}
								</span>
							</td>
							<td class="mono dim role-cell">{project.role}</td>
							<td class="stack-cell">
								{#each project.stack.slice(0, 5) as tech (tech)}
									<span class="mono tag">{tech}</span>
								{/each}
							</td>
							<td class="num">
								{#if project.metrics.length}
									{#each project.metrics.slice(0, 2) as metric (metric.label)}
										<div class="metric">
											<span class="mv mono">{metric.value}</span>
											<span class="ml mono">{metric.label}</span>
										</div>
									{:else}
										<span class="mono dim">—</span>
									{/each}
								{:else}
									<span class="mono dim">—</span>
								{/if}
							</td>
						</tr>
						{#if expanded === project.slug}
							<tr class="detail-row">
								<td colspan="5">
									<div class="detail">
										<dl>
											<div>
												<dt class="mono">period</dt>
												<dd class="mono">{project.period}</dd>
											</div>
											<div>
												<dt class="mono">domains</dt>
												<dd class="mono">{project.domains.join(', ') || '—'}</dd>
											</div>
											<div>
												<dt class="mono">stack</dt>
												<dd class="mono">{project.stack.join(', ')}</dd>
											</div>
											{#if project.links.github}
												<div>
													<dt class="mono">source</dt>
													<dd class="mono">
														<a href={project.links.github}>{project.links.github}</a>
													</dd>
												</div>
											{/if}
										</dl>
									</div>
								</td>
							</tr>
						{/if}
					{:else}
						<tr>
							<td colspan="5" class="mono dim empty">no rows match “{query}”</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- ═══ CASE STUDY ═══ -->
	{#if sample.caseStudy}
		{@const Body = sample.caseStudy.body}
		<section class="case on-scroll">
			<div class="wrap narrow">
				<h2 class="mono heading">Case study — {sample.caseStudy.meta.title}</h2>
				<div class="prose"><Body /></div>
			</div>
		</section>
	{/if}

	<!-- ═══ FOOTER ═══ -->
	<footer class="foot">
		<div class="wrap foot-inner">
			<a href="mailto:{sample.email}" class="mail">{sample.email}</a>
			<div class="foot-links mono">
				<a href={sample.github}>github</a>
				<a href={sample.linkedin}>linkedin</a>
				<a href="/cv">cv</a>
			</div>
		</div>
	</footer>
</div>

<style>
	.dir-b {
		--ground: #0a0c0a;
		--panel: #101310;
		--line: #1c211b;
		--ink: #e6ebe3;
		--ink-2: #a3ab9e;
		--dim: #6d756a;
		--accent: #a9cf9f;
		--data-2: #7fb3c8;
		--data-3: #d6a95f;

		background: var(--ground);
		color: var(--ink);
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 15px;
	}

	.mono {
		font-family: 'JetBrains Mono', ui-monospace, monospace;
	}

	.wrap {
		margin: 0 auto;
		width: 100%;
		max-width: 1080px;
		padding-inline: 1.5rem;
	}

	.wrap.narrow {
		max-width: 720px;
	}

	/* ── Instrument bar ── */
	.bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		border-bottom: 1px solid var(--line);
		padding: 0.85rem 1.5rem;
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.bar .id {
		color: var(--ink);
		font-weight: 600;
	}

	.bar .role {
		color: var(--accent);
	}

	.bar .loc {
		margin-left: auto;
		color: var(--dim);
	}

	/* ── Hero ── */
	.hero {
		padding: 5.5rem 0 4.5rem;
	}

	h1 {
		margin: 0;
		max-width: 22ch;
		font-size: clamp(1.9rem, 4.6vw, 3.1rem);
		font-weight: 600;
		line-height: 1.12;
		letter-spacing: -0.025em;
	}

	.sub {
		margin: 1.4rem 0 0;
		max-width: 66ch;
		line-height: 1.72;
		color: var(--ink-2);
	}

	/* ── Pipeline diagram ── */
	.pipeline {
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		gap: 0;
		margin: 3.5rem 0 0;
		border: 1px solid var(--line);
		border-radius: 10px;
		background: var(--panel);
		padding: 1.4rem 1.2rem;
	}

	.stage {
		display: flex;
		min-width: 130px;
		flex: 1;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.4rem 0.7rem;
	}

	.stage-idx {
		font-size: 9px;
		letter-spacing: 0.16em;
		color: var(--accent);
	}

	.stage-label {
		font-size: 13.5px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.stage-detail {
		font-size: 10px;
		line-height: 1.5;
		color: var(--dim);
	}

	.flow {
		align-self: center;
		width: 26px;
		height: 1px;
		flex-shrink: 0;
		background: linear-gradient(90deg, var(--accent), rgba(169, 207, 159, 0.25));
		position: relative;
	}

	.flow::after {
		content: '';
		position: absolute;
		top: -2.5px;
		right: 0;
		width: 5px;
		height: 5px;
		border-top: 1px solid var(--accent);
		border-right: 1px solid var(--accent);
		transform: rotate(45deg);
	}

	/* ── Capability strip ── */
	.capstrip {
		display: grid;
		gap: 1.5rem;
		margin: 2.5rem 0 0;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
	}

	.capstrip dt {
		font-size: 9.5px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.capstrip dd {
		margin: 0.4rem 0 0;
		font-size: 13px;
		line-height: 1.6;
		color: var(--ink-2);
	}

	/* ── Records table ── */
	.work {
		border-top: 1px solid var(--line);
		padding: 4.5rem 0;
	}

	.heading {
		margin: 0 0 2rem;
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.records {
		width: 100%;
		border-collapse: collapse;
		font-size: 13.5px;
	}

	.records th {
		border-bottom: 1px solid var(--line);
		padding: 0 0.9rem 0.7rem;
		text-align: left;
		font-size: 9.5px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--dim);
	}

	.records th:first-child,
	.records td:first-child {
		padding-left: 0;
	}

	.records td {
		border-bottom: 1px solid var(--line);
		padding: 1.35rem 0.9rem;
		vertical-align: top;
	}

	.dim {
		color: var(--dim);
	}

	.sys-name {
		display: block;
		font-size: 15.5px;
		font-weight: 600;
		letter-spacing: -0.012em;
	}

	.sys-sum {
		display: block;
		margin-top: 0.35rem;
		max-width: 46ch;
		font-size: 12.5px;
		line-height: 1.62;
		color: var(--ink-2);
	}

	.state {
		display: inline-block;
		margin-top: 0.6rem;
		border-radius: 3px;
		padding: 0.15rem 0.4rem;
		font-size: 8.5px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.state-production {
		background: rgba(169, 207, 159, 0.14);
		color: var(--accent);
	}

	.state-in-progress {
		background: rgba(214, 169, 95, 0.14);
		color: var(--data-3);
	}

	.role-cell {
		max-width: 16ch;
		font-size: 10.5px;
		line-height: 1.55;
	}

	.stack-cell {
		max-width: 15ch;
	}

	.tag {
		display: inline-block;
		margin: 0 0.25rem 0.25rem 0;
		border: 1px solid var(--line);
		border-radius: 3px;
		padding: 0.12rem 0.35rem;
		font-size: 9.5px;
		color: var(--ink-2);
	}

	.num {
		text-align: right;
	}

	.metric {
		margin-bottom: 0.55rem;
	}

	.mv {
		display: block;
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--data-2);
		font-variant-numeric: tabular-nums;
	}

	.ml {
		display: block;
		font-size: 8.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--dim);
	}

	@media (max-width: 760px) {
		.records thead,
		.role-cell,
		.stack-cell {
			display: none;
		}

		.records td {
			display: block;
			border: none;
			padding: 0.15rem 0;
		}

		.records tr {
			display: block;
			border-bottom: 1px solid var(--line);
			padding: 1.3rem 0;
		}

		.num {
			text-align: left;
		}

		.metric {
			display: inline-block;
			margin-right: 1.5rem;
			margin-top: 0.7rem;
		}
	}

	/* ── Case study ── */
	.case {
		border-top: 1px solid var(--line);
		padding: 4.5rem 0;
	}

	.prose :global(h2) {
		margin: 2.5rem 0 0.8rem;
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.prose :global(h2:first-child) {
		margin-top: 0;
	}

	.prose :global(p) {
		margin-bottom: 1rem;
		font-size: 14.5px;
		line-height: 1.78;
		color: var(--ink-2);
	}

	.prose :global(ul) {
		margin: 0 0 1.3rem;
		padding-left: 0;
		list-style: none;
		border-left: 1px solid var(--line);
	}

	.prose :global(li) {
		margin-bottom: 0.3rem;
		padding: 0.25rem 0 0.25rem 1rem;
		font-size: 13.5px;
		line-height: 1.6;
		color: var(--ink-2);
	}

	.prose :global(li strong) {
		color: var(--accent);
		font-weight: 600;
	}

	.prose :global(strong) {
		color: var(--ink);
		font-weight: 600;
	}

	/* ── Footer ── */
	.foot {
		border-top: 1px solid var(--line);
		padding: 3rem 0;
	}

	.foot-inner {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.mail {
		font-size: clamp(1.2rem, 4vw, 2rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--ink);
		text-decoration: none;
	}

	.mail:hover {
		color: var(--accent);
	}

	.foot-links {
		display: flex;
		gap: 1.25rem;
		font-size: 11px;
		letter-spacing: 0.1em;
	}

	.foot-links a {
		color: var(--dim);
		text-decoration: none;
	}

	.foot-links a:hover {
		color: var(--accent);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.clock {
		margin-left: 0.75rem;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}

	/* ── Interactive pipeline ── */
	.stage {
		border: 0;
		border-radius: 6px;
		background: none;
		font-family: inherit;
		text-align: left;
		cursor: pointer;
		color: inherit;
		transition:
			background-color 0.2s ease,
			opacity 0.2s ease;
	}

	.pipeline:hover .stage:not(.on),
	.pipeline:focus-within .stage:not(.on) {
		opacity: 0.55;
	}

	.stage.on {
		background: rgba(169, 207, 159, 0.07);
		opacity: 1;
	}

	.stage:focus-visible {
		outline: 1px solid var(--accent);
		outline-offset: 1px;
	}

	.packet {
		position: absolute;
		top: -1.5px;
		left: 0;
		display: block;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 6px rgba(169, 207, 159, 0.8);
	}

	.stage-note {
		margin: 1.1rem 0 0;
		max-width: 76ch;
		font-size: 13px;
		line-height: 1.7;
		color: var(--ink-2);
	}

	.stage-note-key {
		margin-right: 0.5rem;
		font-size: 9.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
	}

	/* ── Query bar ── */
	.work-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.query {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 1px solid var(--line);
		border-radius: 6px;
		background: var(--panel);
		padding: 0.4rem 0.7rem;
		margin-bottom: 2rem;
	}

	.query:focus-within {
		border-color: rgba(169, 207, 159, 0.45);
	}

	.prompt {
		font-size: 9.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.query input {
		width: 20ch;
		border: 0;
		background: none;
		font-size: 12px;
		color: var(--ink);
	}

	.query input::placeholder {
		color: var(--dim);
	}

	.query input:focus {
		outline: none;
	}

	.count {
		font-size: 10px;
		color: var(--dim);
		font-variant-numeric: tabular-nums;
	}

	/* ── Sortable headers ── */
	.sort {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		border: 0;
		background: none;
		padding: 0;
		cursor: pointer;
		font-size: inherit;
		font-weight: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		color: inherit;
	}

	.sort:hover,
	.sort:focus-visible {
		color: var(--accent);
	}

	.caret {
		font-size: 9px;
		opacity: 0.8;
	}

	/* ── Expandable records ── */
	.sys-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 0;
		background: none;
		padding: 0;
		cursor: pointer;
		text-align: left;
		color: inherit;
	}

	.sys-caret {
		font-size: 12px;
		color: var(--dim);
		transition: transform 0.25s ease;
	}

	.record.open .sys-caret {
		transform: rotate(90deg);
		color: var(--accent);
	}

	.sys-toggle:hover .sys-name,
	.sys-toggle:focus-visible .sys-name {
		color: var(--accent);
	}

	.detail-row td {
		border-bottom: 1px solid var(--line);
		padding: 0 0 1.4rem;
	}

	.detail dl {
		display: grid;
		gap: 0.55rem 2rem;
		margin: 0;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		border-left: 1px solid rgba(169, 207, 159, 0.35);
		padding: 0.35rem 0 0.35rem 1rem;
	}

	.detail dt {
		font-size: 9px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.detail dd {
		margin: 0.2rem 0 0;
		font-size: 11px;
		line-height: 1.6;
		color: var(--ink-2);
		overflow-wrap: anywhere;
	}

	.detail a {
		color: var(--data-2);
	}

	.empty {
		padding: 2rem 0;
		font-size: 12px;
	}

	@media (prefers-reduced-motion: reduce) {
		.sys-caret,
		.stage {
			transition: none;
		}
	}
</style>
