<script lang="ts">
	import { browser } from '$app/environment';
	import { getResolvedTheme } from '$lib/utils/theme.svelte';
	import type { NeuralNetworkScene } from '$lib/utils/three-scene';

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let sceneInstance: NeuralNetworkScene | undefined = $state();

	function getAccentColor(): string {
		const resolved = getResolvedTheme();
		return resolved === 'dark' ? '#b8d8b0' : '#7cb67a';
	}

	$effect(() => {
		if (!browser || !canvasEl) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		const isMobile = window.innerWidth < 768;
		let cancelled = false;

		(async () => {
			const { createNeuralNetworkScene } = await import('$lib/utils/three-scene');
			if (cancelled) return;

			const instance = await createNeuralNetworkScene(canvasEl!, getAccentColor(), isMobile);
			if (cancelled) {
				instance.dispose();
				return;
			}

			sceneInstance = instance;
			instance.resize(canvasEl!.clientWidth, canvasEl!.clientHeight);
		})();

		return () => {
			cancelled = true;
			if (sceneInstance) {
				sceneInstance.dispose();
				sceneInstance = undefined;
			}
		};
	});

	// React to theme changes
	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const _theme = getResolvedTheme();
		if (sceneInstance) {
			sceneInstance.updateColors(getAccentColor());
		}
	});

	function handleResize() {
		if (canvasEl && sceneInstance) {
			sceneInstance.resize(canvasEl.clientWidth, canvasEl.clientHeight);
		}
	}

	function handleMouseMove(e: MouseEvent) {
		if (sceneInstance) {
			sceneInstance.updateMouse(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
		}
	}
</script>

<svelte:window onresize={handleResize} onmousemove={handleMouseMove} />

<canvas
	bind:this={canvasEl}
	class="pointer-events-none absolute inset-0 h-full w-full"
	aria-hidden="true"
></canvas>
