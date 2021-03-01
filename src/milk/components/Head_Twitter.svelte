<svelte:head>
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={domain} />
	<meta property="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<slot />
</svelte:head>

<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## **/
	let url;
	let domain;
	let image;
	let title;
	let description;
	let win_location = '';
	let win_domain = '';
	/* ## Observables ## */
	$: image = image && image != '' ? image : $milk?.site?.twitter_photo;
	$: title = title && title != '' ? title : $milk?.site?.title;
	$: description =
		description && description != ''
			? description
			: $milk?.site?.description;
	$: url = win_location;
	$: domain = win_domain;
	/* ## Main ## */
	onMount(async () => {
		win_location =
			window && window?.location?.href?.length > 0
				? window?.location?.href
				: $milk?.site?.url;
		win_domain =
			window && window?.location?.host?.length > 0
				? window?.location?.host
				: $milk?.site?.domain;
	});
	/* ## Exports ## **/
	export { image, title, description };
</script>
