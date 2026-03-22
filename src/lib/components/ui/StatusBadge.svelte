<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { ProjectStatus } from '$lib/types';

	interface Props {
		status: ProjectStatus;
	}

	let { status }: Props = $props();
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
		{status === 'ongoing' ? 'bg-ongoing/10 text-ongoing' : 'bg-completed/10 text-completed'}"
>
	<span class="relative flex h-2 w-2">
		{#if status === 'ongoing'}
			<span
				class="absolute inline-flex h-full w-full animate-ping rounded-full bg-ongoing opacity-75"
			></span>
		{/if}
		<span
			class="relative inline-flex h-2 w-2 rounded-full
				{status === 'ongoing' ? 'bg-ongoing' : 'bg-completed'}"
		></span>
	</span>
	{status === 'ongoing' ? m.status_ongoing() : m.status_completed()}
</span>
