<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<link rel="canonical" href={canonical} />
	<slot />
</svelte:head>

<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## **/
	let title;
	let description;
	let keywords;
	let canonical;
	let win_location = '';
	/* ## Observables ## */
	$: title = title?.length > 0 ? title : $milk?.site?.title;
	$: description =
		description?.length > 0 ? description : $milk?.site?.description;
	$: keywords = keywords?.length > 0 ? keywords : $milk?.site?.keywords;
	$: canonical = canonical?.length > 0 ? canonical : win_location;
	/* ## Main ## */
	onMount(async () => {
		win_location =
			window && window?.location?.href?.length > 0
				? window?.location?.href
				: $milk?.site?.url;
	});
	/* ## Exports ## **/
	export { title, description, keywords, canonical };
</script>
