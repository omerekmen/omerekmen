<script lang="ts">
	import { browser } from '$app/environment';
	import { getResolvedTheme } from '$lib/utils/theme.svelte';
	import { createNetworkScene, type NetworkScene } from '$lib/utils/network-canvas';

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let scene: NetworkScene | undefined = $state();

	function accentFor(theme: string): string {
		return theme === 'dark' ? '#b8d8b0' : '#7cb67a';
	}

	$effect(() => {
		if (!browser || !canvasEl) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const isMobile = window.innerWidth < 768;
		const instance = createNetworkScene(canvasEl, accentFor(getResolvedTheme()), isMobile);
		instance.resize(canvasEl.clientWidth, canvasEl.clientHeight);
		scene = instance;

		return () => {
			instance.dispose();
			scene = undefined;
		};
	});

	// Recolour in place when the theme flips — no need to rebuild the field.
	$effect(() => {
		const theme = getResolvedTheme();
		scene?.updateColors(accentFor(theme));
	});

	function handleResize() {
		if (canvasEl && scene) scene.resize(canvasEl.clientWidth, canvasEl.clientHeight);
	}

	function handleMouseMove(e: MouseEvent) {
		scene?.updateMouse(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
	}
</script>

<svelte:window onresize={handleResize} onmousemove={handleMouseMove} />

<canvas
	bind:this={canvasEl}
	class="pointer-events-none absolute inset-0 h-full w-full"
	aria-hidden="true"
></canvas>
