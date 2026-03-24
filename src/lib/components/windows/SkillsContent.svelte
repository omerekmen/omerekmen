<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { skillGroups } from '$lib/data/skills';
	import { gsap } from '$lib/utils/gsap';

	type MessageFn = () => string;
	const messages = m as unknown as Record<string, MessageFn>;

	function t(key: string): string {
		const fn = messages[key];
		if (typeof fn === 'function') return fn();
		return key;
	}

	/** Seeded hash for deterministic "proficiency" per skill name */
	function skillProficiency(name: string): number {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = (hash * 31 + name.charCodeAt(i)) | 0;
		}
		return 70 + ((hash & 0x7fffffff) % 31);
	}

	let containerEl: HTMLDivElement | undefined = $state();
	let mouseX = $state(50);
	let mouseY = $state(50);

	function handleMouseMove(e: MouseEvent) {
		if (!containerEl) return;
		const rect = containerEl.getBoundingClientRect();
		mouseX = ((e.clientX - rect.left) / rect.width) * 100;
		mouseY = ((e.clientY - rect.top) / rect.height) * 100;
	}

	$effect(() => {
		if (!containerEl) return;

		const groups = containerEl.querySelectorAll<HTMLElement>('[data-skill-group]');
		const ctx = gsap.context(() => {
			groups.forEach((group, i) => {
				const header = group.querySelector('[data-group-header]');
				const line = group.querySelector('[data-header-line]');
				const pills = group.querySelectorAll('[data-skill-pill]');

				const tl = gsap.timeline({
					delay: i * 0.1
				});

				if (header) {
					tl.fromTo(
						header,
						{ opacity: 0, x: -12 },
						{ opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
						0
					);
				}

				if (line) {
					tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.1);
				}

				if (pills.length > 0) {
					tl.fromTo(
						pills,
						{ opacity: 0, y: 8, scale: 0.92 },
						{
							opacity: 1,
							y: 0,
							scale: 1,
							duration: 0.35,
							ease: 'power2.out',
							stagger: 0.03
						},
						0.15
					);
				}
			});
		}, containerEl);

		return () => ctx.revert();
	});
</script>

<div
	class="relative overflow-hidden p-6"
	bind:this={containerEl}
	onmousemove={handleMouseMove}
	role="presentation"
	style:--mouse-x="{mouseX}%"
	style:--mouse-y="{mouseY}%"
>
	<!-- Mouse-tracking spotlight gradient -->
	<div
		class="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
		style="background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(var(--color-accent-rgb), 0.06), transparent 60%);"
	></div>

	<div class="relative z-10">
		<h2 class="mb-10 text-2xl font-bold tracking-tight text-text uppercase">
			{m.skills_heading()}
		</h2>

		<div class="space-y-10">
			{#each skillGroups as group, groupIndex (group.categoryKey)}
				<div data-skill-group>
					<!-- Category header with numbered index -->
					<div class="flex items-center gap-3" data-group-header>
						<span class="font-mono text-xs font-semibold text-accent">
							{String(groupIndex + 1).padStart(2, '0')}
						</span>
						<h3 class="text-sm font-medium tracking-wider text-text-muted uppercase">
							{t(group.categoryKey)}
						</h3>
					</div>

					<!-- Accent line that grows from left -->
					<div class="mt-2 h-px origin-left bg-accent/20" data-header-line></div>

					<!-- Skill pills -->
					<div class="mt-4 flex flex-wrap gap-2">
						{#each group.skills as skill (skill)}
							{@const proficiency = skillProficiency(skill)}
							<span
								class="skill-pill group relative overflow-hidden rounded-full border border-border-subtle px-3.5 py-1.5 text-sm text-text-secondary transition-all duration-300 hover:scale-105 hover:border-accent hover:text-accent hover:shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.25)]"
								data-skill-pill
							>
								<!-- Proficiency fill background -->
								<span
									class="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-accent/[0.06] transition-colors duration-300 group-hover:bg-accent/[0.12]"
									style:width="{proficiency}%"
								></span>
								<span class="relative z-10">{skill}</span>
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.skill-pill {
		backdrop-filter: blur(4px);
	}

	.skill-pill::before {
		content: '';
		position: absolute;
		inset: -1px;
		border-radius: 9999px;
		padding: 1px;
		background: linear-gradient(
			135deg,
			transparent 40%,
			rgba(var(--color-accent-rgb), 0) 40%,
			rgba(var(--color-accent-rgb), 0) 100%
		);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.skill-pill:hover::before {
		background: linear-gradient(
			135deg,
			rgba(var(--color-accent-rgb), 0.5) 0%,
			rgba(var(--color-accent-rgb), 0.15) 50%,
			rgba(var(--color-accent-rgb), 0.4) 100%
		);
		opacity: 1;
	}
</style>
