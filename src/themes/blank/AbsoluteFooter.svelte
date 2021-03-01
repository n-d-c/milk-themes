<footer class="absolute-footer">
	<div class="absolute-footer-inner">
		<Copyright
			owner={$milk?.site?.organization || 'MilkJS'}
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
</script>

<style>
	.absolute-footer {
	}
</style>
