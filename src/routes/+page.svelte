<script lang="ts">
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import WorkSection from '$lib/components/sections/WorkSection.svelte';
	import ContactFooter from '$lib/components/layout/ContactFooter.svelte';
</script>

<svelte:head>
	<title>Ömer Ekmen — Data Science & Software Engineering</title>
	<meta
		name="description"
		content="Portfolio of Ömer Ekmen — Data Scientist and Software Engineer. Mathematics graduate building data-driven systems, ML models, and full-stack platforms."
	/>
	<meta name="keywords" content="Ömer Ekmen, Data Scientist, Software Engineer, Machine Learning, Python, Rust, SvelteKit, Portfolio, Istanbul" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.omerekmen.com/" />
	<meta property="og:title" content="Ömer Ekmen — Data Science & Software Engineering" />
	<meta property="og:description" content="Mathematics graduate building data-driven systems, ML models, and full-stack platforms. End-to-end ownership from data modeling to production deployment." />
	<meta property="og:image" content="https://www.omerekmen.com/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Ömer Ekmen" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Ömer Ekmen — Data Science & Software Engineering" />
	<meta name="twitter:description" content="Mathematics graduate building data-driven systems, ML models, and full-stack platforms." />
	<meta name="twitter:image" content="https://www.omerekmen.com/og-image.png" />

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Person",
		"name": "Ömer Ekmen",
		"url": "https://www.omerekmen.com",
		"jobTitle": "Data Scientist & Software Engineer",
		"description": "Mathematics graduate from Galatasaray University building data-driven systems and backend solutions.",
		"email": "mailto:omerekmenn@gmail.com",
		"address": { "@type": "PostalAddress", "addressLocality": "Istanbul", "addressCountry": "TR" },
		"alumniOf": { "@type": "CollegeOrUniversity", "name": "Galatasaray University" },
		"knowsLanguage": ["Turkish", "English", "French"],
		"sameAs": [
			"https://github.com/omerekmen",
			"https://linkedin.com/in/omerekmenn"
		]
	})}</script>`}
</svelte:head>

<HeroSection />
<WorkSection />
<!-- <ContactFooter /> -->
