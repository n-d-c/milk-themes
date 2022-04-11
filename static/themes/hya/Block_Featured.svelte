<div {id} class={blockclass}>
	<div class="featured-inner">
		<h2>{description}</h2>
		<div class="featured-on-listing">
			{#each featured as feature}
				<a
					href={feature?.FeaturedOn?.link}
					title={feature?.title}
					target="_blank"
					rel="noopener"
					class="featured-on"
				>
					<picture>
						<source
							type="image/avif"
							srcset={feature?.FeaturedOn?.avifImage?.sourceUrl}
						/>
						<source
							type="image/webp"
							srcset={feature?.FeaturedOn?.webpImage?.sourceUrl}
						/>
						<img
							src={feature?.FeaturedOn?.pngImage?.sourceUrl}
							alt={feature?.title}
							loading="lazy"
							width="200"
							height="200"
						/>
					</picture>
				</a>
			{/each}
		</div>
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	import { shuffleArray } from '$milk/util/helpers.js';
	/* ## Variables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'featured';
	$: blockclass = `featured ${blockstyle}`;
	let description = 'Harlan York Has Been Featured On';
	/* ## Data Loading ## */
	import { preload_featured } from '$graphql/sitespecific.preload.js';
	let preload = preload_featured;
	shuffleArray(preload);
	let featured = preload.slice(0, 4);
	let unsubscribe_featured = () => {};
	import { Q_GET_FEATURED } from '$graphql/sitespecific.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		let queryVariables = { size: 99 };
		let getFeatrued = $milk?.data?.gql(
			Q_GET_FEATURED,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_featured = await getFeatrued?.subscribe(
			async (fetched_data) => {
				let data = await fetched_data;
				//console.log(data);
				let tmpArray = data.featuredOns.nodes;
				shuffleArray(tmpArray);
				featured = tmpArray.slice(0, 4);
			}
		);
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_featured(); // important for garbage collection otherwise memory leak
	});
	/* ## Exports ## */
	export { id, blockstyle, description };
</script>

<style>
	.featured {
		display: block;
		padding: 100px var(--padding) 0px;
		text-align: center;
		margin-bottom: -50px;
	}
	.featured-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
	}
	h2 {
		margin-bottom: -40px;
		font-size: var(--extralarge-fontsize);
	}
	.featured-on {
		display: inline-block;
		vertical-align: middle;
		margin: 20px;
		max-width: 200px;
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
	}
	.featured-on:hover {
		-webkit-transform: scale(1.15);
		-ms-transform: scale(1.15);
		transform: scale(1.15);
	}
	.featured-on img {
		width: 100%;
		height: auto;
	}
	.featured-on-listing {
		margin: 5px 0 10px;
	}
	@media screen and (max-width: 650px) {
		.featured-on {
			margin-bottom: -60px;
		}
		.featured-on:last-of-type {
			margin-bottom: 40px;
		}
	}
</style>
