<script lang="ts">
	import { gsap } from '$lib/utils/gsap';

	let dotEl: HTMLDivElement | undefined = $state();
	let ringEl: HTMLDivElement | undefined = $state();
	let labelEl: HTMLSpanElement | undefined = $state();
	let isHovering = $state(false);
	let cursorLabel = $state('');
	let isVisible = $state(false);
	let isPointer = $state(false);
	let isInverted = $state(false);

	$effect(() => {
		if (!dotEl || !ringEl) return;

		document.documentElement.classList.add('custom-cursor-active');

		// Center both elements on their own center using percentage-based offset
		// This stays correct even when width/height change dynamically
		gsap.set(dotEl, { xPercent: -50, yPercent: -50 });
		gsap.set(ringEl, { xPercent: -50, yPercent: -50 });

		// Use quickTo for high-performance cursor tracking
		const dotX = gsap.quickTo(dotEl, 'x', { duration: 0.02, ease: 'none' });
		const dotY = gsap.quickTo(dotEl, 'y', { duration: 0.02, ease: 'none' });
		const ringX = gsap.quickTo(ringEl, 'x', { duration: 0.15, ease: 'power2.out' });
		const ringY = gsap.quickTo(ringEl, 'y', { duration: 0.15, ease: 'power2.out' });

		function onMouseMove(e: MouseEvent) {
			if (!isVisible) {
				isVisible = true;
				gsap.set(dotEl!, { opacity: 1 });
				gsap.set(ringEl!, { opacity: 1 });
			}

			dotX(e.clientX);
			dotY(e.clientY);
			ringX(e.clientX);
			ringY(e.clientY);
		}

		function onMouseLeave() {
			isVisible = false;
			gsap.to([dotEl!, ringEl!], { opacity: 0, duration: 0.2 });
		}

		function onMouseEnter() {
			isVisible = true;
			gsap.to([dotEl!, ringEl!], { opacity: 1, duration: 0.2 });
		}

		function onMouseOver(e: MouseEvent) {
			const target = e.target as HTMLElement;
			const interactive = target.closest('a, button, [role="button"], [data-cursor]');

			// Check if cursor is over an inverted section (e.g. footer)
			const invertedSection = target.closest('[data-cursor-invert]');
			if (invertedSection && !isInverted) {
				isInverted = true;
			} else if (!invertedSection && isInverted) {
				isInverted = false;
			}

			if (interactive) {
				isHovering = true;
				isPointer = true;
				const label = interactive.getAttribute('data-cursor') || '';
				cursorLabel = label;

				gsap.to(dotEl!, { scale: 0, duration: 0.25, ease: 'power2.out' });
				gsap.to(ringEl!, {
					width: label ? 100 : 50,
					height: label ? 100 : 50,
					duration: 0.3,
					ease: 'power2.out'
				});
				if (labelEl && label) {
					gsap.to(labelEl, { opacity: 1, scale: 1, duration: 0.2, delay: 0.1 });
				}
			} else {
				if (isHovering) {
					isHovering = false;
					isPointer = false;
					cursorLabel = '';

					gsap.to(dotEl!, { scale: 1, duration: 0.25, ease: 'power2.out' });
					gsap.to(ringEl!, {
						width: 36,
						height: 36,
						duration: 0.3,
						ease: 'power2.out'
					});
					if (labelEl) {
						gsap.to(labelEl, { opacity: 0, scale: 0.8, duration: 0.15 });
					}
				}
			}
		}

		function onMouseDown() {
			gsap.to(ringEl!, { scale: 0.85, duration: 0.1, ease: 'power2.out' });
			gsap.to(dotEl!, { scale: isHovering ? 0 : 0.7, duration: 0.1 });
		}

		function onMouseUp() {
			gsap.to(ringEl!, { scale: 1, duration: 0.2, ease: 'back.out(1.7)' });
			gsap.to(dotEl!, { scale: isHovering ? 0 : 1, duration: 0.2, ease: 'back.out(1.7)' });
		}

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseleave', onMouseLeave);
		document.addEventListener('mouseenter', onMouseEnter);
		document.addEventListener('mouseover', onMouseOver);
		document.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mouseup', onMouseUp);

		return () => {
			document.documentElement.classList.remove('custom-cursor-active');
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseleave', onMouseLeave);
			document.removeEventListener('mouseenter', onMouseEnter);
			document.removeEventListener('mouseover', onMouseOver);
			document.removeEventListener('mousedown', onMouseDown);
			document.removeEventListener('mouseup', onMouseUp);
		};
	});
</script>

<!-- Dot -->
<div
	bind:this={dotEl}
	class="cursor-dot"
	class:pointer={isPointer}
	class:inverted={isInverted}
></div>

<!-- Ring -->
<div bind:this={ringEl} class="cursor-ring" class:pointer={isPointer} class:inverted={isInverted}>
	{#if cursorLabel}
		<span bind:this={labelEl} class="cursor-label" class:inverted={isInverted}>
			{cursorLabel}
		</span>
	{/if}
</div>

<style>
	.cursor-dot,
	.cursor-ring {
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 99999;
		opacity: 0;
		will-change: transform;
	}

	.cursor-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: rgba(var(--color-accent-rgb), 0.9);
		box-shadow: 0 0 10px rgba(var(--color-accent-rgb), 0.4);
	}

	.cursor-dot.inverted {
		background-color: var(--color-bg);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.cursor-ring {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 1.5px solid rgba(var(--color-accent-rgb), 0.35);
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cursor-ring.inverted {
		border-color: rgba(var(--color-bg-inverted-rgb, 0, 0, 0), 0.4);
	}

	.cursor-ring.pointer {
		border-color: rgba(var(--color-accent-rgb), 0.6);
		background-color: rgba(var(--color-accent-rgb), 0.08);
	}

	.cursor-ring.pointer.inverted {
		border-color: rgba(var(--color-bg-inverted-rgb, 0, 0, 0), 0.5);
		background-color: rgba(var(--color-bg-inverted-rgb, 0, 0, 0), 0.1);
	}

	.cursor-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(var(--color-accent-rgb), 0.9);
		white-space: nowrap;
		opacity: 0;
		transform: scale(0.8);
	}

	.cursor-label.inverted {
		color: var(--color-bg);
	}

	/* Hide on touch devices */
	@media (hover: none), (pointer: coarse) {
		.cursor-dot,
		.cursor-ring {
			display: none !important;
		}
	}
</style>
