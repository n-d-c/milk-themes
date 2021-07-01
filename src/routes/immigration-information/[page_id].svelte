<svelte:head>
	{#each blog_css as css}
		<link
			async
			href={ (css.src.startsWith('http')) ? `${css.src}` : `${$milk.site.admin_url}${css.src}` }
			rel="preload"
			as="style"
		/>
		<link
			async
			href={ (css.src.startsWith('http')) ? `${css.src}` : `${$milk.site.admin_url}${css.src}` }
			rel="stylesheet"
		/>
	{/each}
	{#each blog_scripts as script}
		<script
			defer
			src={ (script.src.startsWith('http')) ? `${script.src}` : `${$milk.site.admin_url}${script.src}` }
		/>
	{/each}
	<link rel="stylesheet" href={themestyle} />
</svelte:head>

<Head_Language lang="en" />
<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />
<Head_Facebook {title} {description} {image} />
<Head_Twitter {title} {description} {image} />
<Layout_Main id="blog-post">
	{#each blog_pages as blog_page}
		<Head_Article author={blog_page?.author?.node?.name} pubdate={blog_page?.date} />
		<Hero
			id="blog-post-hero"
			image_url={blog_page?.featuredImage?.node?.sourceUrl}
			img_srcset={blog_page?.featuredImage?.node?.srcSet}
			avif_srcset=""
			webp_srcset=""
			title="Harlan York and Associates"
			parallax="false">&nbsp;</Hero
		>
		<Block_CallOutText
			id="call-out-text"
			blockstyle="block-style01"
			extraclasses="floating-calltoaction"
			title={blog_page?.title}
		>
			<div class="callout-detials">
				By: {blog_page?.author?.node?.name}
				&nbsp;&nbsp;|&nbsp;&nbsp;
				{months[page_date.getMonth()]}
				{page_date.getDate()},
				{page_date.getFullYear()}
			</div>
		</Block_CallOutText>
		<div class="content">
			<div class="content-inner">
				<div class="blog-topbar">
					<div class="breadcrumbs">
						<a href="/">Home</a>
						›
						<a href={`/immigration-information/${blog_page?.pageId}`}>{blog_page?.title}</a>
					</div>
				</div>	
				{@html blog_page?.content}
			</div>
		</div>
	{/each}
	<Block_Testimonials id="testimonials" blockstyle="block-style05" />

	<Block_CallToAction
		id="call-to-action"
		blockstyle="block-style01"
		extraclasses="regular-calltoaction"
	/>
	<Block_LanguagesWeSpeak />
	<Block_Languages id="languages" blockstyle="block-style04" />
	<Block_Featured id="featured" blockstyle="" />
	<Block_Ratings id="ratings" blockstyle="" />
	<SocialMedia id="socialmedia" blockstyle="" />
</Layout_Main>

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Head_Language from '$milk/lib/Head_Language.svelte';
	import Head_HTML from '$milk/lib/Head_HTML.svelte';
	import Head_Facebook from '$milk/lib/Head_Facebook.svelte';
	import Head_Twitter from '$milk/lib/Head_Twitter.svelte';
	import Head_Article from '$milk/lib/Head_Article.svelte';
	import Layout_Main from '$theme/Layout_Main.svelte';
	import Hero from '$milk/lib/Hero.svelte';
	import Block_CallOutText from '$theme/Block_CallOutText.svelte';
	import Block_ServicesList from '$theme/Block_ServicesList.svelte';
	import Block_CallToAction from '$theme/Block_CallToAction.svelte';
	import Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';
	import Block_Languages from '$theme/Block_Languages.svelte';
	import Block_Testimonials from '$theme/Block_Testimonials.svelte';
	import Block_Featured from '$theme/Block_Featured.svelte';
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_Ratings from '$theme/Block_Ratings.svelte';
	/* ## Variables ## */
	let title = `Immigration Services - ${$milk?.site?.title}`;
	let description = $milk?.site?.description;
	let image = $milk?.site?.facebook_photo;
	let page_id = $page.params.slug;
	let themestyle = '';
	$: themestyle = `/themes/${$milk.config.theme}/style.css`;
	/* ## Data Loading ## */
	let unsubscribe = () => {};
	let blog_pages = [];
	let blog_css = [];
	let blog_scripts = [];
	let page_date = new Date();
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
	import { Q_GET_PAGE_BYID } from '$graphql/wordpress.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		page_id = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
		let queryVariables = { id: page_id };
		let getPost = $milk?.data?.gql(
			Q_GET_PAGE_BYID,
			$milk.data.sources.wordpress,
			queryVariables,
			false,
			0
		);
		unsubscribe = await getPost?.subscribe(async (fetched_data) => {
			let data = await fetched_data;
			page_date = new Date(data?.pageBy?.date);
			blog_css = data?.pageBy?.enqueuedStylesheets?.nodes || [];
			blog_scripts = data?.pageBy?.enqueuedScripts?.nodes || [];
			blog_pages = [data?.pageBy];
			title = data?.title;
			description = data?.excerpt;
			image = data?.featuredImage?.node?.sourceUrl;
		});
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe(); // important for garbage collection otherwise memory leak
	});
	export { page_id };
</script>

<style>
	.blog-topbar { position: relative; margin: -20px 0 20px; }
	.breadcrumbs { font-size: var(--small-fontsize); }
	.breadcrumbs a { color: var(--color-black); }
	.breadcrumbs a:hover { color: var(--color-four); }
</style>
