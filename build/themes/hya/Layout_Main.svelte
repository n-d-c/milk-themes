<div {id} class="layout-main">
	<Block_Header id="header" blockstyle="block-style03" />
	<Block_Navigation id="main-nav" blockstyle="block-style03" />
	<div class="page-content"><slot /></div>
	<Block_Footer id="footer" blockstyle="block-style04" />
	<Block_AbsoluteFooter id="footer-absolute" blockstyle="block-style06" />
	<CalendarCard />
	<CallingCard />
	<Block_PaymentCard />
</div>

<script>
	// import Block_AbsoluteHeader from '$lib/Block_AbsoluteHeader.svelte';
	import Block_Header from '$theme/Block_Header.svelte';
	import Block_Navigation from '$theme/Block_Navigation.svelte';
	import Block_Footer from '$theme/Block_Footer.svelte';
	import Block_AbsoluteFooter from '$milk/lib/Block_AbsoluteFooter.svelte';
	import CalendarCard from '$milk/lib/CalendarCard.svelte';
	import CallingCard from '$milk/lib/CallingCard.svelte';
	import Block_PaymentCard from '$theme/Block_PaymentCard.svelte';
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
