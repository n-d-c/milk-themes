<div class="blog-index">
	<div class="blog-inner">
		<div class="posts-grid posts-listing">
			{#each posts as post}
				<div class="post">
					<div title={`${post?.title}`}>
						<a
							href={`${blog_path}/${post?.slug}`}
							title={`${post?.title}`}
						>
							<span class="post-title">{post?.title}</span>
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
	import { debounce } from '$milk/util/helpers.js';
	/* ## Vairables ## */
	let blog_path = '/blog';
	let posts = [];
	/* ## Data Loading ## */
	let unsubscribe_blogs = async () => {};
	import { Q_LIST_ALL_POSTS } from '$graphql/wordpress.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		await debouncedBlogListing();
	});
	const getBlogListing = async () => {
		let queryVariables = {};
		let getBlogs = $milk?.data?.gql(
			Q_LIST_ALL_POSTS,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_blogs = await getBlogs?.subscribe(async (fetched_data) => {
			let data = await fetched_data;
			console.log(data);
			posts = data?.posts?.nodes;
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
	export { blog_path };
</script>

<style>
	.blog-index {
		position: absolute;
		margin-left: -999em;
		left: -999em;
	}
</style>
