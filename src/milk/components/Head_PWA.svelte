<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta
		name="application-name"
		content="Harlan York & Associates – Immigration Attorneys"
	/>
	<link async rel="manifest" href="/manifest.json" />
	<link async href="/register-service-workers.js" rel="preload" as="script" />
	<script async src="/register-service-workers.js"></script>
	<meta name="theme-color" content={app_color} />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="apple-mobile-web-app-title" content={app_name} />
	<link
		async
		rel="apple-touch-startup-image"
		href="/ico/splash-1024x1024.png"
	/>
	<link
		async
		rel="apple-touch-icon"
		href="/ico/apple-touch-icon-152x152.png"
	/>
	<link
		async
		rel="apple-touch-icon-precomposed"
		sizes="57x57"
		href="/ico/apple-touch-icon-57x57.png"
	/>
	<link
		async
		rel="apple-touch-icon-precomposed"
		sizes="60x60"
		href="/ico/apple-touch-icon-60x60.png"
	/>
	<link
		async
		rel="apple-touch-icon-precomposed"
		sizes="72x72"
		href="/ico/apple-touch-icon-72x72.png"
	/>
	<link
		async
		rel="apple-touch-icon-precomposed"
		sizes="76x76"
		href="/ico/apple-touch-icon-76x76.png"
	/>
	<link
		async
		rel="apple-touch-icon-precomposed"
		sizes="114x114"
		href="/ico/apple-touch-icon-114x114.png"
	/>
	<link
		async
		rel="apple-touch-icon-precomposed"
		sizes="120x120"
		href="/ico/apple-touch-icon-120x120.png"
	/>
	<link
		async
		rel="apple-touch-icon-precomposed"
		sizes="144x144"
		href="/ico/apple-touch-icon-144x144.png"
	/>
	<link
		async
		rel="apple-touch-icon-precomposed"
		sizes="152x152"
		href="/ico/apple-touch-icon-152x152.png"
	/>
	<meta name="msapplication-TileColor" content={app_color} />
	<meta name="msapplication-TileImage" content="/ico/mstile-144x144.png" />
	<meta name="msapplication-TileImage" content="/ico/mstile-310x310.png" />
	<meta
		name="msapplication-square70x70logo"
		content="/ico/mstile-70x70.png"
	/>
	<meta
		name="msapplication-square150x150logo"
		content="/ico/mstile-150x150.png"
	/>
	<meta
		name="msapplication-wide310x150logo"
		content="/ico/mstile-310x150.png"
	/>
	<meta
		name="msapplication-square310x310logo"
		content="/ico/mstile-310x310.png"
	/>
</svelte:head>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## **/
	let app_name = 'PWA Application';
	let app_color = '#000';
	let app_background = '#000';
	$: app_name = app_name && app_name != '' ? app_name : $milk?.pwa?.app_name;
	$: app_color =
		app_color && app_color != '' ? app_color : $milk?.pwa?.app_color;
	$: app_background =
		app_background && app_background != ''
			? app_background
			: $milk?.pwa?.app_background;
	/* ## Exports ## **/
	export { app_name, app_color, app_background };
</script>
