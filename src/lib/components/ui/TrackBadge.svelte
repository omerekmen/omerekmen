<script lang="ts">
	import type { ProjectTrack } from '$lib/types/content';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		track: ProjectTrack;
		progress?: string | null;
	}

	let { track, progress = null }: Props = $props();

	// Static references, so the bundler keeps every message. See the note in
	// HeroSection about dynamic m[key] lookups.
	const LABELS: Record<ProjectTrack, () => string> = {
		production: m.track_production,
		'in-progress': m.track_in_progress,
		lab: m.track_lab,
		archive: m.track_archive
	};
</script>

<span class="badge {track}">
	{#if track === 'in-progress'}
		<span class="pulse" aria-hidden="true"></span>
	{/if}
	{progress ?? LABELS[track]()}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		border-radius: 999px;
		padding: 0.25rem 0.6rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: var(--text-2xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.production {
		background: rgba(109, 184, 138, 0.12);
		color: var(--color-completed-text);
	}

	.in-progress {
		background: rgba(224, 164, 88, 0.12);
		color: var(--color-ongoing-text);
	}

	.lab {
		background: rgba(var(--color-accent-rgb), 0.12);
		color: var(--color-accent-text);
	}

	.archive {
		background: rgba(var(--color-text-rgb), 0.06);
		color: var(--color-text-muted);
	}

	.pulse {
		position: relative;
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: currentColor;
	}

	.pulse::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: currentColor;
		animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	@keyframes ping {
		75%,
		100% {
			transform: scale(2.4);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse::after {
			animation: none;
		}
	}
</style>
