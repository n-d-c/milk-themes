<div {id} class="layout-main">
	<Block_AbsoluteHeader />
	<Block_Header />
	<div class="page-content"><slot /></div>
	<Block_Footer />
	<Block_AbsoluteFooter id="footer-absolute" />
</div>

<script>
	import Block_AbsoluteHeader from '$lib/Block_AbsoluteHeader.svelte';
	import Block_Header from '$lib/Block_Header.svelte';
	import Block_Footer from '$lib/Block_Footer.svelte';
	import Block_AbsoluteFooter from '$lib/Block_AbsoluteFooter.svelte';
	let id;
	export { id };
</script>

<style>
	.layout-main {
		display: grid;
		margin: 0;
		padding: 0;
		min-height: calc(100vh);
		grid-template-rows: auto auto 1fr auto auto;
		z-index: 10;
	}

	.page-content {
		display: block;
	}
</style>
