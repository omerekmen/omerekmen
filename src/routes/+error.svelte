<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { personal } from '$lib/data/personal';
	import { gsap, SplitText } from '$lib/utils/gsap';

	const status = $derived(page.status);
	const isNotFound = $derived(status === 404);

	const title = $derived(
		isNotFound ? m.error_404_title() : status >= 500 ? m.error_500_title() : m.error_generic_title()
	);
	const body = $derived(
		isNotFound ? m.error_404_body() : status >= 500 ? m.error_500_body() : m.error_generic_body()
	);

	let rootEl: HTMLElement | undefined = $state();
	let codeEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!rootEl || !codeEl) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(rootEl.querySelectorAll('.rise'), { opacity: 1, y: 0 });
			return;
		}
		const ctx = gsap.context(() => {
			const split = new SplitText(codeEl!, { type: 'chars' });
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
			tl.from(split.chars, {
				opacity: 0,
				yPercent: 60,
				rotateX: -70,
				stagger: 0.08,
				duration: 0.9
			});
			tl.from('.rise', { opacity: 0, y: 18, stagger: 0.08, duration: 0.6 }, '-=0.45');
		}, rootEl);
		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>{status} — {title}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section bind:this={rootEl} class="error-page">
	<div class="inner">
		<div bind:this={codeEl} class="code" aria-hidden="true">{status}</div>

		<h1 class="rise title">{title}</h1>
		<p class="rise body">{body}</p>

		<div class="rise actions">
			<a href={localizeHref('/')} class="btn primary">{m.error_back_home()}</a>
			<a href={localizeHref('/projects')} class="btn">{m.error_see_work()}</a>
			<a href="mailto:{personal.email}" class="btn">{m.error_contact()}</a>
		</div>
	</div>
</section>

<style>
	.error-page {
		display: flex;
		min-height: 100vh;
		align-items: center;
		justify-content: center;
		padding: 6rem 1.5rem 4rem;
	}

	.inner {
		width: 100%;
		max-width: 640px;
		text-align: center;
	}

	/* The status code is the hero, in the site's display face. */
	.code {
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(6rem, 26vw, 15rem);
		line-height: 0.85;
		letter-spacing: -0.02em;
		color: transparent;
		-webkit-text-stroke: 2px rgba(var(--color-accent-rgb), 0.55);
		perspective: 500px;
	}

	.title {
		margin: 1.75rem 0 0;
		font-family: 'Bagel Fat One', sans-serif;
		font-size: clamp(1.5rem, 5vw, 2.4rem);
		line-height: 1.1;
		color: var(--color-text);
	}

	.body {
		margin: 1rem auto 0;
		max-width: 46ch;
		font-size: var(--text-xl);
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.6rem;
		margin-top: 2.25rem;
	}

	.btn {
		border: 1px solid var(--color-border-subtle);
		border-radius: 999px;
		background: var(--color-bg-secondary);
		padding: 0.6rem 1.15rem;
		font-size: var(--text-base);
		font-weight: 500;
		color: var(--color-text-secondary);
		text-decoration: none;
		transition:
			border-color 0.2s ease,
			color 0.2s ease,
			background-color 0.2s ease;
	}

	.btn:hover,
	.btn:focus-visible {
		border-color: rgba(var(--color-accent-rgb), 0.45);
		color: var(--color-accent-text);
	}

	.btn.primary {
		border-color: rgba(var(--color-accent-rgb), 0.45);
		background: rgba(var(--color-accent-rgb), 0.1);
		color: var(--color-accent-text);
	}

	.btn.primary:hover,
	.btn.primary:focus-visible {
		background: rgba(var(--color-accent-rgb), 0.18);
	}
</style>
