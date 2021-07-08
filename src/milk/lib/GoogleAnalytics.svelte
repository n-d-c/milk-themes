<svelte:head>
	<link rel="dns-prefetch" href="https://www.google-analytics.com" />
	<link
		rel="preload"
		href="https://www.google-analytics.com/analytics.js"
		as="script"
	/>
	<script async src="https://www.google-analytics.com/analytics.js"></script>
</svelte:head>

<script>
	import { onMount } from 'svelte';
	let gacode = 'UA-XXXXX-Y';
	let rootdomain = 'example.com';
	const GA_LOCAL_STORAGE_KEY = 'ga:clientId';
	const GA_COOKIE_KEY = 'gaCookie';
	onMount(async () => {
		if (window.localStorage) {
			ga('create', gacode, {
				storage: 'none',
				clientId: window.localStorage.getItem(GA_LOCAL_STORAGE_KEY),
			});
			ga(function (tracker) {
				window.localStorage.setItem(
					GA_LOCAL_STORAGE_KEY,
					tracker.get('clientId')
				);
			});
		} else {
			ga('create', gacode, {
				cookieName: GA_COOKIE_KEY,
				cookieDomain: rootdomain,
				cookieExpires: 60 * 60 * 24 * 28,
				cookieUpdate: 'false',
				cookieFlags: 'SameSite=None; Secure',
			});
		}
	});
	export { gacode, rootdomain };
</script>
