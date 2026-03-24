<script lang="ts">
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime';

	interface Props {
		direction?: 'down' | 'up';
	}

	let { direction = 'down' }: Props = $props();

	let open = $state(false);
	let buttonEl: HTMLButtonElement | undefined = $state();
	let dropdownStyle = $state('');
	const currentLocale = $derived(getLocale());

	const localeLabels: Record<string, string> = {
		en: 'EN',
		tr: 'TR',
		fr: 'FR',
		de: 'DE',
		es: 'ES'
	};

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}

	function close() {
		open = false;
	}

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		if (!open && buttonEl) {
			const rect = buttonEl.getBoundingClientRect();
			if (direction === 'up') {
				dropdownStyle = `position:fixed; bottom:${window.innerHeight - rect.top + 4}px; right:${window.innerWidth - rect.right}px;`;
			} else {
				dropdownStyle = `position:fixed; top:${rect.bottom + 4}px; right:${window.innerWidth - rect.right}px;`;
			}
		}
		open = !open;
	}
</script>

<svelte:window onclick={close} />

<div class="relative">
	<button
		bind:this={buttonEl}
		onclick={toggle}
		class="flex h-10 items-center gap-1.5 rounded-full bg-transparent px-3 text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-border hover:bg-bg-secondary"
		aria-label="Switch language"
		aria-expanded={open}
	>
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
			<circle cx="12" cy="12" r="10" />
			<line x1="2" y1="12" x2="22" y2="12" />
			<path
				d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
			/>
		</svg>
		<span>{localeLabels[currentLocale] ?? currentLocale.toUpperCase()}</span>
	</button>

	{#if open}
		<div
			use:portal
			style={dropdownStyle}
			class="z-[9999] min-w-[120px] overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary shadow-lg"
			role="menu"
			tabindex="-1"
			onclick={(e: MouseEvent) => e.stopPropagation()}
			onkeydown={(e: KeyboardEvent) => {
				if (e.key === 'Escape') close();
			}}
		>
			{#each locales as locale (locale)}
				<button
					class="flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-150
						{locale === currentLocale
						? 'bg-bg-tertiary font-medium text-text'
						: 'text-text-secondary hover:bg-bg-tertiary hover:text-text'}"
					role="menuitem"
					onclick={() => {
						close();
						if (locale !== currentLocale) setLocale(locale);
					}}
				>
					<span class="font-mono text-xs text-text-muted">{locale.toUpperCase()}</span>
					<span>{localeLabels[locale]}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
