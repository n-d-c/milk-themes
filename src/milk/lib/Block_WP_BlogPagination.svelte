<div class="blog-pagination">
	<div class="blog-pagination-inner">
		{#if count > 0}
			<label for="pagination">Pages:</label>
			<select name="pagination" bind:value={page} on:change={scrollToTop}>
				{#each { length: pages } as _, i}
					<option value={i + 1}>{i + 1}</option>
				{/each}
			</select>
			of {pages}
		{/if}
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { scrollToElement } from '$milk/util/scroll.js';
	/* ## Vairables ## */
	let count;
	let offset = 0;
	let size = 10;
	let totalsize = 1;
	let page = 1;
	let pages = 0;
	let doPage = () => {};
	$: pages = parseInt(totalsize / count);
	$: page = parseInt(offset / size) + 1;
	$: {
		doPage(page);
	}
	const scrollToTop = () => {
		let element = document.getElementById('BlogTop');
		if (element) {
			scrollToElement(document.getElementById('BlogTop'));
		}
	};
	onMount(async () => {
		doPage = (page) => {
			offset = page * size - size;
		};
	});
	export { count, offset, size, totalsize };
</script>

<style>
</style>
