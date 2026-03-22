<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import About from '$lib/components/sections/About.svelte';
	import Experience from '$lib/components/sections/Experience.svelte';
	import Projects from '$lib/components/sections/Projects.svelte';
	import Skills from '$lib/components/sections/Skills.svelte';
	import Education from '$lib/components/sections/Education.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';
	import { personal } from '$lib/data/personal';
</script>

<svelte:head>
	<title>Ömer Ekmen — Data Science & Software Engineering</title>
	<meta
		name="description"
		content="Portfolio of Ömer Ekmen — Data Scientist and Software Engineer building data-driven systems with Rust, Python, and SvelteKit. Based in Istanbul, Turkey."
	/>

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Ömer Ekmen — Data Science & Software Engineering" />
	<meta
		property="og:description"
		content="Data Scientist and Software Engineer building data-driven systems with Rust, Python, and SvelteKit."
	/>
	<meta property="og:url" content={personal.website} />
	<meta property="og:site_name" content="Ömer Ekmen" />
	<meta property="og:locale" content="en" />
	<meta property="og:locale:alternate" content="tr" />
	<meta property="og:locale:alternate" content="fr" />
	<meta property="og:locale:alternate" content="de" />
	<meta property="og:locale:alternate" content="es" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Ömer Ekmen — Data Science & Software Engineering" />
	<meta
		name="twitter:description"
		content="Data Scientist and Software Engineer building data-driven systems with Rust, Python, and SvelteKit."
	/>

	<!-- Preload fonts -->
	<link
		rel="preload"
		href="/fonts/Inter-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/JetBrainsMono-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<Hero />
<About />
<Experience />
<Projects />
<Skills />
<Education />
<Contact />
