<script lang="ts">
	import { personal } from '$lib/data/personal';
	import { gsap, SplitText } from '$lib/utils/gsap';

	interface LinkItem {
		label: string;
		href: string;
		icon: string;
		external: boolean;
	}

	const links: LinkItem[] = [
		{ label: 'Portfolio', href: '/', icon: 'globe', external: false },
		{ label: 'GitHub', href: personal.github, icon: 'github', external: true },
		{ label: 'LinkedIn', href: personal.linkedin, icon: 'linkedin', external: true },
		{ label: 'Email', href: `mailto:${personal.email}`, icon: 'mail', external: true },
		{ label: 'CV', href: '/cv', icon: 'document', external: false }
	];

	let pageEl: HTMLElement | undefined = $state();
	let avatarEl: HTMLDivElement | undefined = $state();
	let nameEl: HTMLHeadingElement | undefined = $state();
	let titleEl: HTMLParagraphElement | undefined = $state();
	let locationEl: HTMLDivElement | undefined = $state();
	let linksEl: HTMLDivElement | undefined = $state();
	let footerEl: HTMLParagraphElement | undefined = $state();

	$effect(() => {
		if (!pageEl || !avatarEl || !nameEl || !titleEl || !locationEl || !linksEl || !footerEl) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			gsap.set([avatarEl, nameEl, titleEl, locationEl, footerEl], { opacity: 1 });
			gsap.set(linksEl.children, { opacity: 1 });
			return;
		}

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

			// Avatar scales in
			tl.fromTo(
				avatarEl!,
				{ scale: 0, opacity: 0, rotateZ: -8 },
				{ scale: 1, opacity: 1, rotateZ: 0, duration: 0.7 }
			);

			// Name with SplitText
			const split = new SplitText(nameEl!, { type: 'chars' });
			tl.fromTo(
				split.chars,
				{ opacity: 0, y: 30, rotateX: -40 },
				{ opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.03 },
				'-=0.3'
			);

			// Title fades in
			tl.fromTo(titleEl!, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

			// Location fades in
			tl.fromTo(locationEl!, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');

			// Links stagger up
			tl.fromTo(
				linksEl!.children,
				{ opacity: 0, y: 25, scale: 0.95 },
				{ opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
				'-=0.2'
			);

			// Footer fades in
			tl.fromTo(footerEl!, { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.1');
		}, pageEl);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Links — {personal.name}</title>
	<meta
		name="description"
		content="Connect with {personal.name} — social links, portfolio, CV, and contact."
	/>
	<meta property="og:type" content="profile" />
	<meta property="og:url" content="https://www.omerekmen.com/s" />
	<meta property="og:title" content="Links — {personal.name}" />
	<meta
		property="og:description"
		content="All links for {personal.name} — Portfolio, GitHub, LinkedIn, Email, and CV."
	/>
	<meta property="og:image" content="https://www.omerekmen.com/og-image.png" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<section
	bind:this={pageEl}
	class="relative flex min-h-screen w-full items-center justify-center px-4 py-20"
>
	<!-- Dot grid background -->
	<div class="dot-grid"></div>

	<div class="relative z-10 flex w-full max-w-[420px] flex-col items-center gap-6">
		<!-- Avatar -->
		<div bind:this={avatarEl} class="avatar-container" style="opacity: 0;">
			<div class="avatar-inner">
				<span class="avatar-initials">OE</span>
			</div>
		</div>

		<!-- Name -->
		<h1
			bind:this={nameEl}
			class="name-text text-center text-2xl tracking-wide text-text sm:text-3xl"
			style="opacity: 0;"
		>
			{personal.name.toUpperCase()}
		</h1>

		<!-- Title -->
		<p
			bind:this={titleEl}
			class="-mt-3 text-center text-sm text-text-muted sm:text-base"
			style="opacity: 0;"
		>
			Data Science & Software Engineering
		</p>

		<!-- Location -->
		<div
			bind:this={locationEl}
			class="-mt-2 flex items-center gap-1.5 text-xs text-text-muted sm:text-sm"
			style="opacity: 0;"
		>
			<!-- Map pin icon -->
			<svg
				class="h-3.5 w-3.5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
				<circle cx="12" cy="10" r="3" />
			</svg>
			<span>{personal.location}</span>
		</div>

		<!-- Links -->
		<div bind:this={linksEl} class="mt-2 flex w-full flex-col gap-3">
			{#each links as link (link.label)}
				{@const isExternal = link.external}
				<a
					href={link.href}
					target={isExternal ? '_blank' : undefined}
					rel={isExternal ? 'noopener noreferrer' : undefined}
					class="link-card group"
					data-cursor="View"
					style="opacity: 0;"
				>
					<!-- Icon -->
					<span
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-tertiary/50 text-text-muted transition-colors duration-200 group-hover:bg-accent/10 group-hover:text-accent"
					>
						{#if link.icon === 'globe'}
							<svg
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<path d="M2 12h20" />
								<path
									d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
								/>
							</svg>
						{:else if link.icon === 'github'}
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
								/>
							</svg>
						{:else if link.icon === 'linkedin'}
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
								/>
							</svg>
						{:else if link.icon === 'mail'}
							<svg
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<rect x="2" y="4" width="20" height="16" rx="2" />
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
							</svg>
						{:else if link.icon === 'document'}
							<svg
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
								<polyline points="14 2 14 8 20 8" />
								<line x1="16" y1="13" x2="8" y2="13" />
								<line x1="16" y1="17" x2="8" y2="17" />
								<polyline points="10 9 9 9 8 9" />
							</svg>
						{/if}
					</span>

					<!-- Label -->
					<span class="flex-1 text-sm font-medium text-text sm:text-base">{link.label}</span>

					<!-- Arrow -->
					<svg
						class="h-4 w-4 text-text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="5" y1="12" x2="19" y2="12" />
						<polyline points="12 5 19 12 12 19" />
					</svg>
				</a>
			{/each}
		</div>

		<!-- Footer -->
		<p
			bind:this={footerEl}
			class="mt-4 text-center text-[11px] text-text-muted/60"
			style="opacity: 0;"
		>
			&copy; 2026 {personal.name}
		</p>
	</div>
</section>

<style>
	/* ── Dot grid background ── */
	.dot-grid {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background-image: radial-gradient(
			circle,
			rgba(var(--color-accent-rgb), 0.08) 1px,
			transparent 1px
		);
		background-size: 24px 24px;
		mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 75%);
		-webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 75%);
	}

	/* ── Avatar ── */
	.avatar-container {
		position: relative;
		width: 96px;
		height: 96px;
		border-radius: 24px;
		padding: 3px;
		background: linear-gradient(
			135deg,
			var(--color-accent),
			var(--color-accent-hover),
			var(--color-accent)
		);
		background-size: 200% 200%;
		animation: gradient-shift 4s ease infinite;
	}

	.avatar-inner {
		width: 100%;
		height: 100%;
		border-radius: 21px;
		background: var(--color-bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.avatar-initials {
		font-family: 'Bagel Fat One', sans-serif;
		font-size: 2rem;
		color: var(--color-accent);
		letter-spacing: 0.05em;
		line-height: 1;
	}

	@keyframes gradient-shift {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	/* ── Name ── */
	.name-text {
		font-family: 'Bagel Fat One', sans-serif;
	}

	/* ── Link cards ── */
	.link-card {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 0.75rem 1rem;
		border-radius: 16px;
		border: 1px solid var(--color-border-subtle);
		background: rgba(var(--color-bg-inverted-rgb), 0.02);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		text-decoration: none;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease,
			transform 0.2s ease;
	}

	.link-card:hover {
		border-color: rgba(var(--color-accent-rgb), 0.4);
		background: var(--color-bg-secondary);
		transform: scale(1.02);
	}

	.link-card:active {
		transform: scale(0.98);
	}
</style>
