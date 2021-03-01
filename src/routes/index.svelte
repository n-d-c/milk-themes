<Head_Language lang="en" />
<Head_HTML
	title="DevLove - Milk"
	description="Milk Website Booster"
	keywords="Milk, Website"
/>
<Head_Facebook />
<Head_Twitter />
<div class="page">
	<div class="hero gradient-hero gradient-main">
		<img src="/img/logo.svg" alt="Milk.js - It does a website good." />
		<h1><span class="hide">MILK - </span>It does a website good.</h1>
	</div>
	TEST {$milk.hello}
	<div>{$milk?.site?.title}</div>
	<div>{$milk?.theme?.theme}</div>
</div>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Head_Language from '$milk_components/Head_Language.svelte';
	import Head_HTML from '$milk_components/Head_HTML.svelte';
	import Head_Facebook from '$milk_components/Head_Facebook.svelte';
	import Head_Twitter from '$milk_components/Head_Twitter.svelte';
</script>

<style>
	.hero {
		width: 100%;
		height: calc(100vw / 16 * 9);
		display: grid;
		place-content: center;
	}
	.hero img {
		width: 20vw;
		height: auto;
		margin: 0 -12% 0 12%;
		position: relative;
		min-width: 100px;
	}
	h1 {
		color: var(--color-white, #fff);
	}
	/* .page {
		display: block;
	}
	.page h1 {
		color: var(--color-white, #fff);
	} */
</style>
