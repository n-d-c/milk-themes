<svelte:window
	on:load={setHeight}
	on:resize={setHeight}
	on:orientationchange={setHeight}
/>

<svelte:head>
	<style>
		@keyframes slideInLeft {
			0% {
				transform: translateX(-100%);
				opacity: 0;
			}
			100% {
				transform: translateX(0);
				opacity: 1;
			}
		}
		@keyframes slideInRight {
			0% {
				transform: translateX(100%);
				opacity: 0;
			}
			100% {
				transform: translateX(0);
				opacity: 1;
			}
		}
		@keyframes slideOutLeft {
			100% {
				transform: translateX(-100%);
				opacity: 0;
			}
		}
		@keyframes slideOutRight {
			100% {
				transform: translateX(100%);
				opacity: 0;
			}
		}
		.carousel .slides {
			text-align: center;
		}
		.carousel .slides > * {
			display: block;
			position: absolute;
			width: 100%;
			top: 0;
			box-sizing: border-box;
			margin: 0 auto;
		}
		.carousel .slides > .slideInLeft {
			animation: slideInLeft var(--slide-speed, 1000ms) ease 0s 1 normal
				forwards;
		}
		.carousel .slides > .slideInRight {
			animation: slideInRight var(--slide-speed, 1000ms) ease 0s 1 normal
				forwards;
		}
		.carousel .slides > .slideOutLeft {
			animation: slideOutLeft var(--slide-speed, 1000ms) ease 0s 1 normal
				forwards;
		}
		.carousel .slides > .slideOutRight {
			animation: slideOutRight var(--slide-speed, 1000ms) ease 0s 1 normal
				forwards;
		}
		.carousel .slides > .outLeft {
			transform: translateX(-100%);
			opacity: 0;
		}
		.carousel .slides > .outRight {
			transform: translateX(100%);
			opacity: 0;
		}
		.carousel [slot='slides'] > * img {
			-webkit-user-drag: none;
			-khtml-user-drag: none;
			-moz-user-drag: none;
			-o-user-drag: none;
			user-drag: none;
		}
	</style>
</svelte:head>

<div class="carousel noselect" bind:this={component} {id}>
	<button
		bind:this={prevButton}
		class="prevButton"
		style={`margin-top: ${buttonOffset}px`}
		on:click={() => {
			stop();
			doPrev();
		}}
		disabled
	>
		<slot name="prev">
			<svg
				aria-hidden="true"
				focusable="false"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 320 512"
			>
				<path
					fill="currentColor"
					d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"
				/>
			</svg>
		</slot>
	</button>
	<button
		bind:this={nextButton}
		class="nextButton"
		style={`margin-top: ${buttonOffset}px`}
		on:click={() => {
			stop();
			doNext();
		}}
		disabled
	>
		<slot name="next">
			<svg
				aria-hidden="true"
				focusable="false"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 320 512"
			>
				<path
					fill="currentColor"
					d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
				/>
			</svg>
		</slot>
	</button>
	<div
		class="slides"
		style={`min-height: ${sliderHeight}px;`}
		on:click={stop}
		on:touchstart|passive={startTouch}
		on:touchmove|passive={moveTouch}
		on:mousedown={startDrag}
		on:mouseup={moveDrag}
	>
		<slot>
			<div
				class="slide slideInLeft slideInRight slideOutLeft slideOutRight outLeft outRight"
			>
				No Slides
			</div>
			<div class="slide">No Slides</div>
		</slot>
	</div>
	{#if pagination != 'false'}
		<div class="pagination" bind:this={paginationControls}>
			{#each slides as slide, index}
				<button
					class:active={index == currentSlide}
					class:inactive={index != currentSlide}
					on:click={() => {
						stop();
						jumpTo(index);
					}}
					style={index == currentSlide
						? pagedot_activestyle
						: pagedot_inactivestyle}
					disabled={!controlsEnabled ? 'disabled' : ''}
				>
					{index}
				</button>
			{/each}
		</div>
	{/if}
</div>

<script>
	import { onMount } from 'svelte';
	let id;
	let component = {};
	let slides = [];
	let sliderHeight = 0;
	let currentSlide = 0;
	let prevButton = { disabled: true };
	let nextButton = { disabled: true };
	let controlsEnabled = true;
	$: prevButton.disabled = !controlsEnabled;
	$: nextButton.disabled = !controlsEnabled;
	let buttonOffset = 0;
	let slide_speed = 1000;
	let disable_ratio = 0.8;
	let pagination = true;
	let paginationControls;
	let pagedot_activestyle = '';
	let pagedot_inactivestyle = '';
	let play = true;
	let interval = 8000;
	let playing = false;
	let initialX = null;
	let initialY = null;
	onMount(async () => {
		slides = component.querySelectorAll('.slides>*');
		// console.log({ slides: slides });
		setHeight();
		removeAll();
		slide(slides[currentSlide], 'in', 'right');
		disableButtons(slide_speed * disable_ratio);
		if (!!play == true) {
			setTimeout(start, interval);
		}
		// console.log({ slots: $$slots });
		// console.log({ component: component.querySelectorAll('.slides>*') });
	});
	const setHeight = () => {
		sliderHeight = 0;
		slides.forEach(function (el) {
			sliderHeight =
				el.offsetHeight > sliderHeight ? el.offsetHeight : sliderHeight;
		});
		sliderHeight = sliderHeight + 10;
		console.log(sliderHeight);
	};
	const removeAll = () => {
		slides.forEach(function (el) {
			removeAllAnimations(el);
			el.classList.add('outRight');
		});
	};
	const removeAllAnimations = (el) => {
		el.classList.remove('slideInRight');
		el.classList.remove('slideInLeft');
		el.classList.remove('slideOutLeft');
		el.classList.remove('slideOutRight');
		el.classList.remove('outLeft');
		el.classList.remove('outRight');
	};
	const firstCap = (str = '') => {
		return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
	};
	const slide = (el, send = 'in', direction = 'right') => {
		direction = firstCap(direction);
		send = firstCap(send);
		removeAllAnimations(el);
		el.classList.add(`slide${send}${direction}`);
	};
	const disableButtons = (milsec) => {
		controlsEnabled = false;
		setTimeout(() => {
			controlsEnabled = true;
		}, milsec);
	};
	const doNext = () => {
		slide(slides[currentSlide], 'out', 'left');
		currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
		slide(slides[currentSlide], 'in', 'right');
		disableButtons(slide_speed * disable_ratio);
	};
	const doPrev = () => {
		slide(slides[currentSlide], 'out', 'right');
		currentSlide = currentSlide == 0 ? slides.length - 1 : currentSlide - 1;
		slide(slides[currentSlide], 'in', 'left');
		disableButtons(slide_speed * disable_ratio);
	};
	const stop = () => {
		play = 'false';
		playing = false;
	};
	const start = () => {
		if (!playing) {
			play = 'true';
			playing = true;
			autoplay();
		}
	};
	const autoplay = () => {
		if (play == 'true') {
			doNext();
			setTimeout(autoplay, interval);
		}
	};
	const jumpTo = (newSlide) => {
		if (newSlide < currentSlide) {
			slide(slides[currentSlide], 'out', 'right');
			currentSlide = newSlide;
			slide(slides[currentSlide], 'in', 'left');
		} else if (newSlide > currentSlide) {
			slide(slides[currentSlide], 'out', 'left');
			currentSlide = newSlide;
			slide(slides[currentSlide], 'in', 'right');
		}
		disableButtons(slide_speed * disable_ratio);
	};
	const startTouch = (e) => {
		stop();
		initialX = e.touches[0].clientX;
		initialY = e.touches[0].clientY;
	};
	const moveTouch = (e) => {
		if (initialX === null || initialY === null) {
			return;
		}
		const currentX = e.touches[0].clientX;
		const currentY = e.touches[0].clientY;
		const diffX = initialX - currentX;
		const diffY = initialY - currentY;
		if (Math.abs(diffX) > Math.abs(diffY)) {
			if (diffX > 0) {
				// console.log("swiped left");
				stop();
				doNext();
			} else {
				// console.log("swiped right");
				stop();
				doPrev();
			}
			// } else {
			// 	if (diffY > 0) {
			// 		// console.log("swiped up");
			// 	} else {
			// 		// console.log("swiped down");
			// 	};
		}
		initialX = null;
		initialY = null;
		e.preventDefault();
	};
	const startDrag = (e) => {
		stop();
		initialX = e.pageX;
		initialY = e.pageY;
	};
	const moveDrag = (e) => {
		const delta = 10;
		if (initialX === null || initialY === null) {
			return;
		}
		const diffX = e.pageX - initialX;
		const diffY = e.pageY - initialY;
		if (Math.abs(diffX) < delta && Math.abs(diffY) < delta) {
			// console.log('click');
		} else {
			if (Math.abs(diffX) > Math.abs(diffY)) {
				if (diffX < 0) {
					// console.log("dragged left");
					stop();
					doNext();
				} else {
					// console.log("dragged right");
					stop();
					doPrev();
				}
				// } else {
				// 	if (diffY < 0) {
				// 		console.log("draggeded up");
				// 	} else {
				// 		console.log("draggeded down");
				// 	};
			}
		}
		initialX = null;
		initialY = null;
		e.preventDefault();
	};
	/* ## Exports ## */
	export {
		id,
		slide_speed,
		disable_ratio,
		pagination,
		pagedot_activestyle,
		pagedot_inactivestyle,
		play,
		interval,
		start,
		stop,
	};
</script>

<style>
	.carousel {
		display: block;
		position: relative;
		transform-style: preserve-3d;
		overflow: hidden;
	}
	.carousel .slides {
		display: block;
		overflow-x: hidden;
		text-align: center;
		position: relative;
	}
	.prevButton,
	.nextButton {
		position: absolute;
		top: 0;
		height: 100%;
		z-index: 9999;
	}
	.prevButton svg,
	.nextButton svg {
		height: 40px;
		width: auto;
	}
	.prevButton {
		left: 25px;
	}
	.nextButton {
		right: 25px;
	}
	.prevButton[disabled],
	.nextButton[disabled] {
		opacity: 0.4;
	}
	.pagination {
		text-align: center;
	}
</style>
