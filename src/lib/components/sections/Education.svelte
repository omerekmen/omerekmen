<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { education, certificates } from '$lib/data/education';
	import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';

	type MessageFn = () => string;
	const messages = m as unknown as Record<string, MessageFn>;

	function t(key: string): string {
		const fn = messages[key];
		if (typeof fn === 'function') return fn();
		return key;
	}
</script>

<section id="education" class="py-24 lg:py-32">
	<div class="mx-auto max-w-3xl px-6">
		<!-- Heading -->
		<ScrollReveal>
			<h2 class="text-sm font-medium tracking-[0.2em] text-accent uppercase">
				{m.education_heading()}
			</h2>
		</ScrollReveal>

		<!-- Education entries -->
		<div class="mt-12 space-y-8">
			{#each education as edu, i (edu.id)}
				<ScrollReveal delay={i * 0.15}>
					<div class="rounded-2xl border border-border-subtle bg-bg-secondary p-6 sm:p-8">
						<h3 class="text-lg font-semibold text-text">
							{t(edu.degreeKey)}
						</h3>

						<p class="mt-1 text-base font-medium text-text-secondary">
							{t(edu.institutionKey)}
						</p>

						<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
							<span>{edu.period}</span>
							<span class="hidden sm:inline">&middot;</span>
							<span>{edu.location}</span>
							<span class="hidden sm:inline">&middot;</span>
							<span class="font-mono">{edu.gpa}</span>
						</div>

						{#if edu.highlightKeys.length > 0}
							<ul class="mt-5 space-y-2">
								{#each edu.highlightKeys as hKey (hKey)}
									<li class="flex items-start gap-2.5 text-sm leading-relaxed text-text-secondary">
										<span class="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent"></span>
										<span>{t(hKey)}</span>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</ScrollReveal>
			{/each}
		</div>

		<!-- Certificates -->
		{#if certificates.length > 0}
			<div class="mt-16">
				<ScrollReveal>
					<h3 class="text-sm font-medium tracking-[0.2em] text-text-muted uppercase">
						{m.education_certificates_heading?.() ?? 'Certificates'}
					</h3>
				</ScrollReveal>

				<div class="mt-6 space-y-4">
					{#each certificates as cert, i (cert.id)}
						<ScrollReveal delay={i * 0.1}>
							<div
								class="flex items-start justify-between gap-4 rounded-xl border border-border-subtle bg-bg-secondary p-5 sm:p-6"
							>
								<div>
									<h4 class="text-base font-medium text-text">
										{t(cert.nameKey)}
									</h4>
									<p class="mt-1 text-sm text-text-muted">
										{cert.issuer} &middot; {cert.date}
									</p>
								</div>

								{#if cert.credentialUrl}
									<a
										href={cert.credentialUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="flex-shrink-0 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
										aria-label="View credential"
									>
										<svg
											class="h-5 w-5"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
											<polyline points="15 3 21 3 21 9" />
											<line x1="10" y1="14" x2="21" y2="3" />
										</svg>
									</a>
								{/if}
							</div>
						</ScrollReveal>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>
