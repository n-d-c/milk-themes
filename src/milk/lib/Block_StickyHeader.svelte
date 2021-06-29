<svelte:window bind:scrollY={y} />
<div class="sticky-header" data-type={type} data-scroll={scroll}><slot /></div>

<script>
	let type;
	let y = 0;
	let pY = 0;
	let height = 0;
	let scroll = '';
	$: scroll = setDirection(y);
	const setDirection = (y) => {
		if (y > height) {
			let direction = y <= pY ? 'up' : 'down';
			pY = y;
			return direction;
		} else {
			return 'up';
		}
	};
	export { type };
</script>

<style>
	.sticky-header {
		position: relative;
		display: block;
		width: 100%;
		margin: 0 auto;
		text-align: center;
	}
	/* ## Header Sticky ## */
	.sticky-header[data-type^='sticky'] {
		position: fixed;
		top: 0;
		z-index: 9999;
	}
	/* ## Header Sticky Hide ## */
	.sticky-header[data-type='sticky-hide'] {
		transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
		transform: translate3d(0, 0, 0);
	}
	.sticky-header[data-type='sticky-hide'][data-scroll='down'] {
		transform: translate3d(0, -100%, 0);
	}
	.sticky-header[data-type='sticky-hide'][data-scroll='up'] {
		transform: translate3d(0, 0, 0);
	}
</style>
