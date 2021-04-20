<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { browser } from '$milk/milk.js';
	/* ## Main ## */
	onMount(async () => {
		document?.documentElement?.style?.setProperty?.('--mouse-x', 0);
		$browser.mouse_x = 0;
		document?.documentElement?.style?.setProperty?.('--mouse-y', 0);
		$browser.mouse_y = 0;
		document?.documentElement?.style?.setProperty?.('--mouse-xfm', 0);
		$browser.mouse_xfm = 0;
		document?.documentElement?.style?.setProperty?.('--mouse-yfm', 0);
		$browser.mouse_yfm = 0;
		document?.addEventListener?.('mousemove', (e) => {
			let x = e?.clientX / innerWidth;
			let y = e?.clientY / innerHeight;
			let xfm = x * 2 - 1;
			let yfm = y * 2 - 1;
			document?.documentElement?.style?.setProperty?.('--mouse-x', x);
			$browser.mouse_x = x;
			document?.documentElement?.style?.setProperty?.('--mouse-y', y);
			$browser.mouse_y = y;
			document?.documentElement?.style?.setProperty?.('--mouse-xfm', xfm);
			$browser.mouse_xfm = xfm;
			document?.documentElement?.style?.setProperty?.('--mouse-yfm', yfm);
			$browser.mouse_yfm = yfm;
		});
	});
</script>
