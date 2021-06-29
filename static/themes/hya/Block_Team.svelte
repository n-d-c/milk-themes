<div {id} class={blockclass}>
	<div class="team-inner">
		<h2>Your Legal Team</h2>
		<div class="blurb">
			<h3>
				We Believe in 24/7 Personal Access To Your Immigration Lawyers.
			</h3>
			<div class="block-content">
				<p>
					We reply to phone calls within 24 hours or less in most
					cases.
				</p>
				<p>
					We answer emails on nights and weekends, use texting during
					emergency cases, while our entire firm works together to win
					your case as your dedicated legal team.
				</p>
			</div>
		</div>
		<div class="attorneys-container">
			<div class="attorneys">
				{#each team as attorney}
					<a
						href={`/immigration-attorneys#${attorney?.slug}`}
						title={attorney?.title}
						class="attorney"
					>
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
								src={attorney?.Attorney?.pngImage?.sourceUrl}
								alt={attorney?.title}
								loading="lazy"
								width="260"
								height="260"
							/>
						</picture>
						<div class="name">
							{attorney?.title}
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
			</div>
		</div>
		<div class="long-arrow"><a href="/immigration-attorneys">⟶</a></div>
		<div>
			<a href="/immigration-attorneys" class="fancy-link">
				<span>View Our Attorneys</span>
			</a>
		</div>
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	let id;
	let blockstyle = '';
	let blockclass = 'team';
	$: blockclass = `team ${blockstyle}`;
	/* ## Data Loading ## */
	import { preload_attorneys } from '$graphql/sitespecific.preload.js';
	let team = preload_attorneys;
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
			// console.log(data);
			team = data.attorneys.nodes;
		});
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_team(); // important for garbage collection otherwise memory leak
	});

	export { id, blockstyle };
</script>

<style>
	.team {
		display: block;
		padding: 100px var(--padding-inner, 20px);
		text-align: center;
	}
	.team-inner {
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
		.team .blurb {
			margin: var(--padding);
			display: grid;
			grid-template-columns: 1fr 2fr;
			text-align: left;
			column-gap: 3em;
		}
	}
	/* .attorneys-container {
		overflow-x: hidden;
		width: 100%;
		max-width: 100vw;
	} */
	.attorneys {
		padding: var(--padding-large) 0 0;
		text-align: left;
		white-space: nowrap;
		overflow-x: hidden;
	}
	@media screen and (min-width: 1200px) {
		.attorneys {
			overflow-x: visible;
		}
	}
	.attorney {
		display: inline-block;
		vertical-align: top;
		margin: 0 var(--padding) var(--padding) 0;
		transition: color var(--transition-speed);
	}
	@media screen and (max-width: 650px) {
		.attorneys {
			padding: var(--padding-large);
		}
		.attorney {
			display: none;
			margin: 0 auto;
		}
		.attorney:first-child {
			display: block;
		}
		.attorney:first-child img {
			width: 100%;
			height: auto;
		}
	}
	.attorney .name {
		background: var(--color-white);
		padding: var(--padding);
		color: var(--color-black);
		font-weight: bold;
		font-family: var(--font-main) !important;
	}
	.attorney .name .go {
		display: inline-block;
		vertical-align: middle;
		float: right;
		width: 20px;
		height: 20px;
		margin-top: -5px;
		transition: color var(--transition-speed);
	}
	.attorney:hover .name .go {
		color: var(--color-three);
		transition: color var(--transition-speed);
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
</style>
