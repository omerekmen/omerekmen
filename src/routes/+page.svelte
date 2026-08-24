<script lang="ts">
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import WorkSection from '$lib/components/sections/WorkSection.svelte';
	import { personal } from '$lib/data/personal';
	import { experiences } from '$lib/data/experience';

	const title = `${personal.name} — ${personal.title}`;
	const description =
		'Engineer building production data pipelines on Microsoft Fabric and Azure Data Factory, and enterprise backend systems in .NET and Python. Mathematics graduate, Galatasaray University.';

	const currentRole = experiences.find((e) => e.current) ?? experiences[0];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: personal.name,
		url: personal.website,
		jobTitle: currentRole.role,
		description,
		email: `mailto:${personal.email}`,
		telephone: personal.phone,
		address: { '@type': 'PostalAddress', addressLocality: 'Istanbul', addressCountry: 'TR' },
		worksFor: { '@type': 'Organization', name: currentRole.company },
		alumniOf: { '@type': 'CollegeOrUniversity', name: 'Galatasaray University' },
		knowsLanguage: ['Turkish', 'French', 'English'],
		knowsAbout: [
			'Data Engineering',
			'Microsoft Fabric',
			'Azure Data Factory',
			'ETL',
			'.NET',
			'Python',
			'SQL',
			'Backend Development'
		],
		sameAs: [personal.github, personal.linkedin]
	};

	// Serialised from our own static data — no user input reaches this string.
	const jsonLdTag = `<script type="application/ld+json">${JSON.stringify(jsonLd)}${'<'}/script>`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="Ömer Ekmen, Data Engineer, Software Engineer, Microsoft Fabric, Azure Data Factory, .NET, Python, SQL, ETL, Data Pipelines, Istanbul"
	/>

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{personal.website}/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{personal.website}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content={personal.name} />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{personal.website}/og-image.png" />

	<!-- Structured Data (JSON-LD) -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdTag}
</svelte:head>

<HeroSection />
<WorkSection />
