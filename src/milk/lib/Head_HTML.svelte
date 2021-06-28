<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<link rel="canonical" href={canonical} />
	<meta name="developer" content="Joshua Jarman (josh@redesigned.com)" />
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
	$: title ||= $milk?.site?.title || '';
	$: description ||= $milk?.site?.description || '';
	$: keywords ||= $milk?.site?.keywords || '';
	$: canonical ||= win_location || '';
	/* ## Main ## */
	onMount(async () => {
		win_location = window?.location?.href
			? window?.location?.href
			: $milk?.site?.url;
	});
	/* ## Exports ## **/
	export { title, description, keywords, canonical };
</script>
