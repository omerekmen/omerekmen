<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { experiences } from '$lib/data/experience';
	import { education, certificates } from '$lib/data/education';
	import { gsap } from '$lib/utils/gsap';

	type MessageFn = () => string;
	const messages = m as unknown as Record<string, MessageFn>;

	function t(key: string): string {
		const fn = messages[key];
		if (typeof fn === 'function') return fn();
		return key;
	}

	function isCurrent(period: string): boolean {
		return period.toLowerCase().includes('present');
	}

	let containerEl: HTMLDivElement | undefined = $state();
	let timelineLineEl: HTMLDivElement | undefined = $state();
	let experienceCardsEl: HTMLDivElement | undefined = $state();
	let educationSectionEl: HTMLDivElement | undefined = $state();
	let dividerEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!containerEl || !timelineLineEl || !experienceCardsEl || !educationSectionEl || !dividerEl)
			return;

		const ctx = gsap.context(() => {
			// 1. Animated timeline line drawing from top to bottom
			gsap.fromTo(
				timelineLineEl!,
				{ scaleY: 0 },
				{
					scaleY: 1,
					duration: 1,
					ease: 'power2.out',
					transformOrigin: 'top'
				}
			);

			// 2. Staggered reveal of experience cards
			const cards = experienceCardsEl!.querySelectorAll('.experience-card');
			gsap.from(cards, {
				x: -30,
				opacity: 0,
				duration: 0.6,
				stagger: 0.2,
				ease: 'power2.out',
				delay: 0.3
			});

			// 3. Tech pills wave stagger within each card
			cards.forEach((card, cardIndex) => {
				const pills = card.querySelectorAll('.tech-pill');
				gsap.from(pills, {
					opacity: 0,
					y: 10,
					scale: 0.8,
					duration: 0.3,
					stagger: 0.05,
					ease: 'back.out(1.7)',
					delay: 0.5 + cardIndex * 0.2
				});
			});

			// 4. Section divider grows from center outward
			gsap.fromTo(
				dividerEl!,
				{ scaleX: 0 },
				{
					scaleX: 1,
					duration: 0.8,
					ease: 'power2.out',
					delay: 0.6 + experiences.length * 0.2
				}
			);

			// 5. Education section slides in
			gsap.from(educationSectionEl!, {
				y: 30,
				opacity: 0,
				duration: 0.7,
				ease: 'power2.out',
				delay: 0.8 + experiences.length * 0.2
			});
		}, containerEl);

		return () => ctx.revert();
	});
</script>

<div class="p-6" bind:this={containerEl}>
	<!-- Experience -->
	<h2 class="mb-8 text-2xl font-bold tracking-tight text-text uppercase">
		{m.experience_heading()}
	</h2>

	<div class="relative">
		<!-- Animated vertical timeline line -->
		<div
			bind:this={timelineLineEl}
			class="absolute top-0 bottom-0 left-[7px] w-px origin-top scale-y-0 bg-gradient-to-b from-accent via-accent/60 to-transparent"
		></div>

		<div class="space-y-10" bind:this={experienceCardsEl}>
			{#each experiences as exp (exp.id)}
				{@const current = isCurrent(exp.period)}
				<div class="experience-card group relative pl-10 transition-transform duration-200">
					<!-- Timeline dot -->
					<div class="absolute top-1.5 left-0 flex items-center justify-center">
						{#if current}
							<!-- Current role: pulsing ring -->
							<div class="absolute h-[15px] w-[15px] animate-ping rounded-full bg-accent/40"></div>
							<div
								class="relative h-[15px] w-[15px] rounded-full border-2 border-accent bg-accent shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.5)] transition-transform duration-200 group-hover:scale-125"
							></div>
						{:else}
							<!-- Past role dot -->
							<div
								class="timeline-dot relative h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg transition-all duration-200 group-hover:scale-125 group-hover:bg-accent/20 group-hover:shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.3)]"
							></div>
						{/if}
					</div>

					<!-- Card content with hover interaction -->
					<div
						class="-ml-1 rounded-xl border border-transparent p-4 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-l-2 group-hover:border-l-accent group-hover:bg-bg-secondary/50"
					>
						<h3 class="text-lg font-semibold text-text">{t(exp.titleKey)}</h3>
						<p class="mt-1 text-base font-medium text-text-secondary">
							{t(exp.companyKey)}
						</p>
						<div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
							<span>{exp.period}</span>
							<span>&middot;</span>
							<span>{exp.location}</span>
							{#if current}
								<span
									class="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent"
								>
									<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
									Current
								</span>
							{/if}
						</div>

						{#if exp.descriptionKeys.length > 0}
							<ul class="mt-4 space-y-2">
								{#each exp.descriptionKeys as descKey (descKey)}
									<li class="flex items-start gap-2.5 text-sm leading-relaxed text-text-secondary">
										<span class="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent/60"></span>
										<span>{t(descKey)}</span>
									</li>
								{/each}
							</ul>
						{/if}

						<!-- Tech stack pills with hover glow -->
						<div class="mt-4 flex flex-wrap gap-2">
							{#each exp.stack as tech (tech)}
								<span
									class="tech-pill rounded-full border border-border-subtle bg-bg-tertiary px-2.5 py-1 font-mono text-xs text-text-muted transition-all duration-200 hover:border-accent hover:text-text hover:shadow-[0_0_12px_rgba(var(--color-accent-rgb),0.3)]"
								>
									{tech}
								</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Decorative accent divider between Experience and Education -->
	<div class="my-16 flex items-center justify-center">
		<div
			bind:this={dividerEl}
			class="h-px w-32 origin-center scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent"
		></div>
	</div>

	<!-- Education -->
	<div bind:this={educationSectionEl}>
		<h2 class="mb-8 text-2xl font-bold tracking-tight text-text uppercase">
			{m.education_heading()}
		</h2>

		<div class="space-y-6">
			{#each education as edu (edu.id)}
				<div
					class="group relative overflow-hidden rounded-2xl border border-border-subtle p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_4px_20px_rgba(var(--color-accent-rgb),0.08)]"
					style="background: linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.03) 0%, transparent 60%)"
				>
					<!-- Graduation cap icon accent -->
					<div class="absolute top-4 right-4 text-accent/20">
						<svg
							class="h-8 w-8"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
							<path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
						</svg>
					</div>

					<h3 class="text-lg font-semibold text-text">{t(edu.degreeKey)}</h3>
					<p class="mt-1 text-base font-medium text-text-secondary">
						{t(edu.institutionKey)}
					</p>
					<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
						<span>{edu.period}</span>
						<span>&middot;</span>
						<span>{edu.location}</span>
						<span>&middot;</span>
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
			{/each}
		</div>

		<!-- Certificates -->
		{#if certificates.length > 0}
			<h3 class="mt-12 mb-4 text-sm font-medium tracking-[0.2em] text-text-muted uppercase">
				{m.education_certificates_heading?.() ?? 'Certificates'}
			</h3>

			<div class="space-y-4">
				{#each certificates as cert (cert.id)}
					<div
						class="group flex items-start justify-between gap-4 rounded-xl border border-border-subtle bg-bg-secondary p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_4px_20px_rgba(var(--color-accent-rgb),0.08)]"
					>
						<div class="flex items-start gap-3">
							<!-- Verified checkmark badge -->
							<div
								class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10"
							>
								<svg
									class="h-3.5 w-3.5 text-accent"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</div>
							<div>
								<h4 class="text-base font-medium text-text">
									{t(cert.nameKey)}
								</h4>
								<p class="mt-1 text-sm text-text-muted">
									{cert.issuer} &middot; {cert.date}
								</p>
							</div>
						</div>
						{#if cert.credentialUrl}
							<a
								href={cert.credentialUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex-shrink-0 text-accent transition-all duration-150 hover:scale-110 hover:text-accent-hover"
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
				{/each}
			</div>
		{/if}
	</div>
</div>
