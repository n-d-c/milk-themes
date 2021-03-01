<button class="to-top" on:click={scrollToTop} title="Link to top of page.">
	<span class="top-link"><span><slot>Back To Top</slot></span></span>
</button>

<script>
	import { onMount } from 'svelte';
	onMount(async () => {
		setupSmoothScroll();
		setupTopLinkAnchor();
		// fixAnchorLinkRoutes();
	});
	/* #### Scroll #### */
	/* ## Scrolling Related Functions #### */
	export const setupWindowScrollWatcher = () => {
		if (!window?.scrollWatcher) {
			window.scrollWatcher = {};
			window.scrollWatcher.direction = 'down';
			window.scrollWatcher._watcher = () => {
				window.scrollWatcher.currentPadding = window?.scrollWatcher
					?.currentPadding
					? window?.scrollWatcher?.currentPadding
					: 0;
				window.ndcLastScroll = window?.ndcLastScroll
					? window?.ndcLastScroll
					: 0;
				if (
					window?.scrollWatcher?.lastScroll != 0 &&
					window?.pageYOffset >=
						window?.scrollWatcher?.currentPadding &&
					window?.pageYOffset > window?.scrollWatcher?.lastScroll
				) {
					window.scrollWatcher.direction = 'down';
					documen?.body?.classList?.remove('scroll-up');
					document?.body?.classList?.add('scroll-down');
				} else {
					window.scrollWatcher.direction = 'up';
					document?.body?.classList?.remove('scroll-down');
					document?.body?.classList?.add('scroll-up');
				}
				window.scrollWatcher.lastScroll = window.pageYOffset;
			};
			window?.addEventListener('scroll', window.scrollWatcher._watcher);
		}
	};
	/* ## Scrolling Related Functions #### */
	export const setupScrollWatcherFor = (watcherFor) => {
		let watchThis = document?.querySelector(`${watcherFor}`);
		if (watchThis) {
			if (watchThis?.scrollWatcher) {
			} else {
				watchThis.scrollWatcher = {};
				watchThis.scrollWatcher.direction = 'down';
				watchThis.scrollWatcher._watcher = (event) => {
					event?.preventDefault();
					event?.stopPropagation();
					watchThis.scrollWatcher.currentPadding = watchThis
						?.scrollWatcher?.currentPadding
						? watchThis?.scrollWatcher?.currentPadding
						: 0;
					watchThis.scrollWatcher.lastScroll = watchThis
						?.scrollWatcher?.lastScroll
						? watchThis?.scrollWatcher?.lastScroll
						: 0;
					if (
						watchThis.scrollWatcher.lastScroll != 0 &&
						window?.pageYOffset >=
							watchThis?.scrollWatcher?.currentPadding &&
						window?.pageYOffset >
							watchThis?.scrollWatcher?.lastScroll
					) {
						watchThis.scrollWatcher.direction = 'down';
						watchThis?.setAttribute('scroll', 'down');
						// if (watchThis.setDirection) { watchThis.setDirection('down'); };
						watchThis?.classList?.remove('scroll-up');
						watchThis?.classList?.add('scroll-down');
					} else {
						watchThis.scrollWatcher.direction = 'up';
						watchThis?.setAttribute('scroll', 'up');
						// if (watchThis.setDirection) { watchThis.setDirection('up'); };
						watchThis?.classList?.remove('scroll-down');
						watchThis?.classList?.add('scroll-up');
					}
					watchThis.scrollWatcher.lastScroll = window?.pageYOffset;
					window?.addEventListener(
						'scroll',
						watchThis?.scrollWatcher?._watcher
					);
				};
			}
		} else {
		}
		return `${watcherFor}`;
	};
	/* ## Setup SmoothScroll ## */
	export const setupSmoothScroll = () => {
		const html = document?.querySelector('html');
		html.scrollBehavior = `smooth`;
	};
	/* ## Setup TopLink Anchor ## */
	export const setupTopLinkAnchor = () => {
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
	/* ## Fix Sapper Anchor Link Routes ## */
	// export const fixAnchorLinkRoutes = () => {
	// 	document.querySelectorAll('a').forEach((a) => {
	// 		if (!a.hash || !document.querySelectorAll(a.hash).length) return;
	// 		a.href = `${window.location.origin}${window.location.pathname}${a.hash}`;
	// 	});
	// };
	/* ## scrollTo ## */
	export const scrollToElement = (element) => {
		window?.scroll({
			behavior: 'smooth',
			left: 0,
			top: element?.offsetTop,
		});
	};
	export const scrollToTop = () => {
		window?.scroll({ behavior: 'smooth', left: 0, top: -100 });
	};
	export const scrollToPosition = (xPosition, yPosition) => {
		window?.scroll({ behavior: 'smooth', left: xPosition, top: yPosition });
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
