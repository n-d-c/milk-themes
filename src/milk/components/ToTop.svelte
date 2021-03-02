<button class="to-top" on:click={scrollToTop} title="Link to top of page.">
	<span class="top-link"><span><slot>Back To Top</slot></span></span>
</button>

<script>
	import { onMount } from 'svelte';
	onMount(async () => {
		setupSmoothScroll();
		setupTopLinkAnchor();
	});
	/* ## Setup SmoothScroll ## */
	const setupSmoothScroll = () => {
		const html = document?.querySelector('html');
		if (html?.scrollBehavior) {
			html.scrollBehavior = `smooth`;
		}
	};
	/* ## Setup TopLink Anchor ## */
	const setupTopLinkAnchor = () => {
		if (!document?.querySelector('#TopLinkAnchor')) {
			const a = document?.createElement('a');
			a.name = `TopLinkAnchor`;
			a.id = `TopLinkAnchor`;
			const body = document?.querySelector('body');
			if (body) {
				body?.insertBefore(a, body?.firstChild);
			}
		}
	};
	export const scrollToTop = () => {
		window?.scroll({ behavior: 'smooth', left: 0, top: -100 });
	};
</script>

<style>
	.to-top {
		display: block;
		cursor: pointer;
		border: 0 none;
		padding: 0;
		margin: 0 auto;
		background: none;
	}
	.to-top:focus,
	.to-top:active {
		outline: none;
	}
	.top-link {
		pointer-events: none;
		cursor: pointer;
	}
</style>
