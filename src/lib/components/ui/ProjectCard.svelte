<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { Project } from '$lib/types';
	import StatusBadge from './StatusBadge.svelte';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();

	type MessageFn = () => string;
	const messages = m as unknown as Record<string, MessageFn>;

	function t(key: string): string {
		const fn = messages[key];
		if (typeof fn === 'function') return fn();
		return key;
	}
</script>

<article
	class="group relative flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg hover:shadow-bg-tertiary/50"
>
	<!-- Status badge -->
	<div class="absolute top-4 right-4 z-10">
		<StatusBadge status={project.status} />
	</div>

	<div class="flex flex-1 flex-col p-6 pt-12 sm:p-8 sm:pt-14">
		<!-- Title -->
		<h3 class="text-lg font-semibold tracking-tight text-text sm:text-xl">
			{t(project.titleKey)}
		</h3>

		<!-- Description -->
		<p class="mt-3 text-sm leading-relaxed text-text-secondary">
			{t(project.descriptionKey)}
		</p>

		<!-- Highlights -->
		{#if project.highlights.length > 0}
			<ul class="mt-4 space-y-1.5">
				{#each project.highlights as highlight (highlight)}
					<li class="flex items-start gap-2 text-sm text-text-muted">
						<span class="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent"></span>
						<span>{t(highlight)}</span>
					</li>
				{/each}
			</ul>
		{/if}

		<!-- Stack tags -->
		<div class="mt-6 flex flex-wrap gap-2">
			{#each project.stack as tech (tech)}
				<span
					class="rounded-full bg-bg-tertiary px-2.5 py-1 font-mono text-xs text-text-muted transition-colors duration-150 group-hover:text-text-secondary"
				>
					{tech}
				</span>
			{/each}
		</div>

		<!-- Spacer -->
		<div class="flex-1"></div>

		<!-- Footer: GitHub link -->
		<div class="mt-6 border-t border-border-subtle pt-4">
			{#if project.github}
				<a
					href={project.github}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
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
					{m.view_github()}
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
					{m.private_repo()}
				</span>
			{/if}
		</div>
	</div>
</article>
