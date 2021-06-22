<div {id} class="layout-blank">
	<div class="page-content"><slot /></div>
</div>

<script>
	let id;
	export { id };
</script>

<style>
	.layout-blank,
	.page-content {
		display: block;
	}
</style>
