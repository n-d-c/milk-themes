<div {id} class={blockclass}>
	<div class="videos-inner">
		<div class="videos-list">
			{#each videos as video}
				<div id={video?.slug} class="video">
					<div class="video-img">
						<a
							href={video?.Video?.video}
							target="_blank"
							rel="noreferrer"
							title="Watch Video"
						>
							<picture>
								<source
									type="image/avif"
									srcset={video?.Video?.avifImage?.sourceUrl}
								/>
								<source
									type="image/webp"
									srcset={video?.Video?.webpImage?.sourceUrl}
								/>
								<img
									src={video?.Video?.jpgImage?.sourceUrl}
									alt={video?.title}
									loading="lazy"
									width="300"
									height="169"
								/>
							</picture>
						</a>
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
	let id;
	let blockstyle = '';
	let blockclass = 'videos';
	$: blockclass = `videos ${blockstyle}`;
	/* ## Data Loading ## */
	import { preload_videos } from '$graphql/sitespecific.preload.js';
	let videos = preload_videos;
	let unsubscribe_videos = () => {};
	import { Q_GET_VIDEOS } from '$graphql/sitespecific.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		let queryVariables = { size: 999 };
		let getVideos = $milk?.data?.gql(
			Q_GET_VIDEOS,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_videos = await getVideos?.subscribe(
			async (fetched_data) => {
				let data = await fetched_data;
				// console.log(data);
				videos = data.videos.nodes;
			}
		);
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_videos(); // important for garbage collection otherwise memory leak
	});
	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.videos {
		display: block;
		padding: 0;
		text-align: center;
	}
	@media screen and (min-width: 650px) {
		.videos {
			padding: 50px var(--padding-inner, 20px);
		}
	}
	.videos-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
	}
	.videos-list {
		display: grid;
		column-gap: 2em;
		grid-template-columns: 100%;
	}
	@media screen and (min-width: 850px) {
		.videos-list {
			grid-template-columns: calc(50% - 1em) calc(50% - 1em);
		}
	}
	.video {
		text-align: center;
		padding: 25px;
		margin-bottom: 2em;
	}
	.video-img {
		position: relative;
	}
	.video-img img {
		width: 100%;
		height: auto;
	}
	.video-description {
		font-size: var(--small-fontsize);
		font-style: italic;
	}
	h2 a:hover {
		text-decoration: none;
	}
</style>
