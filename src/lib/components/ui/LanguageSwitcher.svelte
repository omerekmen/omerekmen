<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref, getLocale } from '$lib/paraglide/runtime';

	let open = $state(false);
	const currentLocale = $derived(getLocale());

	const localeLabels: Record<string, string> = {
		en: 'EN',
		tr: 'TR',
		fr: 'FR',
		de: 'DE',
		es: 'ES'
	};

	function close() {
		open = false;
	}
</script>

<svelte:window onclick={close} />

<div class="relative">
	<button
		onclick={(e: MouseEvent) => {
			e.stopPropagation();
			open = !open;
		}}
		class="flex h-10 items-center gap-1.5 rounded-full border border-border-subtle bg-transparent px-3 text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-border hover:bg-bg-secondary"
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
			class="absolute top-12 right-0 z-50 min-w-[120px] overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary shadow-lg"
			role="menu"
		>
			{#each locales as locale (locale)}
				<a
					href={localizeHref(page.url.pathname, { locale })}
					class="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-150
						{locale === currentLocale
						? 'bg-bg-tertiary font-medium text-text'
						: 'text-text-secondary hover:bg-bg-tertiary hover:text-text'}"
					role="menuitem"
					onclick={close}
				>
					<span class="font-mono text-xs text-text-muted">{locale.toUpperCase()}</span>
					<span>{localeLabels[locale]}</span>
				</a>
			{/each}
		</div>
	{/if}
</div>
