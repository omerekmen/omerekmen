<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import LanguageSwitcher from '$lib/components/ui/LanguageSwitcher.svelte';
	import { toggleWindow, isWindowOpen } from '$lib/utils/windows.svelte';

	interface DockItem {
		label: () => string;
		icon: string;
		action: () => void;
		isActive: () => boolean;
	}

	function scrollToContact() {
		const el = document.getElementById('contact-footer');
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	const items: DockItem[] = [
		{
			label: () => m.nav_projects(),
			icon: 'projects',
			action: () => toggleWindow('projects'),
			isActive: () => isWindowOpen('projects')
		},
		{
			label: () => m.nav_experience(),
			icon: 'experience',
			action: () => toggleWindow('experience'),
			isActive: () => isWindowOpen('experience')
		},
		{
			label: () => m.nav_skills(),
			icon: 'skills',
			action: () => toggleWindow('skills'),
			isActive: () => isWindowOpen('skills')
		},
		{
			label: () => m.nav_contact(),
			icon: 'contact',
			action: scrollToContact,
			isActive: () => false
		}
	];

	let dockEl: HTMLElement | undefined = $state();
	let iconEls: HTMLElement[] = $state([]);
	let scales: number[] = $state(items.map(() => 1));
	let hoveredIndex: number | null = $state(null);

	const sigma = 60;
	const maxScale = 0.35;

	function handleMouseMove(e: MouseEvent) {
		if (!dockEl || window.innerWidth < 768) return;

		const mouseX = e.clientX;

		scales = items.map((_, i) => {
			const el = iconEls[i];
			if (!el) return 1;
			const rect = el.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const d = Math.abs(mouseX - centerX);

			const factor = Math.exp(-(d * d) / (2 * sigma * sigma));
			return 1 + maxScale * factor;
		});
	}

	function handleMouseLeave() {
		scales = items.map(() => 1);
		hoveredIndex = null;
	}
</script>

<nav
	bind:this={dockEl}
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
	class="dock fixed bottom-6 z-50 flex items-center gap-2 rounded-2xl bg-bg/50 px-3 py-2.5 backdrop-blur-2xl md:gap-3 md:px-4"
	aria-label="Main navigation"
>
	{#each items as item, i (item.icon)}
		{@const active = item.isActive()}
		<button
			bind:this={iconEls[i]}
			onmouseenter={() => (hoveredIndex = i)}
			onmouseleave={() => (hoveredIndex = null)}
			onclick={item.action}
			class="dock-item group relative flex flex-col items-center justify-center rounded-xl p-2 transition-all duration-200 md:p-2.5
				{active ? 'dock-item-active text-accent' : 'text-text-secondary hover:text-text'}"
			style="transform: scale({scales[
				i
			]}); transition: transform 0.18s ease-out, box-shadow 0.25s ease, background 0.2s ease;"
			aria-label={item.label()}
		>
			<!-- Tooltip -->
			<span
				class="dock-tooltip pointer-events-none absolute -top-11 left-1/2 z-10 rounded-lg border border-border-subtle bg-bg/90 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-text shadow-xl backdrop-blur-xl
					{hoveredIndex === i ? 'dock-tooltip-visible' : 'dock-tooltip-hidden'}"
			>
				{item.label()}
			</span>

			<!-- Icon -->
			<svg
				class="h-6 w-6 transition-colors duration-200 md:h-7 md:w-7"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				{#if item.icon === 'projects'}
					<rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
					<polyline points="16 3 12 7 8 3" />
				{:else if item.icon === 'experience'}
					<rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
					<path d="M16 3h-8v4h8V3z" />
				{:else if item.icon === 'skills'}
					<polyline points="16 18 22 12 16 6" />
					<polyline points="8 6 2 12 8 18" />
				{:else if item.icon === 'contact'}
					<rect x="2" y="4" width="20" height="16" rx="2" />
					<polyline points="22 7 12 13 2 7" />
				{/if}
			</svg>

			<!-- Active indicator pill -->
			{#if active}
				<span class="dock-active-pill absolute -bottom-1 h-0.5 w-4 rounded-full bg-accent"></span>
			{/if}
		</button>
	{/each}

	<!-- Separator -->
	<div class="dock-separator mx-1 h-8 w-px md:mx-1.5"></div>

	<!-- Utility controls -->
	<div class="flex items-center gap-1">
		<ThemeToggle />
		<LanguageSwitcher direction="up" />
	</div>
</nav>

<style>
	/* ── Dock container ── */
	.dock {
		left: 50%;
		transform: translateX(-50%);
		border: 1px solid rgba(var(--color-accent-rgb), 0.08);
		box-shadow:
			0 0 30px -10px rgba(var(--color-accent-rgb), 0.15),
			0 8px 32px -8px rgba(0, 0, 0, 0.2);

		/* Entrance animation */
		animation: dock-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		animation-delay: 0.3s;
	}

	/* Top highlight line */
	.dock::before {
		content: '';
		position: absolute;
		top: 0;
		left: 12px;
		right: 12px;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(var(--color-accent-rgb), 0.3) 30%,
			rgba(var(--color-accent-rgb), 0.5) 50%,
			rgba(var(--color-accent-rgb), 0.3) 70%,
			transparent
		);
		border-radius: 1px;
		pointer-events: none;
	}

	/* Reflection beneath dock */
	.dock::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 10%;
		right: 10%;
		height: 60%;
		background: inherit;
		filter: blur(8px);
		opacity: 0.07;
		transform: scaleY(-0.3);
		border-radius: inherit;
		pointer-events: none;
		z-index: -1;
	}

	/* ── Dock items ── */
	.dock-item {
		background: linear-gradient(
			180deg,
			rgba(var(--color-accent-rgb), 0.03),
			rgba(var(--color-accent-rgb), 0.06)
		);
		box-shadow: inset 0 0 0 1px rgba(var(--color-accent-rgb), 0);
	}

	.dock-item:hover {
		background: linear-gradient(
			180deg,
			rgba(var(--color-accent-rgb), 0.05),
			rgba(var(--color-accent-rgb), 0.15)
		);
		box-shadow:
			inset 0 0 0 1px rgba(var(--color-accent-rgb), 0.2),
			0 0 12px rgba(var(--color-accent-rgb), 0.3);
	}

	.dock-item-active {
		background: linear-gradient(
			180deg,
			rgba(var(--color-accent-rgb), 0.08),
			rgba(var(--color-accent-rgb), 0.18)
		);
		box-shadow:
			inset 0 0 0 1px rgba(var(--color-accent-rgb), 0.25),
			0 0 16px rgba(var(--color-accent-rgb), 0.4);
	}

	/* ── Active indicator pill glow ── */
	.dock-active-pill {
		box-shadow: 0 0 8px rgba(var(--color-accent-rgb), 0.6);
	}

	/* ── Tooltip ── */
	.dock-tooltip {
		transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.dock-tooltip-visible {
		opacity: 1;
		transform: translateX(-50%) translateY(0);
	}

	.dock-tooltip-hidden {
		opacity: 0;
		transform: translateX(-50%) translateY(4px);
		pointer-events: none;
	}

	/* Tooltip pointer triangle */
	.dock-tooltip::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 5px solid rgba(var(--color-accent-rgb), 0.08);
	}

	/* ── Gradient separator ── */
	.dock-separator {
		background: linear-gradient(
			to bottom,
			transparent,
			rgba(var(--color-accent-rgb), 0.2) 50%,
			transparent
		);
	}

	/* ── Entrance animation ── */
	@keyframes dock-entrance {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(24px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0) scale(1);
		}
	}
</style>
