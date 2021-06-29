<div {id} class={blockclass}>
	<div class="testimonials-inner">
		<h2>What Our Clients Say</h2>
		<div class="blurb">
			<h3>
				With Hundreds Of Reviews Harlan York Is One Of The Top
				Immigration Law Firms In America.
			</h3>
			<div class="block-content">
				<p>
					Our Immigration Attorneys help thousands of clients avoid
					deportation, get their green cards and become US citizens.
					See what our clients and colleagues have to say about how
					Harlan York & Associates helped them with their case.
				</p>
				<p>Lorem Ipsum</p>
			</div>
		</div>
		{#each testimonials as testimonial}
			<a
				href="/client-testimonials"
				title={testimonial?.title}
				class="testimonial"
			>
				<picture>
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
				</picture>
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
				<div class="go">
					<span class="go">
						<svg
							aria-hidden="true"
							focusable="false"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 320 512"
							><path
								fill="currentColor"
								d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
							/></svg
						>
					</span>
				</div>
			</a>
		{/each}
		<div class="long-arrow"><a href="/client-testimonials">⟶</a></div>
		<div>
			<a href="/client-testimonials" class="fancy-link">
				<span>View Our Testimonials</span>
			</a>
		</div>
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
				let tmpArray = data?.testimonials?.nodes;
				shuffleArray(tmpArray);
				console.log(tmpArray);
				testimonials = [tmpArray[0]];
				console.log(testimonials);
			}
		);
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_testimonials(); // important for garbage collection otherwise memory leak
	});

	export { id, blockstyle };
</script>

<style>
	.testimonials {
		display: block;
		padding: 100px var(--padding-inner, 20px);
		color: var(--color-white, #fff);
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
		background: var(--color-six);
		text-align: center;
	}
	@media screen and (min-width: 650px) {
		.testimonial {
			display: grid;
			grid-template-columns: 240px calc(100% - 290px - 4em) 50px;
			text-align: left;
			column-gap: 2em;
			background: var(--color-six);
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
		color: var(--color-white);
	}
	.testimonial:hover {
		text-decoration: none;
	}
	.testimonial-quote {
		font-style: italic;
	}
	.testimonial .go {
		display: grid;
		place-items: center;
		background: var(--color-three);
	}
	.testimonial .go svg {
		width: 30px;
		height: auto;
		color: var(--color-six);
	}
	.long-arrow {
		font-size: calc(var(--extralarge-fontsize) * 2);
		text-align: right;
		line-height: 45px;
		margin-bottom: 20px;
	}
	.long-arrow a {
		transition: color var(--transition-speed);
	}
	.long-arrow a:hover {
		text-decoration: none;
		transition: color var(--transition-speed);
	}
	.rating {
		margin: 10px 0;
		height: 17px;
		background: url(/img/icon-yellow-star.svg) left center repeat;
		background-size: 18px;
		color: transparent;
		font-size: 0;
	}
	a:hover .rating {
		text-decoration: none !important;
		font-size: 0;
		color: transparent;
	}
</style>
