<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { projects } from '$lib/data/projects';
	import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
	import ProjectCard from '$lib/components/ui/ProjectCard.svelte';
</script>

<section id="projects" class="py-24 lg:py-32">
	<div class="mx-auto max-w-6xl px-6">
		<!-- Heading -->
		<ScrollReveal>
			<h2 class="text-sm font-medium tracking-[0.2em] text-accent uppercase">
				{m.projects_heading()}
			</h2>
		</ScrollReveal>

		<!-- Grid -->
		<div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each projects as project, i (project.id)}
				<ScrollReveal delay={i * 0.1}>
					<ProjectCard {project} />
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
