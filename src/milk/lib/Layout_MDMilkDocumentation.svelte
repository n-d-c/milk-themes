<Documentation {title} {tagline} {excerpt} {logo}>
	<h2>Milk.js</h2>
	<pre><strong>Milk Version:</strong> {$milk?.version} on {$milk?.date}</pre>
	<p>
		<a href={$milk?.credits?.url} title="Milk.js">
			{$milk?.credits?.url}
		</a>
	</p>
	<hr />
	<slot />
</Documentation>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Documentation from '$milk/lib/Documentation.svelte';
	// import Hero from '$milk/lib/Hero.svelte';
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
</style>
