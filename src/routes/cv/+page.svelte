<script lang="ts">
	import { personal } from '$lib/data/personal';
	import { gsap, SplitText } from '$lib/utils/gsap';

	// ── CV Data ──
	const summary =
		'Mathematics graduate (B.Sc., Galatasaray University) with a 4.0/4.0 reinforcement learning thesis and hands-on experience building production-grade, data-driven systems in enterprise environments. Combines a strong academic foundation in data science, optimization, and machine learning, complemented by hands-on experience building enterprise ERP systems and independently deploying full-stack cloud platforms.';

	const education = {
		degree: 'B.Sc. in Mathematics',
		school: 'Galatasaray University',
		location: 'Istanbul, Turkey',
		period: 'Sep 2018 – Feb 2026',
		gpa: '2.99 / 4.0',
		details: [
			{
				label: 'Thesis',
				text: 'Apprentissage par Renforcement (Reinforcement Learning) — Grade: AA (4.0 / 4.0), Advisor: Assoc. Prof. Dr. Ayşegül Ulus'
			},
			{
				label: 'Coursework',
				text: 'Machine Learning, Natural Language Processing, Probability Theory, Linear Algebra, Numerical Analysis, Applied Mathematics, Cryptography'
			},
			{
				label: 'Language',
				text: 'French (full 4-year academic curriculum delivered in French)'
			},
			{
				label: 'Leadership',
				text: 'Mathematics Club Board Member (2021–2022), Photography Club Board Member (2018–2023); organized 35+ academic and cultural events'
			}
		]
	};

	const experience = [
		{
			role: 'Software Engineer Intern',
			company: 'Otokoç Otomotiv',
			location: 'Istanbul, Turkey',
			period: 'Jun 2024 – Present',
			bullets: [
				'Contributed to backend development of enterprise ERP systems using .NET and SQL Server, supporting finance and operational domains across multiple departments.',
				'Developed and optimized T-SQL stored procedures for operational workflows, reporting pipelines, and data transformation processes.',
				'Designed complex queries across highly relational schemas to support system operations and analytical reporting.',
				'Built SSIS packages to automate recurring data integration and ETL processes.',
				'Developed SSRS reports used by business teams for operational monitoring and decision-making.',
				'Collaborated on 20+ deliverables using Agile methodologies and Azure DevOps with cross-functional teams.'
			]
		},
		{
			role: 'Data Analytics Intern',
			company: 'Vakıf Katılım Bank',
			location: 'Istanbul, Turkey',
			period: 'Sep 2023 – Oct 2023',
			bullets: [
				'Analyzed financial and operational datasets using SQL and Python to support senior management decision-making.',
				'Developed structured reports and dashboards using business intelligence tools for data visualization.',
				'Collaborated with finance and compliance teams to streamline data workflows and ensure regulatory alignment.'
			]
		}
	];

	const projects = [
		{
			name: 'Property Management Analytics Platform',
			meta: 'Production System — Private Repository',
			github: null,
			bullets: [
				'Engineered a full-stack platform managing 100+ property listings with automated rent tracking, expense analytics, and tenant management for a real client.',
				'Designed a PostgreSQL schema with 15+ normalized tables; optimized queries reduced dashboard load time by 60%.',
				'Built financial reporting module generating monthly P&L statements, occupancy metrics, and payment summaries.'
			],
			stack: ['Django', 'PostgreSQL', 'REST APIs', 'HTML/CSS', 'JavaScript', 'Bootstrap']
		},
		{
			name: 'SpaceX Falcon 9 Landing Prediction System',
			meta: null,
			github: 'https://github.com/omerekmen/Space-X-Falcon-9-Landing-Analysis',
			bullets: [
				'Built classification models (Logistic Regression, SVM, Decision Trees, KNN) achieving 85% accuracy in predicting first-stage landing success.',
				'Performed end-to-end data pipeline: API data collection, cleaning, feature engineering, and model evaluation with cross-validation.',
				'Created interactive geospatial visualizations using Folium and Plotly for landing site analysis.'
			],
			stack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Folium', 'Plotly']
		},
		{
			name: 'Real-World Data Analysis Portfolio',
			meta: null,
			github: 'https://github.com/omerekmen/Working-with-real-world-data-sets',
			bullets: [
				'Conducted multi-dataset analysis: housing price prediction (regression), customer segmentation (K-means clustering), and market trend classification.',
				'Applied statistical hypothesis testing and feature selection techniques to improve model interpretability.'
			],
			stack: ['Python', 'Scikit-Learn', 'Pandas', 'Plotly', 'Seaborn']
		}
	];

	const skills = [
		{
			category: 'Languages',
			items: ['Python', 'SQL (T-SQL, PostgreSQL)', 'C#', 'JavaScript']
		},
		{
			category: 'Data Science & ML',
			items: [
				'Scikit-Learn',
				'TensorFlow',
				'PyTorch',
				'Pandas',
				'NumPy',
				'Statistical Modeling',
				'Hypothesis Testing',
				'Feature Engineering',
				'A/B Testing'
			]
		},
		{
			category: 'Visualization & BI',
			items: ['Matplotlib', 'Seaborn', 'Plotly', 'Folium', 'Tableau', 'Power BI', 'SSRS']
		},
		{
			category: 'Databases & Data Engineering',
			items: ['SQL Server', 'PostgreSQL', 'SSIS', 'Query Optimization', 'Data Modeling']
		},
		{
			category: 'Software Engineering',
			items: ['Django', '.NET', 'REST APIs', 'Git', 'Docker', 'Azure DevOps', 'Agile/Scrum']
		}
	];

	const certifications = [
		{
			name: 'IBM Data Science Professional Certificate',
			issuer: 'Coursera',
			date: 'Aug 2023',
			credential: 'TK3PHHTVV248',
			url: 'https://www.coursera.org/account/accomplishments/professional-cert/TK3PHHTVV248'
		}
	];

	const languages = [
		{ name: 'Turkish', level: 'Native', dots: 5 },
		{ name: 'English', level: 'Professional Working Proficiency (B2+)', dots: 4 },
		{ name: 'French', level: 'Professional Working Proficiency (B2+)', dots: 4 }
	];

	// ── Refs ──
	let pageEl: HTMLElement | undefined = $state();
	let nameEl: HTMLHeadingElement | undefined = $state();

	$effect(() => {
		if (!pageEl || !nameEl) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			gsap.set(pageEl.querySelectorAll('.cv-section'), { opacity: 1, y: 0 });
			gsap.set(pageEl.querySelectorAll('.skill-pill'), { opacity: 1, scale: 1 });
			gsap.set(nameEl, { opacity: 1 });
			return;
		}

		const ctx = gsap.context(() => {
			// Name entrance
			const splitName = new SplitText(nameEl!, { type: 'chars' });
			gsap.from(splitName.chars, {
				opacity: 0,
				y: 40,
				rotateX: -60,
				stagger: 0.03,
				duration: 0.8,
				ease: 'power3.out',
				delay: 0.2
			});

			// Section reveals
			const sections = pageEl!.querySelectorAll('.cv-section');
			sections.forEach((section) => {
				gsap.from(section, {
					opacity: 0,
					y: 30,
					duration: 0.7,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: section,
						start: 'top 85%',
						once: true
					}
				});
			});

			// Skill pills
			const pillGroups = pageEl!.querySelectorAll('.skill-group');
			pillGroups.forEach((group) => {
				const pills = group.querySelectorAll('.skill-pill');
				gsap.from(pills, {
					opacity: 0,
					scale: 0.6,
					duration: 0.4,
					stagger: 0.04,
					ease: 'back.out(1.7)',
					scrollTrigger: {
						trigger: group,
						start: 'top 85%',
						once: true
					}
				});
			});

			// Timeline dots pulse
			const dots = pageEl!.querySelectorAll('.timeline-dot');
			dots.forEach((dot) => {
				gsap.from(dot, {
					scale: 0,
					duration: 0.5,
					ease: 'back.out(2)',
					scrollTrigger: {
						trigger: dot,
						start: 'top 85%',
						once: true
					}
				});
			});
		}, pageEl);

		return () => ctx.revert();
	});

	function printCV() {
		window.print();
	}
</script>

<svelte:head>
	<title>CV — {personal.name}</title>
	<meta
		name="description"
		content="Curriculum Vitae of {personal.name} — Data Scientist & Software Engineer. Mathematics graduate from Galatasaray University with expertise in ML, Python, SQL, and full-stack development."
	/>
	<meta property="og:type" content="profile" />
	<meta property="og:url" content="https://www.omerekmen.com/cv" />
	<meta property="og:title" content="CV — {personal.name}" />
	<meta
		property="og:description"
		content="Interactive CV — Data Scientist & Software Engineer building production-grade data-driven systems."
	/>
	<meta property="og:image" content="https://www.omerekmen.com/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div bind:this={pageEl} class="relative min-h-screen bg-bg px-4 py-20 sm:px-6">
	<div class="mx-auto max-w-[900px]">
		<!-- ═══ ACTIONS BAR ═══ -->
		<div class="mb-8 flex items-center justify-end gap-3 print:hidden">
			<button
				onclick={printCV}
				class="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-secondary/50 px-4 py-2 font-mono text-xs tracking-wider text-text-muted uppercase transition-all duration-200 hover:border-accent/40 hover:text-accent"
			>
				<svg
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="6 9 6 2 18 2 18 9" />
					<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
					<rect x="6" y="14" width="12" height="8" />
				</svg>
				Print
			</button>
			<a
				href="/cv.pdf"
				download="Omer_Ekmen_CV.pdf"
				data-sveltekit-reload
				rel="external"
				class="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-xs tracking-wider text-accent uppercase transition-all duration-200 hover:bg-accent/10"
			>
				<svg
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="7 10 12 15 17 10" />
					<line x1="12" y1="15" x2="12" y2="3" />
				</svg>
				Download PDF
			</a>
		</div>

		<!-- ═══ HEADER ═══ -->
		<header class="cv-section text-center">
			<h1
				bind:this={nameEl}
				class="cv-name text-4xl tracking-wide text-text sm:text-5xl"
				style="perspective: 400px;"
			>
				{personal.name.toUpperCase()}
			</h1>

			<p class="mt-3 text-lg text-text-secondary">Data Science & Software Engineering</p>

			<!-- Contact row -->
			<div
				class="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-text-muted"
			>
				<span class="flex items-center gap-1.5">
					<svg
						class="h-3.5 w-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle
							cx="12"
							cy="10"
							r="3"
						/>
					</svg>
					{personal.location}
				</span>
				<a
					href="mailto:omerekmenn@gmail.com"
					class="flex items-center gap-1.5 transition-colors hover:text-accent"
				>
					<svg
						class="h-3.5 w-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="2" y="4" width="20" height="16" rx="2" /><path
							d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
						/>
					</svg>
					omerekmenn@gmail.com
				</a>
				<a
					href={personal.website}
					class="flex items-center gap-1.5 transition-colors hover:text-accent"
				>
					<svg
						class="h-3.5 w-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path
							d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
						/>
					</svg>
					omerekmen.com
				</a>
				<a
					href={personal.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-1.5 transition-colors hover:text-accent"
				>
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
						/>
					</svg>
					LinkedIn
				</a>
				<a
					href={personal.github}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-1.5 transition-colors hover:text-accent"
				>
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
						/>
					</svg>
					GitHub
				</a>
			</div>

			<div class="mx-auto mt-5 h-px w-24 bg-accent/40"></div>
		</header>

		<!-- ═══ SUMMARY ═══ -->
		<section class="cv-section mt-12">
			<h2 class="section-title">Summary</h2>
			<p class="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">{summary}</p>
		</section>

		<!-- ═══ EDUCATION ═══ -->
		<section class="cv-section mt-12">
			<h2 class="section-title">Education</h2>
			<div class="mt-6 border-l-2 border-accent/20 pl-6">
				<div class="relative">
					<div class="timeline-dot"></div>
					<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
						<h3 class="text-base font-bold text-text">{education.degree}</h3>
						<span class="font-mono text-xs tracking-wider text-text-muted">{education.period}</span>
					</div>
					<p class="mt-1 text-sm text-text-secondary italic">
						{education.school} — {education.location}
						<span class="text-text-muted not-italic">| GPA: {education.gpa}</span>
					</p>
					<ul class="mt-4 flex flex-col gap-3">
						{#each education.details as detail (detail.label)}
							<li class="text-sm leading-relaxed text-text-secondary">
								<span class="font-semibold text-text">{detail.label}:</span>
								{detail.text}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>

		<!-- ═══ EXPERIENCE ═══ -->
		<section class="cv-section mt-12">
			<h2 class="section-title">Experience</h2>
			<div class="mt-6 flex flex-col gap-10">
				{#each experience as job (job.company)}
					<div class="relative border-l-2 border-accent/20 pl-6">
						<div class="timeline-dot"></div>
						<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
							<h3 class="text-base font-bold text-text">{job.role}</h3>
							<span class="font-mono text-xs tracking-wider text-text-muted">{job.period}</span>
						</div>
						<p class="mt-1 text-sm text-text-secondary italic">{job.company} — {job.location}</p>
						<ul class="mt-4 flex flex-col gap-2">
							{#each job.bullets as bullet (bullet)}
								<li
									class="experience-bullet relative pl-4 text-sm leading-relaxed text-text-secondary"
								>
									<span class="absolute top-[0.55em] left-0 h-1 w-1 rounded-full bg-accent/50"
									></span>
									{bullet}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</section>

		<!-- ═══ PROJECTS ═══ -->
		<section class="cv-section mt-12">
			<h2 class="section-title">Projects</h2>
			<div class="mt-6 flex flex-col gap-6">
				{#each projects as project (project.name)}
					<div
						class="project-card rounded-xl border border-border-subtle bg-bg-secondary/30 p-5 transition-all duration-200 hover:border-accent/20 hover:bg-bg-secondary/60"
					>
						<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
							<h3 class="text-base font-bold text-text">{project.name}</h3>
							{#if project.github}
								<a
									href={project.github}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-1.5 font-mono text-xs text-accent transition-colors hover:text-accent-hover"
								>
									<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
										/>
									</svg>
									GitHub
								</a>
							{:else if project.meta}
								<span class="font-mono text-xs text-text-muted">{project.meta}</span>
							{/if}
						</div>
						<ul class="mt-3 flex flex-col gap-2">
							{#each project.bullets as bullet (bullet)}
								<li class="relative pl-4 text-sm leading-relaxed text-text-secondary">
									<span class="absolute top-[0.55em] left-0 h-1 w-1 rounded-full bg-accent/50"
									></span>
									{bullet}
								</li>
							{/each}
						</ul>
						<div class="mt-4 flex flex-wrap gap-1.5">
							{#each project.stack as tech (tech)}
								<span
									class="skill-pill rounded-full border border-border-subtle bg-bg-tertiary/50 px-2.5 py-0.5 font-mono text-[10px] font-medium text-text-muted"
								>
									{tech}
								</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- ═══ TECHNICAL SKILLS ═══ -->
		<section class="cv-section mt-12">
			<h2 class="section-title">Technical Skills</h2>
			<div class="mt-6 flex flex-col gap-5">
				{#each skills as group (group.category)}
					<div class="skill-group">
						<h3 class="font-mono text-xs font-semibold tracking-wider text-accent uppercase">
							{group.category}
						</h3>
						<div class="mt-2.5 flex flex-wrap gap-2">
							{#each group.items as item (item)}
								<span
									class="skill-pill rounded-full border border-border-subtle bg-bg-secondary/60 px-3 py-1.5 text-xs font-medium text-text-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
								>
									{item}
								</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- ═══ CERTIFICATIONS ═══ -->
		<section class="cv-section mt-12">
			<h2 class="section-title">Certifications</h2>
			<div class="mt-4">
				{#each certifications as cert (cert.name)}
					<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
						<div>
							<span class="text-sm font-bold text-text">{cert.name}</span>
							<span class="text-sm text-text-muted"> — {cert.issuer}, {cert.date}</span>
						</div>
						<a
							href={cert.url}
							target="_blank"
							rel="noopener noreferrer"
							class="font-mono text-xs text-accent transition-colors hover:text-accent-hover"
						>
							Credential: {cert.credential}
						</a>
					</div>
				{/each}
			</div>
		</section>

		<!-- ═══ LANGUAGES ═══ -->
		<section class="cv-section mt-12 mb-16">
			<h2 class="section-title">Languages</h2>
			<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{#each languages as lang (lang.name)}
					<div class="rounded-xl border border-border-subtle bg-bg-secondary/30 p-4">
						<h3 class="text-sm font-bold text-text">{lang.name}</h3>
						<p class="mt-1 text-xs text-text-muted">{lang.level}</p>
						<div class="mt-3 flex gap-1.5">
							{#each { length: 5 } as _item, i (i)}
								<span
									class="h-2 w-2 rounded-full {i < lang.dots ? 'bg-accent' : 'bg-border-subtle'}"
								></span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	/* ── Name ── */
	.cv-name {
		font-family: 'Bagel Fat One', sans-serif;
	}

	/* ── Section titles ── */
	.section-title {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-accent);
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border-subtle);
	}

	/* ── Timeline dots ── */
	.timeline-dot {
		position: absolute;
		top: 6px;
		left: -25px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-accent);
		border: 2px solid var(--color-bg);
		box-shadow: 0 0 0 2px rgba(var(--color-accent-rgb), 0.3);
	}

	/* ── Print styles ── */
	@media print {
		:global(body) {
			background: white !important;
			color: black !important;
		}

		:global(#smooth-wrapper) {
			position: static !important;
			overflow: visible !important;
		}

		:global(header),
		:global(.cursor-dot),
		:global(.cursor-ring) {
			display: none !important;
		}

		.cv-section {
			break-inside: avoid;
		}

		.section-title {
			color: #333 !important;
			border-color: #ccc !important;
		}

		.cv-name {
			color: #1a1a1a !important;
		}

		.skill-pill {
			border-color: #ddd !important;
			background: #f5f5f5 !important;
			color: #333 !important;
		}

		.timeline-dot {
			background: #333 !important;
			box-shadow: none !important;
			border-color: white !important;
		}

		.project-card {
			border-color: #ddd !important;
			background: #fafafa !important;
		}
	}
</style>
