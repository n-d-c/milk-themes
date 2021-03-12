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
</Head_Extra>
<app data-theme={$milk?.theme?.slug} class={$milk?.theme?.slug}><slot /></app>

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
</script>

<style>
	app {
		display: block;
		min-height: calc(100vh);
	}
</style>
