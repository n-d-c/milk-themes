<svelte:window
	on:load={() => {
		webComponentMount();
		setHeight();
	}}
	on:resize={() => {
		setHeight();
	}}
	on:orientationchange={() => {
		setHeight();
	}}
/>

<svelte:head>
	{@html injectedStyle}
</svelte:head>

<div class="carousel noselect" bind:this={thisComponent}>
	<button
		bind:this={prevButton}
		class="prevButton"
		style={`margin-top: -${
			prevButton && prevButton.offsetHeight
				? prevButton.offsetHeight / 2
				: 0
		}px`}
		on:click={() => {
			stop();
			doPrev();
		}}
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
		style={`margin-top: -${
			nextButton && nextButton.offsetHeight
				? nextButton.offsetHeight / 2
				: 0
		}px`}
		on:click={() => {
			stop();
			doNext();
		}}
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
	<slot
		name="slides"
		style={`min-height: ${sliderHeight}px;`}
		on:click={stop}
		on:touchstart|passive={startTouch}
		on:touchmove|passive={moveTouch}
		on:mousedown={startDrag}
		on:mouseup={moveDrag}
	>
		<div>No Slides</div>
	</slot>
	{#if pagination != 'false'}
		<div class="pagination">
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
	import { onMount, tick } from 'svelte';
	let id;
	let thisComponent = {};
	let carouselComponent;
	let slides = [];
	let currentSlide = 0;
	let sliderHeight = 0;
	let prevButton = { disabled: true };
	let nextButton = { disabled: true };
	let slide_speed = 1000;
	let controlsEnabled = true;
	let disable_ratio = 0.8;
	let pagination = true;
	let pagedot_activestyle = '';
	let pagedot_inactivestyle = '';
	let play = false;
	let interval = 8000;
	let playing = false;
	let initialX = null;
	let initialY = null;
	$: prevButton.disabled = !controlsEnabled;
	$: nextButton.disabled = !controlsEnabled;
	$: injectedStyle = `<style>
		@keyframes slideInLeft { 0% { transform: translateX(-100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
		@keyframes slideInRight { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
		@keyframes slideOutLeft { 100% { transform: translateX(-100%); opacity: 0; } }
		@keyframes slideOutRight { 100% { transform: translateX(100%); opacity: 0; } }
		flex-slider { display: block; position: relative; transform-style: preserve-3d; overflow: hidden; }
		flex-slider [slot='slides'] { display: block; overflow-x: hidden; text-align: center; }
		flex-slider [slot='slides'] > * { display: block; position: absolute; width: 100%; top: 0; box-sizing: border-box;	margin: 0 auto; }
		flex-slider [slot='slides'] > .slideInLeft { animation: slideInLeft ${slide_speed}ms ease 0s 1 normal forwards; }
		flex-slider [slot='slides'] > .slideInRight { animation: slideInRight ${slide_speed}ms ease 0s 1 normal forwards; }
		flex-slider [slot='slides'] > .slideOutLeft { animation: slideOutLeft ${slide_speed}ms ease 0s 1 normal forwards; }
		flex-slider [slot='slides'] > .slideOutRight { animation: slideOutRight ${slide_speed}ms ease 0s 1 normal forwards; }
		flex-slider [slot='slides'] > .outLeft { transform: translateX(-100%); opacity: 0; }
		flex-slider [slot='slides'] > .outRight { transform: translateX(100%); opacity: 0; }
		flex-slider [slot='slides'] > * img { -webkit-user-drag: none; -khtml-user-drag: none; -moz-user-drag: none; -o-user-drag: none; user-drag: none; }
	</style>`;
	onMount(async () => {
		webComponentMount();
	});
	let webComponentMount = async () => {
		// if (id === undefined) {
		// 	await tick;
		// 	webComponentMount();
		// } else {
		// 	carouselComponent = thisComponent.getRootNode().host;
		// 	slides = carouselComponent.querySelectorAll(`div[slot='slides']>*`);
		// 	setHeight();
		// slides.forEach(function (el) {
		// 	removeAllAnimations(el);
		// 	el.classList.add('outRight');
		// });
		// slide(slides[currentSlide], 'in', 'right');
		// disableButtons(slide_speed * disable_ratio);
		// if (play == 'true') {
		// 	setTimeout(start, interval);
		// }
		// imgs = slides.querySelectorAll('img');
		// imgs.forEach(function (el) {
		// 	el.setAttribute('draggable', false);
		// });
		// }
	};
	// let doNext = () => {
	// 	slide(slides[currentSlide], 'out', 'left');
	// 	currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
	// 	slide(slides[currentSlide], 'in', 'right');
	// 	disableButtons(slide_speed * disable_ratio);
	// };
	// let doPrev = () => {
	// 	slide(slides[currentSlide], 'out', 'right');
	// 	currentSlide = currentSlide == 0 ? slides.length - 1 : currentSlide - 1;
	// 	slide(slides[currentSlide], 'in', 'left');
	// 	disableButtons(slide_speed * disable_ratio);
	// };
	let jumpTo = (newSlide) => {
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
	// let slide = (el, send = 'in', direction = 'right') => {
	// 	direction = firstCap(direction);
	// 	send = firstCap(send);
	// 	removeAllAnimations(el);
	// 	el.classList.add(`slide${send}${direction}`);
	// };
	// let removeAllAnimations = (el) => {
	// 	el.classList.remove('slideInRight');
	// 	el.classList.remove('slideInLeft');
	// 	el.classList.remove('slideOutLeft');
	// 	el.classList.remove('slideOutRight');
	// 	el.classList.remove('outLeft');
	// 	el.classList.remove('outRight');
	// };
	// let setHeight = () => {
	// 	sliderHeight = 0;
	// 	slides.forEach(function (el) {
	// 		sliderHeight =
	// 			el.offsetHeight > sliderHeight ? el.offsetHeight : sliderHeight;
	// 	});
	// };
	// let disableButtons = (milsec) => {
	// 	controlsEnabled = false;
	// 	setTimeout(() => {
	// 		controlsEnabled = true;
	// 	}, milsec);
	// };
	// let autoplay = () => {
	// 	// console.log('play tick');
	// 	if (play == 'true') {
	// 		doNext();
	// 		setTimeout(autoplay, interval);
	// 	}
	// };
	// let stop = () => {
	// 	play = 'false';
	// 	playing = false;
	// };
	// let start = () => {
	// 	if (!playing) {
	// 		play = 'true';
	// 		playing = true;
	// 		autoplay();
	// 	}
	// };
	// let firstCap = (str = '') => {
	// 	return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
	// };
	let startTouch = (e) => {
		stop();
		initialX = e.touches[0].clientX;
		initialY = e.touches[0].clientY;
	};
	let moveTouch = (e) => {
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
	let startDrag = (e) => {
		stop();
		initialX = e.pageX;
		initialY = e.pageY;
	};
	let moveDrag = (e) => {
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

<style></style>
