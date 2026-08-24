<script lang="ts">
	import { personal } from '$lib/data/personal';
	import TrackBadge from '$lib/components/ui/TrackBadge.svelte';
	import type { ProjectTrack } from '$lib/types/content';

	let { data } = $props();

	const TRACK_ORDER: ProjectTrack[] = ['production', 'in-progress', 'lab', 'archive'];
	const TRACK_LABELS: Record<ProjectTrack, string> = {
		production: 'Production',
		'in-progress': 'In development',
		lab: 'Lab',
		archive: 'Archive'
	};

	let activeTrack = $state<ProjectTrack | 'all'>('all');
	let activeStack = $state<string | 'all'>('all');

	const tracks = $derived(TRACK_ORDER.filter((t) => data.projects.some((p) => p.track === t)));

	// Only offer stack filters that would actually narrow the list.
	const stacks = $derived(
		[...new Set(data.projects.flatMap((p) => p.stack))]
			.filter((tech) => data.projects.filter((p) => p.stack.includes(tech)).length > 1)
			.sort()
	);

	const visible = $derived(
		data.projects.filter(
			(p) =>
				(activeTrack === 'all' || p.track === activeTrack) &&
				(activeStack === 'all' || p.stack.includes(activeStack))
		)
	);

	const title = `Projects — ${personal.name}`;
	const description =
		'Production data pipelines, backend systems and open-source work by Ömer Ekmen — with the stack, role and outcome for each.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{personal.website}/projects" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{personal.website}/og-image.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen px-6 pt-28 pb-24 sm:px-10 lg:px-16">
	<div class="mx-auto max-w-5xl">
		<header>
			<p class="font-mono text-xs tracking-widest text-accent uppercase">Projects</p>
			<h1 class="page-title mt-4 text-text">Selected work</h1>
			<p class="mt-5 max-w-2xl leading-relaxed text-text-secondary">
				{description}
			</p>
		</header>

		<!-- ═══ FILTERS ═══ -->
		<div class="mt-12 flex flex-col gap-4">
			<div class="flex flex-wrap items-center gap-2">
				<span class="filter-label">Track</span>
				<button
					class="chip"
					class:active={activeTrack === 'all'}
					onclick={() => (activeTrack = 'all')}
				>
					All
				</button>
				{#each tracks as track (track)}
					<button
						class="chip"
						class:active={activeTrack === track}
						onclick={() => (activeTrack = track)}
					>
						{TRACK_LABELS[track]}
					</button>
				{/each}
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<span class="filter-label">Stack</span>
				<button
					class="chip"
					class:active={activeStack === 'all'}
					onclick={() => (activeStack = 'all')}
				>
					All
				</button>
				{#each stacks as tech (tech)}
					<button
						class="chip"
						class:active={activeStack === tech}
						onclick={() => (activeStack = tech)}
					>
						{tech}
					</button>
				{/each}
			</div>
		</div>

		<p class="mt-6 font-mono text-xs text-text-muted" aria-live="polite">
			{visible.length}
			{visible.length === 1 ? 'project' : 'projects'}
		</p>

		<!-- ═══ LIST ═══ -->
		<div class="mt-6 flex flex-col gap-4">
			{#each visible as project (project.slug)}
				<a href="/projects/{project.slug}" class="card group" data-cursor="Read">
					<div class="flex flex-wrap items-start justify-between gap-3">
						<div class="min-w-0">
							<h2
								class="text-lg font-bold tracking-tight text-text transition-colors duration-200 group-hover:text-accent sm:text-xl"
							>
								{project.title}
							</h2>
							<p class="mt-1 font-mono text-[11px] tracking-wide text-text-muted">
								{project.role} · {project.period}
							</p>
						</div>
						<TrackBadge track={project.track} progress={project.progress} />
					</div>

					<p class="mt-4 leading-relaxed text-text-secondary">{project.summary}</p>

					{#if project.metrics.length > 0}
						<dl class="mt-5 flex flex-wrap gap-x-8 gap-y-3">
							{#each project.metrics as metric (metric.label)}
								<div>
									<dt class="font-mono text-[10px] tracking-widest text-text-muted uppercase">
										{metric.label}
									</dt>
									<dd class="mt-0.5 font-mono text-lg font-bold text-accent tabular-nums">
										{metric.value}
									</dd>
								</div>
							{/each}
						</dl>
					{/if}

					<div class="mt-5 flex flex-wrap gap-1.5">
						{#each project.stack.slice(0, 7) as tech (tech)}
							<span class="tech">{tech}</span>
						{/each}
						{#if project.stack.length > 7}
							<span class="tech">+{project.stack.length - 7}</span>
						{/if}
					</div>
				</a>
			{:else}
				<p class="py-12 text-center text-text-muted">No projects match that combination.</p>
			{/each}
		</div>
	</div>
</div>

<style>
	.page-title {
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(2.25rem, 7vw, 4rem);
		line-height: 1.05;
	}

	.filter-label {
		width: 3.5rem;
		flex-shrink: 0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.chip {
		border-radius: 999px;
		border: 1px solid var(--color-border-subtle);
		background: var(--color-bg-secondary);
		padding: 0.3rem 0.75rem;
		font-size: 12px;
		font-weight: 500;
		color: var(--color-text-muted);
		transition:
			border-color 0.15s ease,
			color 0.15s ease,
			background-color 0.15s ease;
	}

	.chip:hover,
	.chip:focus-visible {
		border-color: rgba(var(--color-accent-rgb), 0.4);
		color: var(--color-text);
	}

	.chip.active {
		border-color: rgba(var(--color-accent-rgb), 0.5);
		background: rgba(var(--color-accent-rgb), 0.1);
		color: var(--color-accent);
	}

	.card {
		display: block;
		border-radius: 14px;
		border: 1px solid var(--color-border-subtle);
		background: var(--color-bg-secondary);
		padding: 1.5rem;
		text-decoration: none;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease;
	}

	.card:hover {
		border-color: rgba(var(--color-accent-rgb), 0.35);
		transform: translateY(-2px);
	}

	@media (prefers-reduced-motion: reduce) {
		.card:hover {
			transform: none;
		}
	}

	.tech {
		border-radius: 999px;
		border: 1px solid var(--color-border-subtle);
		background: var(--color-bg-tertiary);
		padding: 0.2rem 0.6rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		color: var(--color-text-muted);
	}
</style>
