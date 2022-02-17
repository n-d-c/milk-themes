<div {id} class={blockclass}>
	<div class="testimonials-inner">
		{#each testimonials as testimonial}
			<div class="testimonial">
				<!-- <picture>
					{#if testimonial?.Testimonial?.avifImage?.sourceUrl}
						<source
							type="image/avif"
							srcset={testimonial?.Testimonial?.avifImage
								?.sourceUrl}
						/>
					{/if}
					{#if testimonial?.Testimonial?.webpImage?.sourceUrl}
						<source
							type="image/webp"
							srcset={testimonial?.Testimonial?.webpImage
								?.sourceUrl}
						/>
					{/if}
					<img
						src={testimonial?.Testimonial?.jpgImage?.sourceUrl ||
							'/milk/img/user_nophoto.svg'}
						alt={testimonial?.title}
						loading="lazy"
						width="130"
						height="130"
					/>
				</picture> -->
				<div class="testimonial-content">
					<div class="testimonial-title">
						<strong>{testimonial?.title}</strong>,
						{#if testimonial?.Testimonial?.relationship}
							{testimonial?.Testimonial?.relationship}
						{/if}
					</div>
					<div class="testimonial-quote">
						"{testimonial?.Testimonial?.testimonial}"
					</div>
					{#if testimonial?.Testimonial?.rating}
						<div
							class="rating"
							style={`width: ${
								testimonial?.Testimonial?.rating * 18
							}px`}
						>
							{testimonial?.Testimonial?.rating}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	import { shuffleArray } from '$milk/util/helpers.js';
	/* ## Vairables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'testimonials';
	$: blockclass = `testimonials ${blockstyle}`;
	/* ## Data Loading ## */
	import { preload_testimonials } from '$graphql/sitespecific.preload.js';
	let testimonials = preload_testimonials;
	let unsubscribe_testimonials = () => {};
	import { Q_GET_TESTIMONIALS } from '$graphql/sitespecific.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		let queryVariables = { size: 99 };
		let getTestimonials = $milk?.data?.gql(
			Q_GET_TESTIMONIALS,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_testimonials = await getTestimonials?.subscribe(
			async (fetched_data) => {
				let data = await fetched_data;
				// console.log(data);
				// let tmpArray = data?.testimonials?.nodes;
				// shuffleArray(tmpArray);
				// testimonials = tmpArray.slice(0, 20);
				testimonials = data?.testimonials?.nodes;
				// console.log(testimonials);
			}
		);
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_testimonials(); // important for garbage collection otherwise memory leak
	});
	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.testimonials {
		display: block;
		padding: 100px var(--padding-inner, 20px);
		text-align: center;
	}
	.testimonials-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
	}
	h2,
	h3,
	p {
		color: var(--color-white, #fff);
	}
	h2 {
		margin-bottom: 20px;
		font-size: var(--extralarge-fontsize);
	}
	h3 {
		font-family: var(--font-main);
	}
	@media screen and (min-width: 650px) {
		.testimonials .blurb {
			margin: var(--padding);
			display: grid;
			grid-template-columns: 1fr 2fr;
			text-align: left;
			column-gap: 3em;
		}
	}
	.testimonial {
		display: block;
		text-align: center;
	}
	.testimonial:nth-child(even) {
		background: var(--color-offwhite);
	}
	.testimonial:nth-child(odd) {
	}
	.testimonials .testimonials-inner .testimonial {
		width: 100%;
		margin: 0 auto;
	}
	@media screen and (min-width: 650px) {
		.testimonial {
			/* display: grid;
			grid-template-columns: 240px calc(100% - 290px - 4em) 50px; */
			text-align: left;
			column-gap: 2em;
			text-align: left;
		}
	}
	.testimonial img {
		border-radius: 50%;
		margin: var(--padding) var(--padding) var(--padding)
			var(--padding-large);
	}
	.testimonial .testimonial-content {
		padding: var(--padding);
	}
	.testimonial-quote {
		font-style: italic;
	}
	.rating {
		margin: 10px 0;
		height: 17px;
		background: url(/img/icon-yellow-star.svg) left center repeat;
		background-size: 18px;
		color: transparent;
		font-size: 0;
	}
</style>
