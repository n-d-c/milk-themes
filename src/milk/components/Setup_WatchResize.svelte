<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Main ## */
	onMount(async () => {
		let w = innerWidth;
		let h = innerHeight;
		document?.documentElement?.style?.setProperty?.('--viewport-width', w);
		$milk.browser.viewport_width = w;
		document?.documentElement?.style?.setProperty?.('--viewport-height', h);
		$milk.browser.viewport_height = h;
		window?.addEventListener?.('resize', (e) => {
			let w = innerWidth;
			let h = innerHeight;
			document?.documentElement?.style?.setProperty?.(
				'--viewport-width',
				w
			);
			$milk.browser.viewport_width = w;
			document?.documentElement?.style?.setProperty?.(
				'--viewport-height',
				h
			);
			$milk.browser.viewport_height = h;
		});
	});
</script>
