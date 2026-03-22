<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
</script>

<section id="about" class="py-24 lg:py-32">
	<div class="mx-auto max-w-3xl px-6">
		<!-- Heading -->
		<ScrollReveal>
			<h2 class="text-sm font-medium tracking-[0.2em] text-accent uppercase">
				{m.about_heading()}
			</h2>
		</ScrollReveal>

		<!-- Paragraphs -->
		<ScrollReveal delay={0.1}>
			<p class="mt-8 text-lg leading-relaxed text-text-secondary">
				{m.about_p1()}
			</p>
		</ScrollReveal>

		<ScrollReveal delay={0.2}>
			<p class="mt-6 text-lg leading-relaxed text-text-secondary">
				{m.about_p2()}
			</p>
		</ScrollReveal>

		<!-- Languages -->
		<ScrollReveal delay={0.3}>
			<div class="mt-16">
				<h3 class="text-sm font-medium tracking-[0.2em] text-text-muted uppercase">
					{m.about_languages_heading()}
				</h3>

				<div class="mt-6 space-y-4">
					{#each [m.about_lang_tr(), m.about_lang_en(), m.about_lang_fr()] as lang, i (i)}
						<div class="text-base text-text-secondary">
							{lang}
						</div>
					{/each}
				</div>
			</div>
		</ScrollReveal>
	</div>
</section>
