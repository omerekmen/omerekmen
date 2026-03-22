<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { experiences } from '$lib/data/experience';
	import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';

	type MessageFn = () => string;
	const messages = m as unknown as Record<string, MessageFn>;

	function t(key: string): string {
		const fn = messages[key];
		if (typeof fn === 'function') return fn();
		return key;
	}
</script>

<section id="experience" class="py-24 lg:py-32">
	<div class="mx-auto max-w-3xl px-6">
		<!-- Heading -->
		<ScrollReveal>
			<h2 class="text-sm font-medium tracking-[0.2em] text-accent uppercase">
				{m.experience_heading()}
			</h2>
		</ScrollReveal>

		<!-- Timeline -->
		<div class="relative mt-12">
			<!-- Vertical line -->
			<div class="absolute top-0 bottom-0 left-[7px] w-px bg-border-subtle"></div>

			<div class="space-y-12">
				{#each experiences as exp, i (exp.id)}
					<ScrollReveal delay={i * 0.15}>
						<div class="relative pl-10">
							<!-- Timeline dot -->
							<div
								class="absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg"
							></div>

							<!-- Content -->
							<div>
								<h3 class="text-lg font-semibold text-text">
									{t(exp.titleKey)}
								</h3>

								<p class="mt-1 text-base font-medium text-text-secondary">
									{t(exp.companyKey)}
								</p>

								<div
									class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted"
								>
									<span>{exp.period}</span>
									<span class="hidden sm:inline">&middot;</span>
									<span>{exp.location}</span>
								</div>

								<!-- Description bullets -->
								{#if exp.descriptionKeys.length > 0}
									<ul class="mt-4 space-y-2">
										{#each exp.descriptionKeys as descKey (descKey)}
											<li
												class="flex items-start gap-2.5 text-sm leading-relaxed text-text-secondary"
											>
												<span class="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-text-muted"></span>
												<span>{t(descKey)}</span>
											</li>
										{/each}
									</ul>
								{/if}

								<!-- Stack tags -->
								<div class="mt-5 flex flex-wrap gap-2">
									{#each exp.stack as tech (tech)}
										<span
											class="rounded-full bg-bg-tertiary px-2.5 py-1 font-mono text-xs text-text-muted"
										>
											{tech}
										</span>
									{/each}
								</div>
							</div>
						</div>
					</ScrollReveal>
				{/each}
			</div>
		</div>
	</div>
</section>
