<Documentation_Theme {title} {tagline} {excerpt} {logo}>
	<slot />
</Documentation_Theme>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Documentation_Theme from '$milk/lib/Documentation_Theme.svelte';
	import Toggle_DarkMode from '$milk/lib/Toggle_DarkMode.svelte';
	/* ## Variables ## */
	let title;
	let tagline;
	let excerpt;
	let logo;
	// let size = '45px';
	// let size_small = '20px';
	$: title ||= $milk?.theme?.name || '';
	$: tagline ||= $milk?.theme?.tagline || '';
	$: excerpt ||= $milk?.theme?.excerpt || '';
	$: logo ||=
		`/themes/${$milk?.theme?.slug}/logo_theme.svg` ||
		$milk?.credits?.logo ||
		'';
	/* ## Exports ## */
	export { title, tagline, excerpt, logo };
</script>

<style>
	.notices {
		display: block;
		border: var(--border-size) var(--border-style) var(--border-color);
		background: var(--background-color);
		color: var(--text-color);
		padding: var(--padding);
		margin: var(--gutter);
	}
	i {
		font-size: smaller;
	}
	.cols {
		display: grid;
		grid-template-columns: repeat(2, minmax(200px, 50%));
		margin: 0 auto;
		/* min-width: 200px;
			max-width: 500px; */
	}
	@media (max-width: 800px) {
		.cols {
			display: block;
		}
	}
</style>
