<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import About from '$lib/components/sections/About.svelte';
	import Experience from '$lib/components/sections/Experience.svelte';
	import Projects from '$lib/components/sections/Projects.svelte';
	import Skills from '$lib/components/sections/Skills.svelte';
	import Education from '$lib/components/sections/Education.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';
</script>

<svelte:head>
	<title>Ömer Ekmen — Data Science & Software Engineering</title>
	<meta
		name="description"
		content="Portfolio of Ömer Ekmen — Data Scientist and Software Engineer based in Istanbul, Turkey."
	/>
</svelte:head>

<Hero />
<About />
<Experience />
<Projects />
<Skills />
<Education />
<Contact />
