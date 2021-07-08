<svelte:head>
	<link rel="dns-prefetch" href="https://www.google-analytics.com" />
	<link rel="preload" href="https://www.google-analytics.com" as="script" />
	<script async src="https://www.google-analytics.com/analytics.js"></script>
</svelte:head>

<div class="google-analytics">
	{@html script_block}
</div>

<script>
	import { onMount } from 'svelte';
	let gacode = '';
	let script_block = '';
	onMount(async () => {
		script_block = '';
		window.ga =
			window.ga ||
			function () {
				(ga.q = ga.q || []).push(arguments);
			};
		ga.l = +new Date();
		ga('create', gacode, 'auto');
		ga('send', 'pageview');
	});
	export { gacode };
</script>
