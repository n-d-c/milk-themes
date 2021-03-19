<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Main ## */
	onMount(async () => {
		let y = window?.pageYOffset ?? 0;
		let x = window?.pageXOffset ?? 0;
		let yd = window?.pageYOffset ? 'down' : 'up';
		let xd = window?.pageXOffset ? 'right' : 'left';
		document?.documentElement?.style?.setProperty?.('--scroll-y', y);
		$milk.browser.scroll_y = y;
		document?.documentElement?.style?.setProperty?.('--scroll-y-last', y);
		$milk.browser.scroll_y_last = y;
		document?.documentElement?.style?.setProperty?.(
			'--scroll-y-direction',
			yd
		);
		$milk.browser.scroll_y_direction = yd;
		if (yd == 'down') {
			document?.querySelector('body')?.classList?.remove('scroll-up');
			document?.querySelector('body')?.classList?.add('scroll-down');
		} else {
			document?.querySelector('body')?.classList?.remove('scroll-down');
			document?.querySelector('body')?.classList?.add('scroll-up');
		}
		document?.documentElement?.style?.setProperty?.('--scroll-x', x);
		$milk.browser.scroll_x = x;
		document?.documentElement?.style?.setProperty?.('--scroll-x-last', x);
		$milk.browser.scroll_x_last = x;
		document?.documentElement?.style?.setProperty?.(
			'--scroll-x-direction',
			xd
		);
		$milk.browser.scroll_x_direction = xd;
		if (xd == 'right') {
			document?.querySelector('body')?.classList?.remove('scroll-left');
			document?.querySelector('body')?.classList?.add('scroll-right');
		} else {
			document?.querySelector('body')?.classList?.remove('scroll-right');
			document?.querySelector('body')?.classList?.add('scroll-left');
		}
		window.addEventListener('scroll', () => {
			let y = window?.pageYOffset ?? 0;
			let x = window?.pageXOffset ?? 0;
			let ly = document?.documentElement?.style?.getPropertyValue?.(
				'--scroll-y'
			);
			let lx = document?.documentElement?.style?.getPropertyValue?.(
				'--scroll-x'
			);
			let yd = y > ly ? 'down' : 'up';
			let xd = x > lx ? 'right' : 'left';
			document?.documentElement?.style?.setProperty?.('--scroll-y', y);
			$milk.browser.scroll_y = y;
			document?.documentElement?.style?.setProperty?.(
				'--scroll-y-last',
				y
			);
			$milk.browser.scroll_y_last = y;
			document?.documentElement?.style?.setProperty?.(
				'--scroll-y-direction',
				yd
			);
			$milk.browser.scroll_y_direction = yd;
			if (yd == 'down') {
				document?.querySelector('body')?.classList?.remove('scroll-up');
				document?.querySelector('body')?.classList?.add('scroll-down');
			} else {
				document
					?.querySelector('body')
					?.classList?.remove('scroll-down');
				document?.querySelector('body')?.classList?.add('scroll-up');
			}
			document?.documentElement?.style?.setProperty?.('--scroll-x', x);
			$milk.browser.scroll_x = x;
			document?.documentElement?.style?.setProperty?.(
				'--scroll-x-last',
				x
			);
			$milk.browser.scroll_x_last = x;
			document?.documentElement?.style?.setProperty?.(
				'--scroll-x-direction',
				xd
			);
			$milk.browser.scroll_x_direction = xd;
			if (xd == 'right') {
				document
					?.querySelector('body')
					?.classList?.remove('scroll-left');
				document?.querySelector('body')?.classList?.add('scroll-right');
			} else {
				document
					?.querySelector('body')
					?.classList?.remove('scroll-right');
				document?.querySelector('body')?.classList?.add('scroll-left');
			}
		});
	});
</script>
