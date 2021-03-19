<svelte:head>
	<meta http-equiv="content-language" content={lang} />
</svelte:head>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## **/
	let lang = 'en';
	$: lang ||= $milk?.config?.lang || 'en';
	// TODO: onmount switch the html container language.
	/* ## Exports ## **/
	export { lang };
</script>
