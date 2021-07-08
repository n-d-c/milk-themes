<div {id} class="layout-blank">
	<div class="page-content"><slot /></div>
	<GoogleAnalytics gacode="UA-5989226-33" rootdomain="immigrationlawnj.com" />
</div>

<script>
	import GoogleAnalytics from '$milk/lib/GoogleAnalytics.svelte';
	let id;
	export { id };
</script>

<style>
	.layout-blank,
	.page-content {
		display: block;
	}
</style>
