<script lang="ts">
	import { page } from '$app/state';
</script>

<section class="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
	<p
		class="font-mono text-[8rem] leading-none font-bold tracking-tighter text-accent sm:text-[10rem]"
	>
		{page.status}
	</p>

	<p class="mt-4 max-w-md text-lg text-text-secondary sm:text-xl">
		{page.error?.message ?? 'Something went wrong'}
	</p>

	<a
		href="/"
		class="mt-10 inline-block rounded-full border border-border px-6 py-3 text-sm font-medium text-text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
	>
		Go back home
	</a>
</section>
