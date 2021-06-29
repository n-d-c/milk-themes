<div {id} class={blockclass}>
	<div class="ebooks-inner">
		<div class="ebooks-list">
			<div class="ebook block-style02">
				<div class="ebook-img">
					<a
						href="https://3degreesoflaw.com/"
						target="_blank"
						rel="noreferrer"
					>
						<picture>
							<source
								type="image/avif"
								srcset="/img/harlans-3degree-book.avif"
							/>
							<source
								type="image/webp"
								srcset="/img/harlans-3degree-book.webp"
							/>
							<img
								src="/img/harlans-3degree-book.jpg"
								alt="Three Dregrees of Law"
								loading="lazy"
								width="359"
								height="595"
							/>
						</picture>
					</a>
				</div>
				<div class="ebook-content">
					<h2>
						<a
							href="https://3degreesoflaw.com/"
							target="_blank"
							rel="noreferrer"
						>
							Three Dregrees of Law
						</a>
					</h2>
					<div class="ebook-description">
						<h3>
							UNLOCKING THE SECRETS TO HAPPINESS IN THE LEGAL
							UNIVERSE
						</h3>
						<p>
							“To be happy and successful as a lawyer find a path
							that you love, practice the best way you can, and
							work with compassion.” Harlan York
						</p>
						<p>
							Not just for law students or attorneys, Three
							Degrees of Law is for anyone who has ever questioned
							what they do, and wondered how they could improve
							not only their output, but also their own sense of
							satisfaction. It lays down a road map for how to be
							happy, successful and fulfilled no matter your line
							of work.
						</p>
					</div>
					<div>
						<a
							href="https://3degreesoflaw.com/"
							target="_blank"
							rel="noreferrer"
							class="fancy-link"
						>
							<span> Purchase the Book </span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
	/* ## Svelte ## */
	// import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	// import { milk } from '$milk/milk.js';
	// import { stripTags } from '$milk/util/helpers.js';
	// import { scrollToHash } from '$milk/util/scroll.js';
	let id;
	// let wpid;
	let blockstyle = '';
	let blockclass = 'ebooks';
	$: blockclass = `ebooks ${blockstyle}`;
	/* ## Data Loading ## */
	// import { preload_ebooks } from '$graphql/sitespecific.preload.js';
	// let ebooks = [];
	// let unsubscribe_ebooks = () => {};
	// import { Q_GET_EBOOKBYID } from '$graphql/sitespecific.graphql.js';
	// /* ## Main ## */
	// let cleanUp = (html) => {
	// 	return html.replace(/\u00a0/g, ' ');
	// };
	// onMount(async () => {
	// 	cleanUp = (html) => {
	// 		return stripTags(html).replace(/\u00a0/g, ' ');
	// 	};
	// 	let queryVariables = { id: wpid };
	// 	let getEBooks = $milk?.data?.gql(
	// 		Q_GET_EBOOKBYID,
	// 		$milk.data.sources.wordpress,
	// 		queryVariables
	// 	);
	// 	unsubscribe_ebooks = await getEBooks?.subscribe(
	// 		async (fetched_data) => {
	// 			let data = await fetched_data;
	// 			console.log(data);
	// 			ebooks = [data.eBookBy];
	// 			// setTimeout(scrollToHash, 1000);
	// 		}
	// 	);
	// });
	/* ## Exit ## */
	// onDestroy(() => {
	// 	unsubscribe_ebooks(); // important for garbage collection otherwise memory leak
	// });
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

	.ebooks-list {
		margin: auto;
	}
	@media screen and (min-width: 650px) {
		.ebooks-list {
			position: relative;
			z-index: 200;
			max-width: 700px;
			text-align: center; /* transition: margin ease 1s; */
		}
	}
</style>
