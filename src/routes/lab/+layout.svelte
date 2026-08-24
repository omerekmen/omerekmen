<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	const directions = [
		{ id: 'a', label: 'A', name: 'Refined Kinetic' },
		{ id: 'b', label: 'B', name: 'Systems' },
		{ id: 'c', label: 'C', name: 'Editorial' }
	];

	const current = $derived(page.url.pathname.replace(/\/$/, '').split('/').pop() ?? '');
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{@render children()}

<!-- Evaluation control, not part of any direction. Deliberately neutral. -->
<nav class="switcher" aria-label="Design direction">
	<a href="/lab" class="home" class:active={current === 'lab'}>Lab</a>
	<span class="divider" aria-hidden="true"></span>
	{#each directions as d (d.id)}
		<a href="/lab/{d.id}" class="dir" class:active={current === d.id} title={d.name}>
			{d.label}
		</a>
	{/each}
</nav>

<style>
	.switcher {
		position: fixed;
		bottom: 16px;
		left: 50%;
		z-index: 9999;
		display: flex;
		align-items: center;
		gap: 4px;
		transform: translateX(-50%);
		border-radius: 999px;
		border: 1px solid rgba(128, 128, 128, 0.28);
		background: rgba(20, 20, 20, 0.82);
		padding: 5px 7px;
		backdrop-filter: blur(14px);
		font-family: ui-monospace, 'JetBrains Mono', monospace;
		font-size: 11px;
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
	}

	.switcher a {
		display: flex;
		min-width: 26px;
		height: 24px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		color: rgba(245, 245, 245, 0.62);
		text-decoration: none;
		letter-spacing: 0.06em;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.switcher a.home {
		padding: 0 10px;
	}

	.switcher a:hover,
	.switcher a:focus-visible {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	.switcher a.active {
		background: rgba(255, 255, 255, 0.92);
		color: #111;
	}

	.divider {
		width: 1px;
		height: 14px;
		background: rgba(128, 128, 128, 0.34);
	}

	@media print {
		.switcher {
			display: none;
		}
	}
</style>
