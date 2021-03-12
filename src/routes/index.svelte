<Head_Language lang="en" />
<Head_HTML
	title="DevLove - Milk"
	description="Milk Website Booster"
	keywords="Milk, Website"
/>
<Head_Facebook />
<Head_Twitter />
<Layout_Main>
	<Documentation />
	<h1>TEST {$milk.hello}</h1>
	<div>{$milk?.site?.title}</div>
	<div>{$milk?.theme?.theme}</div>
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
	import Documentation from '$site_theme/Documentation.svelte';
</script>

<style>
	h1 {
	}
</style>
