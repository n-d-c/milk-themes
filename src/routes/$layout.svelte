<Head_ContentType encoding="utf-8" mime_type="text/html" />

{#if $milk?.config?.pwa}
	<Head_PWA />
{:else}
	<Head_Website />
{/if}
<Head_Favicon />
<Head_MilkCSS />
<Head_Extra>
	<link rel="preconnect" href="https://google.com" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://storage.googleapis.com" />
	<link
		async
		href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap"
		rel="preload"
		as="style"
	/>
</Head_Extra>
<app>
	<AbsoluteHeader />
	<Header />
	<div class="content"><slot /></div>
	<Footer />
	<AbsoluteFooter />
</app>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Head_ContentType from '$milk_components/Head_ContentType.svelte';
	import Head_Website from '$milk_components/Head_Website.svelte';
	import Head_PWA from '$milk_components/Head_PWA.svelte';
	import Head_Favicon from '$milk_components/Head_Favicon.svelte';
	import Head_MilkCSS from '$milk_components/Head_MilkCSS.svelte';
	import Head_Extra from '$milk_components/Head_Extra.svelte';
	import AbsoluteHeader from '$site_theme/AbsoluteHeader.svelte';
	import Header from '$site_theme/Header.svelte';
	import Footer from '$site_theme/Footer.svelte';
	import AbsoluteFooter from '$site_theme/AbsoluteFooter.svelte';
</script>

<style>
	.content {
		display: block;
	}
	app {
		display: grid;
		margin: 0;
		padding: 0;
		min-height: calc(100vh);
		grid-template-rows: auto auto 1fr auto auto;
		z-index: 10;
	}
</style>
