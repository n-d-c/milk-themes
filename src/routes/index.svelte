<Head_Language lang="en" />
<Head_HTML
	title="DevLove - Milk"
	description="Milk Website Booster"
	keywords="Milk, Website"
/>
<Head_Facebook />
<Head_Twitter />
<Layout_Main>
	<Hero>
		{#if logo}<img src={logo} alt={title} />{/if}
		{#if title}<h1>{title}</h1>{/if}
		{#if tagline}<h2>{tagline}</h2>{/if}
		{#if excerpt}<h3>{excerpt}</h3>{/if}
		{#if details}<p>{details}</p>{/if}
	</Hero>
	<h1>Welcome to Milk.js</h1>
	<div>
		<ul>
			<li>
				<a href="/documentation">Milk.js Documentation</a>
			</li>
			<li>
				<a href="/documentation/theme">
					Theme Documentation ({$milk?.theme?.name})
				</a>
			</li>
		</ul>
	</div>
</Layout_Main>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Head_Language from '$milk_components/Head_Language.svelte';
	import Head_HTML from '$milk_components/Head_HTML.svelte';
	import Head_Facebook from '$milk_components/Head_Facebook.svelte';
	import Head_Twitter from '$milk_components/Head_Twitter.svelte';
	import Layout_Main from '$site_theme/Layout_Main.svelte';
	import Hero from '$milk_components/Hero.svelte';
	/* ## Variables ## */
	let title;
	let tagline;
	let excerpt;
	let details;
	let logo;
	$: title ||= $milk?.credits?.title || '';
	$: tagline ||= $milk?.credits?.tagline || '';
	$: excerpt ||= $milk?.credits?.excerpt || '';
	$: details ||= $milk?.credits?.details || '';
	$: logo ||= $milk?.credits?.logo || '';
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
