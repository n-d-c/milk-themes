{#if display}
	<div class="searchcard" class:hide={!display}>
		<button class="close" on:click={hideSearchCard}>
			<img
				alt="Close"
				height="40"
				width="40"
				loading="lazy"
				src="/img/icon-close.svg"
				class="icon"
			/>
		</button>
		<div class="contents">
			<h1>Search Our Blog</h1>
			<form action="/immigration-law-blog" method="get">
				<div class="form-row">
					<label for="s">Search:</label>
					<input
						type="TEXT"
						name="s"
						value=""
						placeholder="Search For..."
					/>
				</div>
				<br />
				<div class="form-row button-row">
					<button type="submit" value="Submit" alt="Search Our Blog">
						Search
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	/* ## Variables ## */
	let display = false;
	/* ## Main ## */
	onMount(async () => {
		if (!window?.searchCard) {
			window.searchCard = {};
		}
		window.searchCard.show = showSearchCard;
		window.searchCard.hide = hideSearchCard;
	});
	/* ## Methods & Function ## */
	const showSearchCard = () => {
		display = true;
	};
	const hideSearchCard = () => {
		display = false;
	};
</script>

<style>
	.searchcard {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		min-width: 100%;
		height: 100vh;
		min-height: 100%;
		display: grid;
		background: var(--background-white, #fff);
		text-align: center;
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
	.hide {
		display: block;
		width: 100vw;
		position: absolute;
		left: -100vw;
	}
	.contents {
		margin: auto;
		padding: var(--padding);
		max-width: var(--content-constrain);
		min-width: 300px;
	}
	button.close {
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
	button.close:hover {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
		filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		);
	}
	button.close:focus,
	button.close:active {
		border: 0 none;
		background: transparent;
	}
</style>
