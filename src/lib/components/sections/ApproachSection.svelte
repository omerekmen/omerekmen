<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { gsap } from '$lib/utils/gsap';

	/**
	 * Four positions rather than a page of adjectives.
	 *
	 * This sits on the homepage rather than behind a nav item on purpose: a
	 * statement of how someone works that nobody navigates to is worth nothing,
	 * and a fifth nav item costs every visitor attention to serve a few.
	 */
	const positions = [
		{ title: m.approach_1_title, body: m.approach_1_body },
		{ title: m.approach_2_title, body: m.approach_2_body },
		{ title: m.approach_3_title, body: m.approach_3_body },
		{ title: m.approach_4_title, body: m.approach_4_body }
	];

	let sectionEl: HTMLElement | undefined = $state();

	$effect(() => {
		if (!sectionEl) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		/*
		 * An IntersectionObserver rather than a ScrollTrigger, because this
		 * section sits below a pinned one: a trigger's start is measured when it
		 * is created, the pin then changes every offset beneath it, and the reveal
		 * either fires early or never. An observer measures at the moment of
		 * intersection and cannot hold a stale position.
		 */
		const items = sectionEl.querySelectorAll<HTMLElement>('.position');
		gsap.set(items, { opacity: 0, y: 22 });

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				observer.disconnect();
				gsap.to(items, {
					opacity: 1,
					y: 0,
					duration: 0.6,
					stagger: 0.09,
					ease: 'power2.out'
				});
			},
			{ rootMargin: '0px 0px -20% 0px' }
		);
		observer.observe(sectionEl);

		return () => {
			observer.disconnect();
			gsap.set(items, { clearProps: 'opacity,transform' });
		};
	});
</script>

<section id="approach" bind:this={sectionEl} class="approach">
	<header class="head">
		<span class="label">{m.approach_label()}</span>
		<h2>{m.approach_title()}</h2>
		<p class="intro">{m.approach_intro()}</p>
	</header>

	<ol class="positions">
		{#each positions as position, i (i)}
			<li class="position">
				<span class="num">{String(i + 1).padStart(2, '0')}</span>
				<div>
					<h3>{position.title()}</h3>
					<p>{position.body()}</p>
				</div>
			</li>
		{/each}
	</ol>

	<a class="more" href={localizeHref('/notes')}>{m.notes_all()}</a>
</section>

<style>
	.approach {
		border-top: 1px solid var(--color-border-subtle);
		padding: 6rem 1.5rem;
	}

	.head,
	.positions,
	.more {
		max-width: 52rem;
		margin-inline: auto;
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.label {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-accent-text);
	}

	h2 {
		margin: 0;
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		line-height: 1;
		color: var(--color-text);
	}

	.intro {
		margin: 0;
		max-width: 36rem;
		font-size: var(--text-xl);
		line-height: 1.65;
		color: var(--color-text-secondary);
	}

	.positions {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin: 3rem auto 0;
		padding: 0;
		list-style: none;
	}

	.position {
		display: grid;
		grid-template-columns: 3.5rem minmax(0, 1fr);
		gap: 0 1rem;
		border-top: 1px solid var(--color-border-subtle);
		padding: 2rem 0;
	}

	.position:last-child {
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.num {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		letter-spacing: 0.12em;
		color: var(--color-accent-text);
		font-variant-numeric: tabular-nums;
	}

	h3 {
		margin: 0 0 0.6rem;
		font-size: var(--text-2xl);
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 1.3;
		text-wrap: balance;
	}

	.position p {
		margin: 0;
		font-size: var(--text-lg);
		line-height: 1.72;
		color: var(--color-text-secondary);
	}

	.more {
		display: block;
		margin-top: 2rem;
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-accent-text);
		text-decoration: none;
	}

	.more:hover,
	.more:focus-visible {
		text-decoration: underline;
	}

	@media (max-width: 560px) {
		.position {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.5rem;
		}
	}
</style>
