<script lang="ts">
	import { browser } from '$app/environment';
	import { getResolvedTheme } from '$lib/utils/theme.svelte';
	import { createNetworkScene, type NetworkScene } from '$lib/utils/network-canvas';

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let scene: NetworkScene | undefined = $state();

	/**
	 * The canvas cannot use a CSS variable directly, so it reads the resolved one.
	 *
	 * These two colours used to be hardcoded here, which meant a palette change in
	 * layout.css silently left the particle field on the old accent — a drift
	 * nothing would have caught, because nothing compares a canvas to a token.
	 */
	function accentFor(_theme: string): string {
		const value = getComputedStyle(document.documentElement)
			.getPropertyValue('--color-accent')
			.trim();
		return value || '#7cb67a';
	}

	$effect(() => {
		if (!browser || !canvasEl) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// A visitor on a metered or slow connection has asked for less. An ambient
		// particle field is the definition of what to drop first: it carries no
		// information and it runs a rAF loop for as long as the page is open.
		if (window.matchMedia('(prefers-reduced-data: reduce)').matches) return;

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
