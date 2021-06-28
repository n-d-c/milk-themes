<div class="blog">
	<div class="blog-inner">
		<slot name="before"><h2>{title}</h2></slot>
		<div class="posts-grid posts-listing">
			<div id="BlogTop" />
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
			{:else}
				<div>
					<h2 style="text-align: center;">
						Looking for matching Blog Posts
					</h2>
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
	import { debounce } from '$milk/util/helpers.js';
	/* ## Vairables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'featured-blog';
	$: blockclass = `featured-blog ${blockstyle}`;
	let blog_path = '/blog';
	let size = 10;
	let offset = 0;
	let count = 0;
	let category = '';
	let search = '';
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
	let title = 'Blog Posts';
	let posts = [];
	$: {
		categoryChange(category);
	}
	$: {
		debouncedSearch(search);
	}
	$: {
		doPage(offset);
	}
	$: {
		doPerPage(size);
	}
	/* ## Data Loading ## */
	let unsubscribe_blogs = async () => {};
	let categoryChange = () => {};
	let doSearch = () => {};
	let debouncedSearch = () => {};
	let doPage = () => {};
	let doPerPage = () => {};
	import {
		Q_LIST_POSTS,
		Q_LIST_POSTS_BYCAT,
	} from '$graphql/wordpress.graphql.js';
	/* ## Main ## */
	const getDate = (date) => {
		let post_date = new Date(date);
		return `${
			months[post_date.getMonth()]
		} ${post_date.getDate()}, ${post_date.getFullYear()}`;
	};
	onMount(async () => {
		await debouncedBlogListing();
		categoryChange = (category) => {
			if (category != '') {
				search = '';
				offset = 0;
			}
			debouncedBlogListing();
		};
		doSearch = (search) => {
			if (search && search != '') {
				category = '';
				offset = 0;
			}
			debouncedBlogListing();
		};
		doPage = (offset) => {
			debouncedBlogListing();
		};
		doPerPage = (size) => {
			debouncedBlogListing();
		};
		debouncedSearch = debounce(
			() => {
				doSearch(search);
			},
			500,
			false
		);
	});
	const getBlogListing = async () => {
		try {
			await unsubscribe_blogs();
		} catch (err) {}
		let THE_QUERY = category == '' ? Q_LIST_POSTS : Q_LIST_POSTS_BYCAT;
		let queryVariables = {
			offset: parseInt(offset),
			size: parseInt(size),
		};
		if (category != '') {
			queryVariables.category = category;
		} else if (search != '') {
			queryVariables.search = search;
		}
		let getBlogs = $milk?.data?.gql(
			THE_QUERY,
			$milk.data.sources.wordpress,
			queryVariables,
			false,
			0
		);
		unsubscribe_blogs = await getBlogs?.subscribe(async (fetched_data) => {
			let data = await fetched_data;
			// console.log(data);
			posts = data?.posts?.nodes;
			count = data?.posts?.nodes?.length ?? 0;
			if (category != '') {
				title = `Blog Category: ${category}`;
			} else if (search && search != '') {
				title = `Blog Search: ${search}`;
				window.history.pushState(
					{ additionalInformation: `Blog Search: ${search}` },
					`Blog Search: ${search}`,
					`${
						window.location.href.split('?')[0]
					}?s=${encodeURIComponent(search)}`
				);
			} else {
				title = `Blog Posts`;
				if (window?.location?.href?.split('?')?.[1]) {
					window.history.pushState(
						{ additionalInformation: `Blog Listing` },
						`Blog Listing`,
						`${window.location.href.split('?')[0]}`
					);
				}
			}
			// console.log(count);
		});
	};
	const debouncedBlogListing = debounce(
		() => {
			getBlogListing();
		},
		500,
		false
	);
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_blogs(); // important for garbage collection otherwise memory leak
	});

	export {
		id,
		blockstyle,
		blog_path,
		size,
		offset,
		count,
		category,
		search,
		title,
	};
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
