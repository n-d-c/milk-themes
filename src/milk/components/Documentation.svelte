<div class="documentation">
	<Hero>
		{#if logo}<img src={logo} alt={title} />{/if}
		{#if title}<h1>{title}</h1>{/if}
		{#if tagline}<h2>{tagline}</h2>{/if}
		{#if excerpt}<p>{excerpt}</p>{/if}
	</Hero>
	<slot>
		<h2>Documentation Will Go Here</h2>
	</slot>
</div>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Hero from '$milk_components/Hero.svelte';
	/* ## Variables ## */
	let title;
	let tagline;
	let excerpt;
	let logo;
	$: title ||= $milk?.credits?.title || '';
	$: tagline ||= $milk?.credits?.tagline || '';
	$: excerpt ||= $milk?.credits?.excerpt || '';
	$: logo ||= $milk?.credits?.logo || '';
	/* ## Exports ## */
	export { title, tagline, excerpt, logo };
</script>

<style>
	img {
		width: 20vw;
		height: auto;
		margin: 0;
		position: relative;
		min-width: 100px;
	}
</style>
