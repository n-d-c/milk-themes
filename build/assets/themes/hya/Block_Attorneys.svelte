<div {id} class={blockclass}>
	<div class="attorneys-inner">
		<div class="attorneys-list">
			{#each attorneys as attorney}
				<div class="attorney outer-wrap" id={attorney?.slug}>
					<div class="inner-attorney-wrap">
						<div class="flex reverse-on-evens">
							<picture>
								<source
									type="image/avif"
									srcset={attorney?.Attorney?.avifImage
										?.sourceUrl}
								/>
								<source
									type="image/webp"
									srcset={attorney?.Attorney?.webpImage
										?.sourceUrl}
								/>
								<img
									src={attorney?.Attorney?.pngImage
										?.sourceUrl}
									alt={attorney?.title}
									loading="lazy"
									width="260"
									height="260"
								/>
							</picture>

							<div class="attorney-content">
								<h2 class="name">
									{attorney?.title}
								</h2>
								<div class="email">
									<a
										href={`mailto:${attorney?.Attorney?.email}`}
									>
										{attorney?.Attorney?.email}
									</a>
								</div>
								<div class="short-description">
									{@html attorney?.Attorney?.shortDescription}
								</div>

								<AdditonalContent
									htmlContent={attorney?.Attorney
										?.additionalDescription}
								/>
							</div>
						</div>
					</div>
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
	import { scrollToHash } from '$milk/util/scroll.js';
	let id;
	let blockstyle = '';
	let blockclass = 'attorneys';
	$: blockclass = `attorneys ${blockstyle}`;
	let toggledVal = false;
	let spanTextVal;

	/* Import Blocks */
	import AdditonalContent from './Toggle_Button.svelte';

	/* ## Data Loading ## */
	import { preload_attorneys } from '$graphql/sitespecific.preload.js';
	let attorneys = preload_attorneys;
	let unsubscribe_team = () => {};
	import { Q_GET_TEAM } from '$graphql/sitespecific.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		let queryVariables = { size: 10 };
		let getTeam = $milk?.data?.gql(
			Q_GET_TEAM,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_team = await getTeam?.subscribe(async (fetched_data) => {
			let data = await fetched_data;
			attorneys = data.attorneys.nodes;
			setTimeout(scrollToHash, 1000);
		});
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_team(); // important for garbage collection otherwise memory leak
	});

	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.flex {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.attorneys {
		display: block;
		padding: 100px 0;
		text-align: center;
	}

	h2 {
		font-size: 2.5em;
		font-weight: 500;
	}

	.inner-attorney-wrap {
		margin: 0 auto;
		max-width: var(--content-constrain);
	}
	.attorneys-list {
		margin-top: -100px;
	}

	.attorney-content {
		text-align: left;
		flex: 3;
	}

	.flex picture {
		flex: 1;
	}

	@media screen and (min-width: 650px) {
		.attorneys-list {
			text-align: left;
		}
	}
	.attorney {
		padding: var(--padding-large);
	}
	.attorney img {
		margin: 0 var(--padding-large) var(--padding-large);
	}
	.attorney:nth-child(even) {
		background: var(--color-offwhite);
	}
	.attorney:nth-child(odd) {
	}
	@media screen and (min-width: 650px) {
		.attorney:nth-child(even) img {
			margin: 0 0 var(--padding-large) var(--padding-large);
		}
		.attorney:nth-child(odd) img {
			margin: 0 var(--padding-large) var(--padding-large) 0;
		}

		.flex {
			flex-direction: row;
		}

		.attorney:nth-child(even) .reverse-on-evens {
			flex-direction: row-reverse;
		}
	}
	.attorney::after {
		content: '';
		display: block;
		clear: both;
	}
	.attorney .email {
		position: relative;
		margin: -10px 0 10px;
	}
	.attorney .email a {
		color: var(--color-one);
	}
</style>
