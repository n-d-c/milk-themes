<Head_Language lang="en" />
<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />
<Head_Facebook {title} {description} image="/img/hero_homepage_01.jpg" />
<Head_Twitter {title} {description} image="/img/hero_homepage_01.jpg" />
<Layout_Main id="page-homepage">
	<Hero
		id="hero-home-01"
		image_url="/img/hya-404-page.jpg"
		img_srcset="/img/hya-404-page.jpg"
		avif_srcset="/img/hya-404-page.avif"
		image_loading="eager"
		webp_srcset="/img/hya-404-page.webp"
		title="Harlan York and Associates"
		parallax="false"
	>
		<h1 class="darker-bg">
			We couldn't find that page. If your search matches an available post
			you will be redirected shortly
		</h1>
	</Hero>
	<!-- Used '==' instead of '===' to match string/number status code (just to be sure) -->
	<h1 class="error-code">Error: 404</h1>
</Layout_Main>

<script>
	import { milk } from '$milk/milk';
	/* ## Components ## */
	import Hero from '$milk/lib/Hero.svelte';
	import Head_Language from '$milk/lib/Head_Language.svelte';
	import Head_HTML from '$milk/lib/Head_HTML.svelte';
	import Head_Facebook from '$milk/lib/Head_Facebook.svelte';
	import Head_Twitter from '$milk/lib/Head_Twitter.svelte';
	import Layout_Main from '$theme/Layout_Main.svelte';
	import { onMount, onDestroy } from 'svelte';
	let unsubscribe = () => {};
	export let status;
	let slug;
	import { Q_GET_POST_BYSLUG } from '$graphql/wordpress.graphql.js';
	let title = $milk?.site?.title;
	let description =
		'Protecting The Rights of Immigrants Across America for a Quarter Century';

	onMount(async () => {
		slug = window.location.href.substring(
			window.location.href.lastIndexOf('/') + 1
		);
		let queryVariables = { slug: slug };
		let getPost = $milk?.data?.gql(
			Q_GET_POST_BYSLUG,
			$milk.data.sources.wordpress,
			queryVariables,
			false,
			0
		);
		unsubscribe = await getPost?.subscribe(async (fetched_data) => {
			let data = await fetched_data;

			if (data.postBy != null) {
				window.location = `/immigration-law-blog/${slug}`;
			}
		});
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe(); // important for garbage collection otherwise memory leak
	});
	export { slug };
</script>

<style>
	.darker-bg {
		background-color: rgba(0, 0, 0, 0.5);
		padding: 1em;
	}
	.error-code {
		font-size: 5rem;
		text-align: center;
	}
</style>
