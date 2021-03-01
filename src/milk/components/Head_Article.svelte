<svelte:head>
	<meta property="og:type" content="article" />
	<meta property="article:author" content={author} />
	<meta property="article:published_time" content={pubdate} />
	<meta name="author" type="article" content={author} />
	<slot />
</svelte:head>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## **/
	let author;
	let pubdate;
	/* ## Observables ## */
	$: pubdate =
		pubdate && pubdate != ''
			? new Date(pubdate).toISOString()
			: new Date().toISOString();
	$: author =
		author && author != ''
			? author
			: `${$milk?.site?.first_name} ${$milk?.site?.last_name}`;
	/* ## Exports ## **/
	export { author, pubdate };
</script>
