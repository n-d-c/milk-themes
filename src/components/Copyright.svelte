<svelte:head>
	<meta name="doc-rights" content="Copywritten Work" />
	<meta name="owner" content={owner} />
	<meta name="copyright" {content} />
</svelte:head>

<div class="copyright">
	<nobr>
		© {year}
		{owner}
		{#if tagline != ''}
			<span class="dash">–</span> <wbr />
		{/if}
		{tagline}
	</nobr>
</div>

<script>
	/* ## WP ## */
	import { wp } from '$components/wp.js';
	/* ## Variables ## **/
	let owner = '';
	let tagline = '';
	const year = new Date()?.getFullYear();
	let content = '';
	$: owner = owner && owner != '' ? owner : $wp?.site?.organization;
	$: content = `© Copyright ${year} - ${owner} - All rights reserved. Reproduction of this publication in any form without prior written permission is forbidden.`;
	/* ## Exports ## **/
	export { owner, tagline };
</script>

<style>
	.copyright {
		line-height: 20px;
		vertical-align: middle;
		padding: 6px 0;
	}
	@media screen and (min-width: 650px) {
		.copyright {
			grid-area: l;
			text-align: left;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding-right: 50px;
			min-height: 50px;
		}
	}
	@media screen and (max-width: 649px) {
		.copyright {
			font-size: 14px;
			line-height: 18px;
		}
		.dash {
			display: inline;
		}
	}
	@media screen and (max-width: 350px) {
		.dash {
			display: none;
		}
	}
</style>
