<div class="blog">
	<div class="blog-inner">
		<slot name="before"><h2>Blog Posts</h2></slot>
		<div class="posts-grid posts-listing">
			{#each posts as post}
				<div class="post">
					<div
						href={`${blog_path}/${post?.slug}`}
						title={`${post?.title}`}
					>
						<a
							href={`${blog_path}/${post?.slug}`}
							title={`${post?.title}`}
						>
							<picture>
								{#if post?.featuredImage?.node?.srcSet}
									<source
										type="image/jpeg"
										srcset={post?.featuredImage?.node
											?.srcSet}
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
						</a>
						<h3>
							<a
								href={`${blog_path}/${post?.slug}`}
								title={`${post?.title}`}
							>
								<span class="post-title">{post?.title}</span>
							</a>
						</h3>
						<div class="post-detials">
							By: {post?.author?.node?.name}
							&nbsp;&nbsp;|&nbsp;&nbsp;
							{getDate(post?.date)}
						</div>
						<div class="excerpt">
							{@html post?.excerpt}
						</div>
						<div class="more">
							<a
								href={`${blog_path}/${post?.slug}`}
								title={`${post?.title}`}
								class="fancy-link"
							>
								<span>Read More</span>
							</a>
						</div>
					</div>
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
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	let posts = [];
	/* ## Data Loading ## */
	let unsubscribe_blogs = () => {};
	import { Q_LIST_POSTS } from '$graphql/wordpress.graphql.js';
	/* ## Main ## */
	const getDate = (date) => {
		let post_date = new Date(date);
		return `${
			months[post_date.getMonth()]
		} ${post_date.getDate()}, ${post_date.getFullYear()}`;
	};
	onMount(async () => {
		let queryVariables = {
			category: 'Featured',
			offset: parseInt(offset),
			size: parseInt(size),
		};
		let getBlogs = $milk?.data?.gql(
			Q_LIST_POSTS,
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

	export { id, blockstyle, blog_path, size, offset, pagination };
</script>

<style>
	.blog {
		display: block;
		padding: 50px var(--padding-inner, 20px);
		color: var(--color-black, #000);
		text-align: center;
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
		padding: var(--padding-large);
		text-align: left;
		width: auto;
		max-width: unset;
	}
	.post h3 a {
		color: var(--color-black);
	}
	.post h3 a:hover {
		color: var(--color-four);
		text-decoration: none;
	}
	.post:nth-child(even) {
		background: var(--color-offwhite);
	}
	.post .more {
		clear: both;
	}
	.post img {
		margin-bottom: calc(var(--padding) * 2);
	}
	@media screen and (min-width: 650px) {
		.post:nth-child(odd) img {
			float: left;
			margin: 0 calc(var(--padding) * 2) calc(var(--padding) * 2) 0;
		}
		.post:nth-child(even) img {
			float: right;
			margin: 0 0 calc(var(--padding) * 2) calc(var(--padding) * 2);
		}
		.post:nth-child(odd) .more {
			text-align: right;
		}
	}
	.post-detials {
		font-size: var(--small-fontsize);
		margin-bottom: 15px;
	}
</style>
