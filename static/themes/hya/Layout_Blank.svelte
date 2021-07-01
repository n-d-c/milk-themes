<div {id} class="layout-blank">
	<div class="page-content"><slot /></div>
	<!-- <Block_GoogleTagManager /> -->
</div>

<script>
	import Block_GoogleTagManager from '$theme/Block_GoogleTagManager.svelte';
	let id;
	export { id };
</script>

<style>
	.layout-blank,
	.page-content {
		display: block;
	}
</style>
