<script lang="ts">
	import { sample, pipelineStages, capabilities } from '../sample';
	import { gsap } from '$lib/utils/gsap';

	let root: HTMLElement | undefined = $state();

	$effect(() => {
		if (!root) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(root.querySelectorAll('.fade'), { opacity: 1, y: 0 });
			gsap.set(root.querySelectorAll('.flow'), { opacity: 1 });
			return;
		}
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
			tl.from('.fade', { opacity: 0, y: 14, stagger: 0.05, duration: 0.5 });
			// Trace the pipeline left to right — the diagram is the hero.
			tl.from('.stage', { opacity: 0, x: -14, stagger: 0.09, duration: 0.45 }, '-=0.2');
			tl.from('.flow', { scaleX: 0, transformOrigin: 'left', stagger: 0.09, duration: 0.35 }, '<');

			root!.querySelectorAll('.on-scroll').forEach((el) => {
				gsap.from(el, {
					opacity: 0,
					y: 18,
					duration: 0.5,
					scrollTrigger: { trigger: el, start: 'top 90%', once: true }
				});
			});
		}, root);
		return () => ctx.revert();
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
		<span class="mono loc">{sample.location}</span>
	</header>

	<!-- ═══ HERO: the pipeline is the visual ═══ -->
	<section class="hero">
		<div class="wrap">
			<h1 class="fade">{sample.title}</h1>
			<p class="fade sub">{sample.summary}</p>

			<div class="pipeline" role="img" aria-label="Data pipeline: source systems to reporting">
				{#each pipelineStages as stage, i (stage.id)}
					<div class="stage">
						<span class="stage-idx mono">{String(i + 1).padStart(2, '0')}</span>
						<span class="stage-label">{stage.label}</span>
						<span class="stage-detail mono">{stage.detail}</span>
					</div>
					{#if i < pipelineStages.length - 1}
						<div class="flow" aria-hidden="true"></div>
					{/if}
				{/each}
			</div>

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
			<h2 class="mono heading">Systems built</h2>

			<table class="records">
				<thead>
					<tr>
						<th scope="col" class="mono">#</th>
						<th scope="col" class="mono">System</th>
						<th scope="col" class="mono">Role</th>
						<th scope="col" class="mono">Stack</th>
						<th scope="col" class="mono num">Signal</th>
					</tr>
				</thead>
				<tbody>
					{#each sample.projects as project, i (project.slug)}
						<tr class="on-scroll">
							<td class="mono dim">{String(i + 1).padStart(2, '0')}</td>
							<td>
								<span class="sys-name">{project.title}</span>
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
									{/each}
								{:else}
									<span class="mono dim">—</span>
								{/if}
							</td>
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
</style>
