{#if display}
	<div class="calendarcard" class:hide={!display}>
		<button class="close" on:click={hideCalendarCard}>
			<img
				alt="Close"
				height="40"
				width="40"
				loading="lazy"
				src="/img/icon-close.svg"
				class="icon"
			/>
		</button>
		<iframe
			src={$milk?.site?.calendar}
			loading="lazy"
			frameborder="0"
			allowfullscreen="true"
			aria-hidden="false"
			tabindex="0"
			title="Calendar"
		/>
	</div>
{/if}

<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	/* ## Variables ## */
	let display = false;
	/* ## Main ## */
	onMount(async () => {
		if (!window?.calendarCard) {
			window.calendarCard = {};
		}
		window.calendarCard.show = showCalendarCard;
		window.calendarCard.hide = hideCalendarCard;
	});
	/* ## Methods & Function ## */
	const showCalendarCard = () => {
		display = true;
	};
	const hideCalendarCard = () => {
		display = false;
	};
</script>

<style>
	.calendarcard {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		min-width: 100%;
		height: 100vh;
		min-height: 100%;
		display: grid;
		background: var(--background-white, #fff);
		z-index: 999999;
	}
	.close {
		position: absolute;
		top: 2vw;
		right: 4vw;
		z-index: 9999;
	}
	.close:hover img {
		filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)
			brightness(70%) contrast(97%);
	}
	@media screen and (max-width: 650px) {
		.close {
			right: unset;
			left: 4vw;
		}
	}
	button {
		display: inline-block;
		margin: 0;
		padding: 0;
		border: 0 none;
		background: transparent;
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
	}
	button:hover {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
		filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		);
	}
	iframe {
		width: 100%;
		height: 100%;
	}
	.hide {
		display: block;
		width: 100vw;
		position: absolute;
		left: -100vw;
	}
</style>
