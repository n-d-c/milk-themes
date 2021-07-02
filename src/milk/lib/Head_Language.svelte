<svelte:head>
	<meta http-equiv="content-language" content={lang} />
</svelte:head>

<script>
	/* ## Svelte ## */
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## **/
	let lang = 'en';
	$: lang ||= $milk?.config?.lang || 'en';
	onMount(async () => {
		document.documentElement.setAttribute('lang', lang);
	});
	/* ## Exports ## **/
	export { lang };
</script>
