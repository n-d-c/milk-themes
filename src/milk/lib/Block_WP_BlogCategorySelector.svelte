<div class="blog-categories">
	<label for="blog_category">Category:</label>
	<select name="blog_category" bind:value={category}>
		<option value=""> All </option>
		{#each blog_categories as blog_category}
			<option value={blog_category.name}>
				{blog_category.name}
			</option>
		{/each}
	</select>
</div>

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Vairables ## */
	let category;
	let size = 99;
	let blog_categories = [];
	/* ## Data Loading ## */
	let unsubscribe_blogcategories = () => {};
	import { Q_GET_POST_CATEGORIES } from '$graphql/wordpress.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		let queryVariables = {
			size: size,
		};
		let getBlogCategories = $milk?.data?.gql(
			Q_GET_POST_CATEGORIES,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_blogcategories = await getBlogCategories?.subscribe(
			async (fetched_data) => {
				let data = await fetched_data;
				// console.log(data);
				blog_categories = data?.categories?.nodes;
			}
		);
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_blogcategories(); // important for garbage collection otherwise memory leak
	});
	export { category, size };
</script>

<style>
	select {
		width: 100%;
	}
</style>
