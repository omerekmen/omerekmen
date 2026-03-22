<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { skillGroups } from '$lib/data/skills';
	import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';

	type MessageFn = () => string;
	const messages = m as unknown as Record<string, MessageFn>;

	function t(key: string): string {
		const fn = messages[key];
		if (typeof fn === 'function') return fn();
		return key;
	}
</script>

<section id="skills" class="py-24 lg:py-32">
	<div class="mx-auto max-w-3xl px-6">
		<!-- Heading -->
		<ScrollReveal>
			<h2 class="text-sm font-medium tracking-[0.2em] text-accent uppercase">
				{m.skills_heading()}
			</h2>
		</ScrollReveal>

		<!-- Skill groups -->
		<div class="mt-12 space-y-10">
			{#each skillGroups as group, i (group.categoryKey)}
				<ScrollReveal delay={i * 0.1}>
					<div>
						<h3 class="text-sm font-medium tracking-wider text-text-muted uppercase">
							{t(group.categoryKey)}
						</h3>

						<div class="mt-4 flex flex-wrap gap-2">
							{#each group.skills as skill (skill)}
								<span
									class="rounded-full border border-border-subtle px-3 py-1 text-sm text-text-secondary transition-all duration-200 hover:border-accent hover:text-text"
								>
									{skill}
								</span>
							{/each}
						</div>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
