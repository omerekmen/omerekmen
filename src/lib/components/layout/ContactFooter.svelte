<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { gsap, SplitText } from '$lib/utils/gsap';
	import { personal } from '$lib/data/personal';

	let sectionEl: HTMLElement | undefined = $state();
	let ctaTextEl: HTMLElement | undefined = $state();
	let ruleEl: HTMLElement | undefined = $state();

	$effect(() => {
		if (!sectionEl || !ctaTextEl) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		const ctx = gsap.context(() => {
			// Scroll-linked horizontal slide
			gsap.fromTo(
				ctaTextEl!,
				{ xPercent: 40 },
				{
					xPercent: -3,
					ease: 'none',
					scrollTrigger: {
						trigger: sectionEl,
						start: 'top bottom',
						end: 'top 20%',
						scrub: 5
					}
				}
			);

			// Char-by-char reveal
			const splitCta = new SplitText(ctaTextEl!, { type: 'chars' });
			gsap.fromTo(
				splitCta.chars,
				{ opacity: 0, y: 60 },
				{
					opacity: 1,
					y: 0,
					stagger: 0.03,
					duration: 0.8,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: sectionEl,
						start: 'top 50%',
						toggleActions: 'play none none none'
					}
				}
			);

			// Rule animation
			if (ruleEl) {
				gsap.fromTo(
					ruleEl,
					{ scaleX: 0 },
					{
						scaleX: 1,
						duration: 1,
						ease: 'power3.inOut',
						scrollTrigger: {
							trigger: sectionEl,
							start: 'top 70%',
							toggleActions: 'play none none none'
						}
					}
				);
			}
		}, sectionEl);

		return () => ctx.revert();
	});

	function backToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<footer
	bind:this={sectionEl}
	id="contact-footer"
	data-cursor-invert
	class="relative flex min-h-screen flex-col justify-between overflow-hidden bg-accent text-bg"
>
	<!-- Top spacer -->
	<div class="flex-1"></div>

	<!-- Content -->
	<div class="pb-8">
		<!-- Social links + Back to top -->
		<div class="flex items-start justify-between px-6 sm:px-10 lg:px-16">
			<div class="flex flex-col gap-3">
				<a
					href={personal.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm font-medium text-bg/80 transition-colors duration-150 hover:text-bg"
				>
					LinkedIn
				</a>
				<a
					href={personal.github}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm font-medium text-bg/80 transition-colors duration-150 hover:text-bg"
				>
					Github
				</a>
				<a
					href="mailto:{personal.email}"
					class="text-sm font-medium text-bg/80 transition-colors duration-150 hover:text-bg"
				>
					Mail
				</a>
				<a
					href="/cv"
					class="text-sm font-medium text-bg/80 transition-colors duration-150 hover:text-bg"
				>
					CV
				</a>
			</div>

			<button
				onclick={backToTop}
				class="flex items-center gap-2 text-sm font-medium text-bg/80 transition-colors duration-150 hover:text-bg"
			>
				{m.footer_back_to_top?.() ?? 'Back to top'}
				<svg
					class="h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="18 15 12 9 6 15" />
				</svg>
			</button>
		</div>

		<!-- Horizontal rule -->
		<div bind:this={ruleEl} class="mx-6 my-8 h-px origin-left bg-bg/30 sm:mx-10 lg:mx-16"></div>

		<!-- Massive CTA with slide -->
		<div class="overflow-hidden">
			<a
				href="mailto:{personal.email}"
				bind:this={ctaTextEl}
				class="cta-text block leading-[0.85] font-black tracking-tight text-bg uppercase"
			>
				{m.footer_cta?.() ?? "LET'S TALK"}
			</a>
		</div>

		<!-- Copyright -->
		<div class="mt-8 flex items-center justify-between px-6 text-xs text-bg/50 sm:px-10 lg:px-16">
			<span>&copy; {new Date().getFullYear()} {personal.name}</span>
			<span>{m.footer_rights()}</span>
		</div>
	</div>
</footer>

<style>
	.cta-text {
		/* On mobile: scale down so longest single word (KONUŞALIM ~9 chars) fits.
		   Each word goes on its own line via word-spacing trick. */
		font-size: clamp(3rem, 16vw, 8rem);
		word-spacing: 100vw; /* forces each word onto its own line */
		overflow-wrap: normal;
		word-break: keep-all;
	}

	@media (min-width: 640px) {
		.cta-text {
			font-size: 18vw;
			word-spacing: normal;
			white-space: nowrap;
		}
	}

	@media (min-width: 1024px) {
		.cta-text {
			font-size: 16vw;
		}
	}
</style>
