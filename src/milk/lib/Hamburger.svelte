<div
	class="hamburger-container"
	style={`padding: ${padding};`}
	on:click={toggleOpen}
>
	<div
		class="hamburger"
		class:open={isOpen}
		style={`width: ${size}; height: ${size}`}
		for="#nav"
	>
		<i /><i /><i />
	</div>
</div>

<script>
	let size;
	let padding;
	let isOpen = false;
	let target = 'nav';
	let toggleOpen = () => {
		isOpen = !isOpen;
		let targetElm = document.querySelector(target);
		if (targetElm) {
			if (isOpen) {
				targetElm.classList.add('open');
			} else {
				targetElm.classList.remove('open');
			}
		}
	};
	export { size, padding, target };
</script>

<style>
	.hamburger-container {
		display: inline-block;
		vertical-align: middle;
		cursor: pointer;
	}
	/* ## Hamburgers - Let's fire up the grill! ## */
	.hamburger {
		display: block;
		position: relative;
		height: 400px;
		width: 400px;
		padding: 0;
		margin: 0;
		cursor: pointer;
	}
	.hamburger i {
		display: block;
		position: absolute;
		height: 16%;
		width: 100%;
		background: var(--hamburger-color, #000);
		transition: all 0.4s ease-out;
	}
	.hamburger:hover i,
	.hamburger:focus i {
		background: var(--hamburger-color-hover, #000);
		transition: all 0.4s ease-out;
	}
	/* ## The Bun and Patty ## */
	.hamburger i:nth-child(1) {
		top: 9%;
	}
	.hamburger i:nth-child(2) {
		top: 42%;
	}
	.hamburger i:nth-child(3) {
		top: 75%;
	}
	/* ## Open Seasme Seeds ## */
	.hamburger.open i:nth-child(1) {
		transform: rotate(45deg);
		transform-origin: left bottom;
		top: 4%;
		left: 8%;
	}
	.hamburger.open i:nth-child(2) {
		opacity: 0;
	}
	.hamburger.open i:nth-child(3) {
		transform: rotate(-45deg);
		transform-origin: left top;
		top: 80%;
		left: 8%;
	}
	.hamburger.open:hover i {
		background: var(--hamburger-color-open, #000);
		transition: all 0.4s ease-out;
	}
	.hamburger.open:hover i,
	.hamburger.open:focus i {
		background: var(--hamburger-color-open-hover, #900);
		transition: all 0.4s ease-out;
	}
</style>
