<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { browser } from '$milk/milk.js';
	/* ## Main ## */
	onMount(async () => {
		let w = innerWidth;
		let h = innerHeight;
		document?.documentElement?.style?.setProperty?.('--viewport-width', w);
		$browser.viewport_width = w;
		document?.documentElement?.style?.setProperty?.('--viewport-height', h);
		$browser.viewport_height = h;
		window?.addEventListener?.('resize', (e) => {
			let w = innerWidth;
			let h = innerHeight;
			document?.documentElement?.style?.setProperty?.(
				'--viewport-width',
				w
			);
			$browser.viewport_width = w;
			document?.documentElement?.style?.setProperty?.(
				'--viewport-height',
				h
			);
			$browser.viewport_height = h;
		});
	});
</script>
