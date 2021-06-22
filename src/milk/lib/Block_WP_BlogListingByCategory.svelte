<div class="blog">
	<div class="blog-inner">
		<slot name="before"><h2>Blog Posts</h2></slot>
		<div class="posts-grid posts-listing">
			{#each posts as post}
				<div class="post">
					<a
						href={`${blog_path}/${post?.slug}`}
						title={`${post?.title}`}
					>
						<picture>
							{#if post?.featuredImage?.node?.srcSet}
								<source
									type="image/jpeg"
									srcset={post?.featuredImage?.node?.srcSet}
								/>
							{/if}
							<img
								src={post?.featuredImage?.node?.sourceUrl ||
									'/milk/img/post_noimage.webp'}
								alt={post?.title}
								loading="lazy"
								width="250"
								height="141"
							/>
						</picture>
						<h3>
							<span class="post-title">{post?.title}</span>
							<span class="more">
								<slot name="more">
									<svg
										aria-hidden="true"
										focusable="false"
										role="img"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 320 512"
									>
										<path
											fill="currentColor"
											d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
										/>
									</svg>
								</slot>
							</span>
						</h3>
					</a>
				</div>
			{/each}
		</div>
		<slot name="after" />
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Vairables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'featured-blog';
	$: blockclass = `featured-blog ${blockstyle}`;
	let blog_path = '/blog';
	let size = 10;
	let offset = 0;
	let pagination = false;
	let category = 'Featured';

	let posts = [];
	/* ## Data Loading ## */
	let unsubscribe_blogs = () => {};
	import { Q_LIST_POSTS_BYCAT } from '$graphql/wordpress.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		let queryVariables = {
			category: 'Featured',
			offset: parseInt(offset),
			size: parseInt(size),
		};
		let getBlogs = $milk?.data?.gql(
			Q_LIST_POSTS_BYCAT,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_blogs = await getBlogs?.subscribe(async (fetched_data) => {
			let data = await fetched_data;
			console.log(data);
			posts = data?.posts?.nodes;
		});
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_blogs(); // important for garbage collection otherwise memory leak
	});

	export { id, blockstyle, blog_path, size, offset, pagination, category };
</script>

<style>
	.blog {
		display: block;
		padding: 50px var(--padding-inner, 20px);
		color: var(--color-black, #000);
		text-align: center;
		background: var(--background-offwhite, #f4f4f4);
	}
	.blog-inner {
		margin: 0 auto;
		max-width: var(--content-width-max, 1020px);
	}
	h2,
	h3,
	p {
		color: var(--color-black, #000);
	}
	.post {
		max-width: 75%;
	}
</style>
