<script lang="ts">
	import type { Snippet } from 'svelte';
	import { gsap } from '$lib/utils/gsap';

	interface Props {
		direction?: 'up' | 'down' | 'left' | 'right';
		delay?: number;
		duration?: number;
		distance?: number;
		children: Snippet;
	}

	let { direction = 'up', delay = 0, duration = 0.8, distance = 60, children }: Props = $props();

	let el: HTMLDivElement | undefined = $state();

	const offsetMap: Record<string, { xSign: number; ySign: number }> = {
		up: { xSign: 0, ySign: 1 },
		down: { xSign: 0, ySign: -1 },
		left: { xSign: 1, ySign: 0 },
		right: { xSign: -1, ySign: 0 }
	};

	$effect(() => {
		if (!el) return;

		const signs = offsetMap[direction];
		const x = signs.xSign * distance;
		const y = signs.ySign * distance;

		const ctx = gsap.context(() => {
			gsap.fromTo(
				el!,
				{
					opacity: 0,
					x,
					y
				},
				{
					opacity: 1,
					x: 0,
					y: 0,
					duration,
					delay,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: el,
						start: 'top 90%',
						end: 'bottom 10%',
						toggleActions: 'play none none none'
					}
				}
			);
		});

		return () => ctx.revert();
	});
</script>

<div bind:this={el} class="will-change-transform" style="opacity: 0;">
	{@render children()}
</div>
