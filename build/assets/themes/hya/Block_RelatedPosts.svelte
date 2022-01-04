<div>
	<div class="related_posts-inner">
		<div class="related_posts-list" />
	</div>
</div>

<script>
	export { id, postType };
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';

	import { Q_GET_SERVICE_RELATED } from '$graphql/sitespecific.graphql.js';

	/* ## Data Loading ## */
	let unsubscribe = () => {};
	let blog_posts = [];

	/* ## Main ## */
	onMount(async () => {
		slug = window.location.href.substring(
			window.location.href.lastIndexOf('/') + 1
		);
		let queryVariables = { id: slug };
		let getService = $milk?.data?.gql(
			Q_GET_SERVICE_RELATED,
			$milk.data.sources.wordpress,
			queryVariables,
			false,
			0
		);

		unsubscribe = await getService?.subscribe(async (fetched_data) => {
			let data = await fetched_data;
			console.log('what is data: ' + data);
			blog_posts = [data?.service?.Services];
			title = data?.service?.title;
			description = data?.service.Services?.excerpt;
			image = data?.featuredImage?.node?.sourceUrl;
		});
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe(); // important for garbage collection otherwise memory leak
	});
</script>
