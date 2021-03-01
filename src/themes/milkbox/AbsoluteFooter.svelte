<footer class="absolute-footer">
	<div class="absolute-footer-inner">
		<ToTop>
			<img
				src="/img/icon-triangle-up.svg"
				width="18"
				height="29"
				alt="To Top"
				loading="lazy"
				class="icon-top"
			/>
			<a
				class="top-link"
				href="#TopLinkAnchor"
				title="Link to top of page.">TOP</a
			>
		</ToTop>
		<Copyright
			owner={$milk?.site?.organization || 'Milk.js'}
			tagline={$milk?.site?.tagline || 'Milk, it does a website good.'}
		/>
		<Credits
			name="Milk"
			url="https://milkjs.com/themes/blank"
			email="info@milkjs.com"
			credit_milk={true}
			credit_svelte={true}
			credit_graphql={true}
		/>
	</div>
</footer>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Imports ## */
	import Copyright from '$milk_components/Copyright.svelte';
	import Credits from '$milk_components/Credits.svelte';
	import ToTop from '../../milk/components/ToTop.svelte';
</script>

<style>
	.top-link {
		display: block;
	}
	.icon-top {
		filter: invert(1);
		margin-bottom: -5px;
	}
</style>
