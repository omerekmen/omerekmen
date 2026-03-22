<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { gsap, SplitText } from '$lib/utils/gsap';
	import { personal } from '$lib/data/personal';

	let sectionEl: HTMLElement | undefined = $state();
	let nameEl: HTMLHeadingElement | undefined = $state();
	let subtitleEl: HTMLParagraphElement | undefined = $state();
	let subtitle2El: HTMLParagraphElement | undefined = $state();
	let locationEl: HTMLDivElement | undefined = $state();
	let socialsEl: HTMLDivElement | undefined = $state();
	let scrollIndicatorEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!sectionEl || !nameEl) return;

		const ctx = gsap.context(() => {
			const splitName = new SplitText(nameEl!, { type: 'chars' });

			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

			tl.from(splitName.chars, {
				opacity: 0,
				y: 80,
				rotateX: -90,
				stagger: 0.04,
				duration: 1,
				delay: 0.3
			});

			if (subtitleEl) {
				tl.from(
					subtitleEl,
					{
						opacity: 0,
						y: 30,
						duration: 0.8
					},
					'-=0.4'
				);
			}

			if (subtitle2El) {
				tl.from(
					subtitle2El,
					{
						opacity: 0,
						y: 20,
						duration: 0.8
					},
					'-=0.5'
				);
			}

			if (locationEl) {
				tl.from(
					locationEl,
					{
						opacity: 0,
						y: 20,
						duration: 0.6
					},
					'-=0.4'
				);
			}

			if (socialsEl) {
				tl.from(
					socialsEl,
					{
						opacity: 0,
						y: 20,
						duration: 0.6
					},
					'-=0.3'
				);
			}

			if (scrollIndicatorEl) {
				tl.from(
					scrollIndicatorEl,
					{
						opacity: 0,
						duration: 0.8
					},
					'-=0.2'
				);

				gsap.to(scrollIndicatorEl, {
					y: 8,
					repeat: -1,
					yoyo: true,
					duration: 1.5,
					ease: 'power1.inOut',
					delay: 2
				});
			}
		}, sectionEl);

		return () => ctx.revert();
	});
</script>

<section
	bind:this={sectionEl}
	id="top"
	class="relative flex min-h-screen items-center justify-center px-6"
>
	<div class="flex flex-col items-center text-center">
		<!-- Name -->
		<h1
			bind:this={nameEl}
			class="text-6xl font-bold tracking-tight text-text sm:text-7xl lg:text-8xl xl:text-9xl"
			style="perspective: 400px;"
		>
			{personal.name}
		</h1>

		<!-- Title -->
		<p
			bind:this={subtitleEl}
			class="mt-6 text-lg font-light text-text-secondary sm:text-xl lg:text-2xl"
		>
			{m.hero_title()}
		</p>

		<!-- Subtitle -->
		<p bind:this={subtitle2El} class="mt-3 max-w-lg text-base text-text-muted sm:text-lg">
			{m.hero_subtitle()}
		</p>

		<!-- Location -->
		<div bind:this={locationEl} class="mt-8 flex items-center gap-2 text-sm text-text-muted">
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
				<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
				<circle cx="12" cy="10" r="3" />
			</svg>
			<span>{personal.location}</span>
		</div>

		<!-- Social links -->
		<div bind:this={socialsEl} class="mt-8 flex items-center gap-6">
			<!-- GitHub -->
			<a
				href={personal.github}
				target="_blank"
				rel="noopener noreferrer"
				class="text-text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-text"
				aria-label="GitHub"
			>
				<svg
					class="h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
					/>
				</svg>
			</a>

			<!-- LinkedIn -->
			<a
				href={personal.linkedin}
				target="_blank"
				rel="noopener noreferrer"
				class="text-text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-text"
				aria-label="LinkedIn"
			>
				<svg
					class="h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
					/>
				</svg>
			</a>

			<!-- Email -->
			<a
				href="mailto:{personal.email}"
				class="text-text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-text"
				aria-label="Email"
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
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
					<polyline points="22,6 12,13 2,6" />
				</svg>
			</a>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div bind:this={scrollIndicatorEl} class="absolute bottom-8 left-1/2 -translate-x-1/2">
		<button
			onclick={() => {
				const about = document.querySelector('#about');
				if (about) about.scrollIntoView({ behavior: 'smooth' });
			}}
			class="flex flex-col items-center gap-2 text-text-muted transition-colors duration-200 hover:text-text-secondary"
			aria-label="Scroll to explore"
		>
			<span class="text-xs font-light tracking-[0.2em] uppercase"
				>{m.hero_scroll?.() ?? 'Scroll'}</span
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
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</button>
	</div>
</section>
