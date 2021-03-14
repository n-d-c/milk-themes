<div class="layout-main">
	<AbsoluteHeader />
	<Header />
	<div class="page-content"><slot /></div>
	<Footer />
	<AbsoluteFooter />
</div>

<script>
	import AbsoluteHeader from '$shared_components/AbsoluteHeader.svelte';
	import Header from '$shared_components/Header.svelte';
	import Footer from '$shared_components/Footer.svelte';
	import AbsoluteFooter from '$shared_components/AbsoluteFooter.svelte';
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
