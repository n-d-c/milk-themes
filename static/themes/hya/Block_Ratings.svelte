<div class="our-ratings">
	<div class="ratings-inner">
		<h2>View Our Ratings</h2>
		<div class="blurb">
			<h3>Exceptional Service Has Earned Us Exceptional Recognition.</h3>
			<div class="block-content">
				<p>
					Our immigration law firm has earned the highest ratings in
					Best Lawyers in America, Super Lawyers, US News and World
					Report, Avvo, as well as Martindale-Hubbell.
				</p>
			</div>
		</div>
		<div class="listing-grid ratings-listing">
			{#each ratings as rating}
				<div class="rating">
					<a
						href={rating?.Ratings?.link}
						title={`${rating?.title} - ${rating?.rating}`}
						target="_blank"
						rel="noopener"
					>
						<h4>{rating?.title}</h4>
						<h5>{rating?.Ratings?.rating}</h5>
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'our-ratings';
	$: blockclass = `our-ratings ${blockstyle}`;
	/* ## Data Loading ## */
	import { preload_ratings } from '$graphql/sitespecific.preload.js';
	let ratings = preload_ratings;
	let unsubscribe_ratings = () => {};
	import { Q_GET_RATINGS } from '$graphql/sitespecific.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		let queryVariables = { size: 12 };
		let getRatings = $milk?.data?.gql(
			Q_GET_RATINGS,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_ratings = await getRatings?.subscribe(
			async (fetched_data) => {
				let data = await fetched_data;
				// console.log(data);
				ratings = data.ratings.nodes;
			}
		);
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_ratings(); // important for garbage collection otherwise memory leak
	});
	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.our-ratings {
		display: block;
		padding: var(--padding-large);
		text-align: center;
	}
	.ratings-inner {
		padding: var(--padding-large);
		margin: 0 auto;
		max-width: var(--content-constrain);
		background: var(--background-offwhite, #f4f4f4);
	}
	h2,
	h3,
	p {
		color: var(--color-black, #000);
	}
	h2 {
		font-size: var(--extralarge-fontsize);
	}
	h3 {
		font-family: var(--font-main);
	}
	.rating {
		display: inline-block;
		vertical-align: middle;
		position: relative;
		border: 4px solid var(--color-yellow-vibrant, #f4ba38);
		width: 150px;
		height: 150px;
		margin: clamp(10px, 4vw, 40px);
		border-radius: 75px;
		background: var(--background-white, #fff);
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
		color: var(--color-black);
		/* filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0)); */
	}
	.rating:hover {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
		/* filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		); */
	}
	.rating a {
		display: grid;
		place-content: center;
		height: calc(100% - 12px);
		width: calc(100% - 12px);
		border: 2px solid var(--color-yellow-vibrant, #f4ba38);
		border-radius: 75px;
		margin: 6px;
		text-decoration: none;
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
		color: var(--color-black);
		font-family: var(--font-main);
	}
	.rating:hover a {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
	}
	.rating a h4 {
		font-size: calc(var(--font-size-small, 15px) - 2px);
		line-height: calc(var(--font-size-small, 15px) - 2px);
		text-transform: uppercase;
		font-family: var(--font-main);
		font-weight: bold;
		margin-top: 6px;
	}
	.rating a h5 {
		font-size: calc(var(--font-size-small, 15px) - 3px);
		font-family: var(--font-main);
		font-weight: bold;
		margin-top: -6px;
	}
	@media screen and (min-width: 650px) {
		.our-ratings .blurb {
			margin: var(--padding);
			display: grid;
			grid-template-columns: 1fr 2fr;
			text-align: left;
			column-gap: 3em;
		}
	}
	@media screen and (max-width: 480px) {
		.our-ratings {
			padding: 0;
		}
		.rating {
			margin: 5px;
		}
	}
</style>
