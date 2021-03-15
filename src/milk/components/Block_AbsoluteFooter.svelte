<footer {id} class="absolute-footer">
	<div class="absolute-footer-inner">
		<div>
			<slot name="middle">
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
			</slot>
		</div>
		<Copyright
			owner={$milk?.site?.organization || 'Milk.js'}
			tagline={$milk?.site?.tagline || 'Milk, it does a website good.'}
		/>
		<Credits
			name={$milk?.credits?.name}
			url={$milk?.credits?.url}
			email={$milk?.credits?.email}
			credit_milk={$milk?.config?.credit?.milk}
			credit_svelte={$milk?.config?.credit?.svelte}
			credit_graphql={$milk?.config?.credit?.graphql}
			credit_snowpack={$milk?.config?.credit?.snowpack}
		/>
	</div>
</footer>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Imports ## */
	import Copyright from '$milk_components/Copyright.svelte';
	import Credits from '$milk_components/Credits.svelte';
	import ToTop from '$milk_components/ToTop.svelte';
	let id;
	export { id };
</script>

<style>
	.top-link {
		display: block;
	}
</style>
