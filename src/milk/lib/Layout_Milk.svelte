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
{#if $milk?.theme?.darkmode}
	<Setup_DarkMode />
{/if}
{#if $milk?.config?.watch_scroll !== false}
	<Setup_WatchScroll />
{/if}
{#if $milk?.config?.watch_resize !== false}
	<Setup_WatchResize />
{/if}
{#if $milk?.config?.watch_mouse !== false}
	<Setup_WatchMouse />
{/if}
{#if $milk?.config?.smoothscroll !== false}
	<Setup_SmoothScroll />
{/if}
{#if $milk?.config?.topanchor !== false}
	<Setup_TopAnchorLink />
{/if}
<app data-theme={$milk?.theme?.slug} class={$milk?.theme?.slug}><slot /></app>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Head_ContentType from '$milk/lib/Head_ContentType.svelte';
	import Head_Website from '$milk/lib/Head_Website.svelte';
	import Head_PWA from '$milk/lib/Head_PWA.svelte';
	import Head_Favicon from '$milk/lib/Head_Favicon.svelte';
	import Head_MilkCSS from '$milk/lib/Head_MilkCSS.svelte';
	import Head_Extra from '$milk/lib/Head_Extra.svelte';
	import Setup_DarkMode from '$milk/lib/Setup_DarkMode.svelte';
	import Setup_WatchScroll from '$milk/lib/Setup_WatchScroll.svelte';
	import Setup_WatchMouse from '$milk/lib/Setup_WatchMouse.svelte';
	import Setup_WatchResize from '$milk/lib/Setup_WatchResize.svelte';
	import Setup_SmoothScroll from '$milk/lib/Setup_SmoothScroll.svelte';
	import Setup_TopAnchorLink from '$milk/lib/Setup_TopAnchorLink.svelte';
</script>

<style>
	app {
		display: block;
		min-height: calc(100vh);
	}
</style>
