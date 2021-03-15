<Documentation {title} {tagline} {excerpt} {logo}>
	<h2>🥛Milk.js Browser Tests</h2>
	<pre><strong>Milk Version:</strong> {$milk?.version} on {$milk?.date}</pre>
</Documentation>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Documentation from '$milk_components/Documentation.svelte';
	import Toggle_DarkMode from '$milk_components/Toggle_DarkMode.svelte';
	// import ColorSwatch from '$milk_components/ColorSwatch.svelte';
	import ColorPallet from '$milk_components/ColorPallet.svelte';
	import Test_HTML_Headings from '$milk_components/Test_HTML_Headings.svelte';
	import Test_HTML_Lists from '$milk_components/Test_HTML_Lists.svelte';
	import Test_HTML_Tables from '$milk_components/Test_HTML_Tables.svelte';
	import Test_HTML_Content from '$milk_components/Test_HTML_Content.svelte';
	import Test_HTML_AdditionalContent from '$milk_components/Test_HTML_AdditionalContent.svelte';
	import Test_HTML_Forms from '$milk_components/Test_HTML_Forms.svelte';
	/* ## Variables ## */
	let title = 'Milk Browser Tests';
	let tagline = 'Testing various aspects of browsers and milk.';
	let excerpt = '';
	let logo = '/milk/img/logo_browser.svg';
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
	details.theme-documentation {
		max-width: 100%;
		border: var(--border-size) var(--border-style) var(--border-color);
		box-shadow: var(--box-shadow);
		margin: var(--gutter);
	}
	details.theme-documentation summary {
		padding-right: 2.2rem;
		padding-left: 1rem;
		background: var(--background);
		color: var(--text-color);
		border: 0px none;
	}
	details[open].theme-documentation > summary {
		border-bottom: var(--border-size) var(--border-style)
			var(--border-color);
	}
	details.theme-documentation summary :is(h1, h2, h3, h4, h5, h6) {
		margin: 0;
		padding: 0;
	}
	details.theme-documentation summary::before {
		content: '×';
		color: var(--text-color);
		font-size: 2rem;
		line-height: 1rem;
		transform: rotate(-45deg);
		top: 1.2rem;
		left: unset;
		right: 0.6rem;
	}
	details[open].theme-documentation > summary:before {
		transform: rotate(90deg);
		color: #f00 !important;
		transition: color ease 2s, transform ease 1s;
	}
	details.theme-documentation .content {
		border: 0 none;
		padding: var(--padding);
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
