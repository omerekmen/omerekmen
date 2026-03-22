<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { gsap } from '$lib/utils/gsap';
	import { personal } from '$lib/data/personal';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import LanguageSwitcher from '$lib/components/ui/LanguageSwitcher.svelte';

	let headerEl: HTMLElement | undefined = $state();
	let mobileOpen = $state(false);
	let scrolled = $state(false);
	let hidden = $state(false);
	let lastScrollY = 0;

	interface NavItem {
		label: () => string;
		href: string;
	}

	const navItems: NavItem[] = [
		{ label: () => m.nav_about(), href: '#about' },
		{ label: () => m.nav_experience(), href: '#experience' },
		{ label: () => m.nav_projects(), href: '#projects' },
		{ label: () => m.nav_skills(), href: '#skills' },
		{ label: () => m.nav_education(), href: '#education' },
		{ label: () => m.nav_contact(), href: '#contact' }
	];

	function handleScroll() {
		const y = window.scrollY;
		scrolled = y > 50;
		hidden = y > lastScrollY && y > 200;
		lastScrollY = y;
	}

	function scrollTo(href: string) {
		mobileOpen = false;
		const target = document.querySelector(href);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth' });
		}
	}

	$effect(() => {
		if (mobileOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	$effect(() => {
		if (!headerEl) return;

		const ctx = gsap.context(() => {
			gsap.from(headerEl!, {
				y: -100,
				opacity: 0,
				duration: 0.8,
				delay: 0.2,
				ease: 'power3.out'
			});
		});

		return () => ctx.revert();
	});
</script>

<svelte:window onscroll={handleScroll} />

<header
	bind:this={headerEl}
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-300
		{scrolled ? 'border-b border-border-subtle bg-bg-secondary/80 backdrop-blur-xl' : 'bg-transparent'}
		{hidden ? '-translate-y-full' : 'translate-y-0'}"
>
	<nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:h-20">
		<!-- Logo / Name -->
		<a
			href="#top"
			onclick={(e: MouseEvent) => {
				e.preventDefault();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}
			class="text-lg font-semibold tracking-tight text-text transition-colors duration-150 hover:text-accent"
		>
			{personal.name}
		</a>

		<!-- Desktop nav -->
		<ul class="hidden items-center gap-8 lg:flex">
			{#each navItems as item (item.href)}
				<li>
					<a
						href={item.href}
						onclick={(e: MouseEvent) => {
							e.preventDefault();
							scrollTo(item.href);
						}}
						class="text-sm font-medium text-text-muted transition-colors duration-150 hover:text-text"
					>
						{item.label()}
					</a>
				</li>
			{/each}
		</ul>

		<!-- Desktop actions -->
		<div class="hidden items-center gap-3 lg:flex">
			<ThemeToggle />
			<LanguageSwitcher />
		</div>

		<!-- Mobile hamburger -->
		<button
			class="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label="Toggle menu"
			aria-expanded={mobileOpen}
		>
			<div class="flex w-5 flex-col gap-1.5">
				<span
					class="block h-px w-full bg-text transition-all duration-300
						{mobileOpen ? 'translate-y-[3.5px] rotate-45' : ''}"
				></span>
				<span
					class="block h-px w-full bg-text transition-all duration-300
						{mobileOpen ? '-translate-y-[3.5px] -rotate-45' : ''}"
				></span>
			</div>
		</button>
	</nav>
</header>

<!-- Mobile overlay -->
{#if mobileOpen}
	<div
		class="fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg/95 backdrop-blur-xl lg:hidden"
	>
		<nav class="flex flex-col items-center gap-8">
			{#each navItems as item (item.href)}
				<a
					href={item.href}
					onclick={(e: MouseEvent) => {
						e.preventDefault();
						scrollTo(item.href);
					}}
					class="text-2xl font-light tracking-wide text-text-secondary transition-colors duration-150 hover:text-text"
				>
					{item.label()}
				</a>
			{/each}
		</nav>

		<div class="mt-12 flex items-center gap-4">
			<ThemeToggle />
			<LanguageSwitcher />
		</div>
	</div>
{/if}
