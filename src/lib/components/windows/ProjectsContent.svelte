<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { projects } from '$lib/data/projects';
	import ProjectCard from '$lib/components/ui/ProjectCard.svelte';
	import { gsap } from '$lib/utils/gsap';

	let containerEl: HTMLDivElement | undefined = $state();
	let underlineEl: HTMLSpanElement | undefined = $state();

	const ongoingCount = $derived(projects.filter((p) => p.status === 'ongoing').length);
	const completedCount = $derived(projects.filter((p) => p.status === 'completed').length);

	$effect(() => {
		if (!containerEl) return;

		const cards = containerEl.querySelectorAll('[data-project-card]');
		if (cards.length === 0) return;

		const ctx = gsap.context(() => {
			gsap.from(cards, {
				y: 40,
				opacity: 0,
				stagger: 0.12,
				duration: 0.6,
				ease: 'power3.out'
			});

			if (underlineEl) {
				gsap.from(underlineEl, {
					scaleX: 0,
					duration: 0.5,
					ease: 'power3.out',
					delay: 0.2
				});
			}
		}, containerEl);

		return () => {
			ctx.revert();
		};
	});
</script>

<div bind:this={containerEl} class="projects-content p-6 sm:p-8">
	<!-- Section header -->
	<div class="mb-8">
		<div class="relative inline-block">
			<h2 class="text-2xl font-bold tracking-tight text-text uppercase sm:text-3xl">
				{m.projects_heading()}
				<span class="ml-1 text-lg font-medium text-accent sm:text-xl">({projects.length})</span>
			</h2>
			<span
				bind:this={underlineEl}
				class="absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-accent/60"
			></span>
		</div>
	</div>

	<!-- Status pills -->
	<div class="mb-6 flex items-center gap-3">
		<span
			class="inline-flex items-center gap-1.5 rounded-full bg-bg-secondary px-3 py-1 text-xs font-medium text-text-secondary ring-1 ring-border-subtle"
		>
			<span class="font-semibold text-accent">{ongoingCount}</span>
			Ongoing
		</span>
		<span class="text-xs text-text-muted">&middot;</span>
		<span
			class="inline-flex items-center gap-1.5 rounded-full bg-bg-secondary px-3 py-1 text-xs font-medium text-text-secondary ring-1 ring-border-subtle"
		>
			<span class="font-semibold text-accent">{completedCount}</span>
			Completed
		</span>
	</div>

	<!-- Project grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
		{#each projects as project (project.id)}
			<div data-project-card>
				<ProjectCard {project} />
			</div>
		{/each}
	</div>
</div>
