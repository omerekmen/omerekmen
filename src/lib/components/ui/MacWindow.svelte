<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { WindowId } from '$lib/utils/windows.svelte';
	import {
		getWindow,
		closeWindow,
		minimizeWindow,
		bringToFront,
		updatePosition
	} from '$lib/utils/windows.svelte';

	interface Props {
		id: WindowId;
		title: string;
		children: Snippet;
		width?: string;
		height?: string;
	}

	let { id, title, children, width = '700px', height = '500px' }: Props = $props();

	let dragging = $state(false);
	let dragOffsetX = $state(0);
	let dragOffsetY = $state(0);
	let isMobile = $state(false);
	let closing = $state(false);

	function checkMobile() {
		if (typeof window !== 'undefined') {
			isMobile = window.innerWidth < 640;
		}
	}

	$effect(() => {
		checkMobile();

		function onResize() {
			checkMobile();
		}

		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	$effect(() => {
		if (!dragging) return;

		function onMouseMove(e: MouseEvent) {
			updatePosition(id, e.clientX - dragOffsetX, e.clientY - dragOffsetY);
		}

		function onMouseUp() {
			dragging = false;
		}

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
	});

	function onTitleBarMouseDown(e: MouseEvent) {
		if (isMobile) return;
		if ((e.target as HTMLElement).closest('[data-traffic-light]')) return;

		const win = getWindow(id);
		dragOffsetX = e.clientX - win.x;
		dragOffsetY = e.clientY - win.y;
		dragging = true;
		bringToFront(id);
	}

	function handleWindowClick() {
		bringToFront(id);
	}

	function handleClose() {
		closing = true;
		setTimeout(() => {
			closing = false;
			closeWindow(id);
		}, 150);
	}

	let win = $derived(getWindow(id));
	let visible = $derived((win.open && !win.minimized) || closing);
</script>

{#if visible}
	<!-- Backdrop overlay -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="mac-window-backdrop fixed inset-0 z-0"
		class:closing
		style:z-index={win.zIndex - 1}
		onmousedown={handleWindowClick}
	></div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="mac-window fixed flex flex-col rounded-xl"
		class:dragging
		class:mobile={isMobile}
		class:closing
		style:left={isMobile ? undefined : `${win.x}px`}
		style:top={isMobile ? undefined : `${win.y}px`}
		style:z-index={win.zIndex}
		style:max-width={isMobile ? undefined : width}
		style:max-height={isMobile ? undefined : height}
		style:width={isMobile ? undefined : width}
		onmousedown={handleWindowClick}
	>
		<!-- Top accent highlight line -->
		<div class="window-highlight-line"></div>

		<!-- Title bar -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="title-bar group relative flex shrink-0 items-center rounded-t-xl px-4 py-3"
			onmousedown={onTitleBarMouseDown}
		>
			<!-- Traffic lights -->
			<div class="flex items-center gap-2" data-traffic-light>
				<button
					class="traffic-light traffic-light-close group/close relative flex items-center justify-center rounded-full transition-all"
					onclick={handleClose}
					aria-label="Close window"
				>
					<svg
						class="traffic-light-icon pointer-events-none opacity-0 transition-opacity group-hover/close:opacity-100"
						width="8"
						height="8"
						viewBox="0 0 8 8"
						fill="none"
					>
						<path
							d="M1 1L7 7M7 1L1 7"
							stroke="rgba(0,0,0,0.6)"
							stroke-width="1.2"
							stroke-linecap="round"
						/>
					</svg>
				</button>
				<button
					class="traffic-light traffic-light-minimize group/min relative flex items-center justify-center rounded-full transition-all"
					onclick={() => minimizeWindow(id)}
					aria-label="Minimize window"
				>
					<svg
						class="traffic-light-icon pointer-events-none opacity-0 transition-opacity group-hover/min:opacity-100"
						width="8"
						height="8"
						viewBox="0 0 8 8"
						fill="none"
					>
						<path d="M1 4H7" stroke="rgba(0,0,0,0.6)" stroke-width="1.2" stroke-linecap="round" />
					</svg>
				</button>
				<button
					class="traffic-light traffic-light-maximize group/max relative flex items-center justify-center rounded-full transition-all"
					aria-label="Maximize window"
				>
					<svg
						class="traffic-light-icon pointer-events-none opacity-0 transition-opacity group-hover/max:opacity-100"
						width="8"
						height="8"
						viewBox="0 0 8 8"
						fill="none"
					>
						<path
							d="M4 1V7M1 4H7"
							stroke="rgba(0,0,0,0.6)"
							stroke-width="1.2"
							stroke-linecap="round"
						/>
					</svg>
				</button>
			</div>

			<!-- Title -->
			<span class="flex-1 text-center text-sm font-medium text-text-muted select-none">
				{title}
			</span>

			<!-- Spacer to balance the traffic lights -->
			<div class="w-[62px]"></div>
		</div>

		<!-- Body -->
		<div class="window-body flex-1 overflow-y-auto rounded-b-xl">
			{@render children()}
		</div>

		<!-- Resize handle (visual decoration) -->
		{#if !isMobile}
			<div class="resize-handle">
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path
						d="M10 2L2 10"
						stroke="rgba(var(--color-accent-rgb), 0.3)"
						stroke-width="1"
						stroke-linecap="round"
					/>
					<path
						d="M10 5.5L5.5 10"
						stroke="rgba(var(--color-accent-rgb), 0.3)"
						stroke-width="1"
						stroke-linecap="round"
					/>
					<path
						d="M10 9L9 10"
						stroke="rgba(var(--color-accent-rgb), 0.3)"
						stroke-width="1"
						stroke-linecap="round"
					/>
				</svg>
			</div>
		{/if}
	</div>
{/if}

<style>
	/* ── Backdrop overlay ── */
	.mac-window-backdrop {
		background: rgba(0, 0, 0, 0.08);
		animation: backdrop-fade-in 0.3s ease-out both;
		pointer-events: none;
	}

	.mac-window-backdrop.closing {
		animation: backdrop-fade-out 0.15s ease-in both;
	}

	/* ── Window container ── */
	.mac-window {
		background: rgba(var(--color-bg-rgb, 30, 30, 30), 0.8);
		backdrop-filter: blur(40px);
		-webkit-backdrop-filter: blur(40px);
		border: 1px solid rgba(var(--color-accent-rgb), 0.1);
		box-shadow:
			0 25px 60px -15px rgba(0, 0, 0, 0.3),
			0 0 40px -10px rgba(var(--color-accent-rgb), 0.1),
			inset 0 0.5px 0 rgba(255, 255, 255, 0.06);
		animation: window-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}

	.mac-window.closing {
		animation: window-exit 0.15s ease-in both;
	}

	.mac-window.dragging {
		user-select: none;
		cursor: grabbing;
		box-shadow:
			0 35px 70px -15px rgba(0, 0, 0, 0.4),
			0 0 50px -10px rgba(var(--color-accent-rgb), 0.15),
			inset 0 0.5px 0 rgba(255, 255, 255, 0.06);
	}

	.mac-window.mobile {
		inset: 0;
		max-width: none !important;
		max-height: none !important;
		width: 100% !important;
		height: 100% !important;
		border-radius: 0;
		animation: none;
	}

	.mac-window.mobile :global(.rounded-t-xl) {
		border-radius: 0;
	}

	.mac-window.mobile :global(.rounded-b-xl) {
		border-radius: 0;
	}

	/* ── Top accent highlight line (matching Dock) ── */
	.window-highlight-line {
		position: absolute;
		top: 0;
		left: 16px;
		right: 16px;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(var(--color-accent-rgb), 0.25) 30%,
			rgba(var(--color-accent-rgb), 0.45) 50%,
			rgba(var(--color-accent-rgb), 0.25) 70%,
			transparent
		);
		border-radius: 1px;
		pointer-events: none;
		z-index: 10;
	}

	/* ── Title bar ── */
	.title-bar {
		background: rgba(var(--color-bg-secondary-rgb, 40, 40, 40), 0.6);
		backdrop-filter: blur(30px);
		-webkit-backdrop-filter: blur(30px);
	}

	/* Subtle bottom gradient shadow instead of hard border */
	.title-bar::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(var(--color-accent-rgb), 0.08) 20%,
			rgba(var(--color-accent-rgb), 0.12) 50%,
			rgba(var(--color-accent-rgb), 0.08) 80%,
			transparent
		);
		pointer-events: none;
	}

	/* ── Traffic lights ── */
	.traffic-light {
		height: 14px;
		width: 14px;
		transition:
			transform 0.15s ease,
			filter 0.15s ease;
	}

	.traffic-light:hover {
		transform: scale(1.1);
	}

	.traffic-light:active {
		transform: scale(0.9);
	}

	.traffic-light-close {
		background-color: #ff5f57;
		box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.12);
	}

	.traffic-light-minimize {
		background-color: #febc2e;
		box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.12);
	}

	.traffic-light-maximize {
		background-color: #28c840;
		box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.12);
	}

	.traffic-light-icon {
		position: absolute;
	}

	/* ── Scrollbar styling ── */
	.window-body {
		scrollbar-width: thin;
		scrollbar-color: rgba(var(--color-accent-rgb), 0.3) transparent;
	}

	.window-body::-webkit-scrollbar {
		width: 6px;
	}

	.window-body::-webkit-scrollbar-track {
		background: transparent;
	}

	.window-body::-webkit-scrollbar-thumb {
		background-color: rgba(var(--color-accent-rgb), 0.25);
		border-radius: 3px;
		transition: background-color 0.2s;
	}

	.window-body::-webkit-scrollbar-thumb:hover {
		background-color: rgba(var(--color-accent-rgb), 0.45);
	}

	/* ── Resize handle ── */
	.resize-handle {
		position: absolute;
		bottom: 4px;
		right: 4px;
		pointer-events: none;
		opacity: 0.6;
		transition: opacity 0.2s ease;
	}

	.mac-window:hover .resize-handle {
		opacity: 1;
	}

	/* ── Animations ── */
	@keyframes window-enter {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	@keyframes window-exit {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(0.95);
		}
	}

	@keyframes backdrop-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes backdrop-fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
