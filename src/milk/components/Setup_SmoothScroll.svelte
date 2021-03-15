<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Main ## */
	onMount(async () => {
		const html = document?.querySelector('html');
		if (html?.scrollBehavior) {
			html.scrollBehavior = `smooth`;
		}
		$milk.browser.scrollToTop = scrollToTop;
		$milk.browser.scrollToElement = scrollToElement;
		$milk.browser.scrollToPosition = scrollToPosition;
	});
	export const scrollToTop = () => {
		window.scroll({ behavior: 'smooth', left: 0, top: -100 });
	};
	export const scrollToElement = (element) => {
		window.scroll({ behavior: 'smooth', left: 0, top: element.offsetTop });
	};
	export const scrollToPosition = (xPosition, yPosition) => {
		window.scroll({ behavior: 'smooth', left: xPosition, top: yPosition });
	};
</script>
