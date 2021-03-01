<svelte:head>
	<meta name="doc-rights" content="Copywritten Work" />
	<meta name="owner" content={owner} />
	<meta name="copyright" {content} />
</svelte:head>

<div class="copyright">
	<div class="copyright-notice">
		<nobr>
			© {year}
			{owner}
		</nobr>
	</div>
	<div class="tagline" class:hide={!(tagline?.length > 0)}>
		{tagline}
	</div>
</div>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## **/
	let owner = $milk?.site?.organization || '';
	let tagline = $milk?.site?.tagline || '';
	const year = new Date()?.getFullYear();
	let content = '© Copywritten Work.  All rights reserved.';
	$: content = `© Copyright ${year} - ${owner} - All rights reserved. Reproduction of this publication in any form without prior written permission is forbidden.`;
	/* ## Exports ## **/
	export { owner, tagline };
</script>

<style>
	.tagline::before {
		content: '-';
		display: inline-block;
		padding: 0 5px;
	}
	.hide {
		display: none;
	}
</style>
