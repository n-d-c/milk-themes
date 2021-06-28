<div class="blog-search">
	<label for="blog_search">Search:</label>
	<input type="search" placeholder="Search For..." bind:value={search} />
</div>

<script>
	/* ## Svelte ## */
	import { onMount } from 'svelte';
	/* ## Vairables ## */
	let search;
	/* ## Main ## */
	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const s = urlParams.get('s');
		// console.log({ search: s });
		search = s;
	});
	export { search };
</script>

<style>
	/* */
</style>
