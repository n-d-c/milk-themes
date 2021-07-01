<Head_Language lang="en" />
<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />
<Head_Facebook {title} {description} image="/img/hero_blog_01.jpg" />
<Head_Twitter {title} {description} image="/img/hero_blog_01.jpg" />
<Layout_Main id="pages" />

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Head_Language from '$milk/lib/Head_Language.svelte';
	import Head_HTML from '$milk/lib/Head_HTML.svelte';
	import Head_Facebook from '$milk/lib/Head_Facebook.svelte';
	import Head_Twitter from '$milk/lib/Head_Twitter.svelte';
	import Layout_Main from '$theme/Layout_Main.svelte';
	const title = `Immigration Blog - ${$milk?.site?.title}`;
	const description =
		'Immigration law is a constantly changing legal field. Immigration lawyer Harlan York provides this blog so you can stay up to date on how legal trends affect immigration law cases.';
	onMount(async () => {
		window.location.href = '/';
	});
</script>

<style>
	.content {
		text-align: center;
	}
	.title {
		position: relative;
		margin-bottom: -100px;
	}
	.controls,
	.pagination {
		display: block;
		padding: 50px var(--padding-inner, 20px) 0px;
		color: var(--color-black, #000);
	}
	.controls-inner,
	.pagination-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
		padding: 0 var(--padding);
	}
	.pagination,
	.pagination-inner {
		margin-bottom: 50px;
		text-align: left;
	}
</style>
