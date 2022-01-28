<div {id} class={blockclass}>
	<div class="ebooks-inner">
		<div class="ebooks-list">
			{#each ebooks as ebook}
				<div id={ebook?.slug} class="ebook block-style04">
					<div class="ebook-img">
						<a
							href={ebook?.eBook?.pdf?.mediaItemUrl}
							target="_blank"
							rel="noreferrer"
							title="Read eBook"
						>
							<picture>
								<source
									type="image/avif"
									srcset={ebook?.eBook?.avifImage?.sourceUrl}
								/>
								<source
									type="image/webp"
									srcset={ebook?.eBook?.webpImage?.sourceUrl}
								/>
								<img
									src={ebook?.eBook?.pngImage?.sourceUrl}
									alt={ebook?.title}
									loading="lazy"
									width="200"
									height="275"
								/>
							</picture>
						</a>
					</div>
					<div class="ebook-content">
						<h2>
							<a
								href={ebook?.eBook?.pdf?.mediaItemUrl}
								target="_blank"
								rel="noreferrer"
								title="Read eBook"
							>
								{ebook?.title}
							</a>
						</h2>
						<div class="ebook-description">
							{@html ebook?.eBook?.shortDescription}
						</div>
						<Block_DownloadEbook
							downloadLink={ebook?.eBook?.pdf?.mediaItemUrl}
							eBookTitle={ebook?.title}
						/>
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
	import { stripTags } from '$milk/util/helpers.js';
	/* ## Blocks ## */
	import Block_DownloadEbook from '$theme/Block_DownloadEbook.svelte';

	let id;
	let blockstyle = '';
	let blockclass = 'ebooks';
	$: blockclass = `ebooks ${blockstyle}`;

	/* ## Data Loading ## */
	import { preload_ebooks } from '$graphql/sitespecific.preload.js';
	let ebooks = preload_ebooks;
	let unsubscribe_ebooks = () => {};
	import { Q_GET_EBOOKS } from '$graphql/sitespecific.graphql.js';
	/* ## Main ## */
	let cleanUp = (html) => {
		return html.replace(/\u00a0/g, ' ');
	};
	onMount(async () => {
		cleanUp = (html) => {
			return stripTags(html).replace(/\u00a0/g, ' ');
		};
		let queryVariables = { size: 999 };
		let getEBooks = $milk?.data?.gql(
			Q_GET_EBOOKS,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_ebooks = await getEBooks?.subscribe(
			async (fetched_data) => {
				let data = await fetched_data;
				// console.log(data);
				ebooks = data.eBooks.nodes;
			}
		);
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_ebooks(); // important for garbage collection otherwise memory leak
	});
	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.ebooks {
		display: block;
		padding: 0;
		text-align: center;
	}
	@media screen and (min-width: 650px) {
		.ebooks {
			padding: 50px var(--padding-inner, 20px);
		}
	}
	.ebooks-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
	}
	.ebooks-list {
		display: grid;
		column-gap: 2em;
		grid-template-columns: 100%;
	}
	@media screen and (min-width: 850px) {
		.ebooks-list {
			grid-template-columns: calc(50% - 1em) calc(50% - 1em);
		}
	}
	.ebook {
		text-align: center;
		padding: 25px;
		margin-bottom: 2em;
	}
	@media screen and (min-width: 450px) {
		.ebook {
			text-align: left;
			display: grid;
			column-gap: 2em;
			grid-template-columns: 30% 60%;
		}
	}
	.ebook-img {
		position: relative;
	}
	.ebook-img img {
		width: 100%;
		height: auto;
		max-width: 200px;
		margin-bottom: 20px;
	}
	.ebook-description {
		font-size: var(--small-fontsize);
		font-style: italic;
	}
	h2 a:hover {
		text-decoration: none;
	}
</style>
