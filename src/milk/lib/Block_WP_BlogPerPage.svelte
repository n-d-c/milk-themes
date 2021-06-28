<div class="blog-perpage">
	<div class="blog-perpage-inner">
		<label for="perpage">Per Page:</label>
		<select name="perpage" bind:value={size} on:change={scrollToTop}>
			{#each options as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { scrollToElement } from '$milk/util/scroll.js';
	/* ## Vairables ## */
	let size = 10;
	let options = [1, 10, 20, 50, 100];
	const scrollToTop = () => {
		let element = document.getElementById('BlogTop');
		if (element) {
			scrollToElement(document.getElementById('BlogTop'));
		}
	};
	let setSize = () => {};
	$: {
		setSize(size);
	}
	onMount(async () => {
		let tmpSize = window.localStorage.getItem('size');
		if (tmpSize) {
			size = parseInt(tmpSize);
		}
		setSize = (s) => {
			window.localStorage.setItem('size', size);
			console.log({ size: size });
		};
	});
	export { size, options };
</script>

<style>
</style>
