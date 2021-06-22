<div {id} class={blockclass}>
	<div class="attorneys-inner">
		<div class="attorneys-list">
			{#each attorneys as attorney}
				<div class="attorney" id={attorney?.slug}>
					<picture>
						<source
							type="image/avif"
							srcset={attorney?.Attorney?.avifImage?.sourceUrl}
						/>
						<source
							type="image/webp"
							srcset={attorney?.Attorney?.webpImage?.sourceUrl}
						/>
						<img
							src={attorney?.Attorney?.pngImage?.sourceUrl}
							alt={attorney?.title}
							loading="lazy"
							width="260"
							height="260"
						/>
					</picture>
					<h2 class="name">
						{attorney?.title}
					</h2>
					<div class="email">
						<a href={`mailto:${attorney?.Attorney?.email}`}>
							{attorney?.Attorney?.email}
						</a>
					</div>
					<div>
						{@html attorney?.Attorney?.shortDescription}
					</div>
					<div>
						<details>
							<summary>
								<span class="more">Show More</span>
								<span class="less">Show Less</span>
							</summary>
							<div class="content">
								{@html attorney?.Attorney
									?.additionalDescription}
							</div>
						</details>
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
	import { scrollToHash } from '$milk/util/helpers.js';
	let id;
	let blockstyle = '';
	let blockclass = 'attorneys';
	$: blockclass = `attorneys ${blockstyle}`;
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
			// console.log(attorneys);
			setTimeout(scrollToHash, 1000);
		});
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_team(); // important for garbage collection otherwise memory leak
	});

	export { id, blockstyle };
</script>

<style>
	.attorneys {
		display: block;
		padding: 100px var(--padding-inner, 20px);
		text-align: center;
	}
	.attorneys-inner {
		margin: 0 auto;
		max-width: var(--content-width-max, 1020px);
	}
	.attorneys-list {
		margin-top: -100px;
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
			float: right;
			margin: 0 0 var(--padding-large) var(--padding-large);
		}
		.attorney:nth-child(odd) img {
			float: left;
			margin: 0 var(--padding-large) var(--padding-large) 0;
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
	details {
		max-width: unset !important;
	}
	summary {
		background: var(--color-white);
		color: var(--color-black);
		cursor: pointer;
		padding: 1rem 0;
	}
	.attorney:nth-child(even) summary {
		background: var(--color-offwhite);
	}
	summary::before {
		content: '';
	}
	summary span {
		cursor: pointer;
		text-transform: uppercase;
		font-weight: bold;
		display: inline-block;
		width: auto;
		position: relative;
	}
	summary .less {
		display: none;
	}
	details[open] summary .less {
		display: inline-block;
	}
	details[open] summary .more {
		display: none;
	}
	details .content {
		border: 0px none;
	}

	summary span::after {
		height: 2px;
		background-color: transparent;
		position: absolute;
		content: '';
		width: 0;
		margin: 0 50%;
		display: block;
		bottom: 0;
		left: 0;
		transition: margin 0.5s, width 0.5s, opacity 0.5s, color 0.5s,
			background-color 0.5s;
	}
	summary:hover span::after {
		margin: 0 -10%;
		width: 120%;
		opacity: 1;
		background-color: var(--color-three);
	}
</style>
