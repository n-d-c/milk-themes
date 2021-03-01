<svelte:head>
	<meta property="og:url" content={url} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={$milk?.site?.title} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<slot />
</svelte:head>

<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## **/
	let url;
	let image;
	let type;
	let title;
	let description;
	let win_location = '';
	/* ## Observables ## */
	$: image = image && image != '' ? image : $milk?.site?.facebook_photo;
	$: title = title && title != '' ? title : $milk?.site?.title;
	$: type = type && type != '' ? type : $milk?.site?.facebook_type;
	$: description =
		description && description != ''
			? description
			: $milk?.site?.description;
	$: url = win_location;
	/* ## Main ## */
	onMount(async () => {
		win_location =
			window && window?.location?.href?.length > 0
				? window?.location?.href
				: $milk?.site?.url;
	});
	/* ## Exports ## **/
	export { image, type, title, description };
</script>
