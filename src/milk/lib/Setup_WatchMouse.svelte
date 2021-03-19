<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Main ## */
	onMount(async () => {
		document?.documentElement?.style?.setProperty?.('--mouse-x', 0);
		$milk.browser.mouse_x = 0;
		document?.documentElement?.style?.setProperty?.('--mouse-y', 0);
		$milk.browser.mouse_y = 0;
		document?.addEventListener?.('mousemove', (e) => {
			let x = e?.clientX / innerWidth;
			let y = e?.clientY / innerHeight;
			document?.documentElement?.style?.setProperty?.('--mouse-x', x);
			$milk.browser.mouse_x = x;
			document?.documentElement?.style?.setProperty?.('--mouse-y', y);
			$milk.browser.mouse_y = y;
		});
	});
</script>
