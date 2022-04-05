<svelte:head>
	<!-- {#each blog_css as css}
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
	{/each} -->
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
	{#each blog_posts as blog_post}
		<Head_Article author={blog_post?.author?.node?.name} pubdate={blog_post?.date} />
		<Hero
			id="blog-post-hero"
			image_url={blog_post?.featuredImage?.node?.sourceUrl}
			img_srcset={blog_post?.featuredImage?.node?.srcSet}
			avif_srcset=""
			webp_srcset=""
			title="Harlan York and Associates"
			parallax="false">&nbsp;</Hero
		>
		<Block_CallOutText
			id="call-out-text"
			blockstyle="block-style01"
			extraclasses="floating-calltoaction"
			title={blog_post?.title}
		>

			{@html description}
			
		</Block_CallOutText>
		<div class="content">
			<div class="content-inner">
				<div class="blog-topbar">
					<div class="breadcrumbs">
						<a href="/">Home</a>
						›
						<a href="/immigration-law-services">Services</a>
						›
						<a href={`/immigration-law-services/${blog_post?.slug}`}>{blog_post?.title}</a>
					</div>
				</div>
				<div class="blog-content">
					{@html blog_post?.content}
				</div>
				
			</div>
		</div>
		<FeaturedVideo
		id="featured-video"
		blockstyle=""
		video_source="//player.vimeo.com/video/108146056"
		video_jpg="/img/video_featured.jpg"
		video_webp="/img/video_featured.webp"
		video_avif="/img/video_featured.avif"
		/>
		{#if blog_post?.Services?.serviceFaq}
		<div class="outer-wrap margin-sides-large bg-white">
			<h2>frequently asked questions</h2>
			<div class='flex-wrap'>	
			{#each blog_post?.Services?.serviceFaq as faq}

				<Block_FaqItem title={faq?.faqTitle} content={faq?.faqContent} />
				

			{/each}
			</div>
		</div>
		{/if}
		{#if blog_post?.Services?.relatedPosts}
		<div class="outer-wrap margin-sides-large">
			<h2>related blog posts</h2>
			<div class='flex-wrap'>	
			{#each blog_post?.Services?.relatedPosts as relatedPost}
				
				<div class="related-post-wrap">
					<div class='img-wrap'><a href={`/immigration-law-blog/${relatedPost?.slug}`}><img src={relatedPost?.featuredImage?.node.sourceUrl} alt=""></a></div>
					<div class="bg-grey">
						<h3><a href={`/immigration-law-blog/${relatedPost?.slug}`}>{relatedPost?.title}</a></h3>
					</div>
				</div>

			{/each}
			</div>
		</div>
		{/if}
		<div class="service-info">
			<h2>We are here to answer all your questions about {blog_post?.title}</h2>
			<p>
				You don't have to try to find the answers to your questions online. Please don't try to do your immigration paperwork on your own. Call a team of experienced professionals in immigration law.
			</p>
			<p>
				<strong>
					US Immigration is processing visas and green cards. We are now seeing clients in carefully arranged times at our offices.
				</strong>
			</p>
		</div>
	{/each}

	<Block_Testimonials id="testimonials" blockstyle="block-style05" />

	
	<Block_CallToAction
		id="call-to-action"
		blockstyle="block-style01"
		extraclasses="regular-calltoaction"
	/>
	<Block_LanguagesWeSpeak />
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
	import Block_Testimonials from '$theme/Block_Testimonials.svelte';
	import Block_Featured from '$theme/Block_Featured.svelte';
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_Ratings from '$theme/Block_Ratings.svelte';
	import Block_FaqItem from '$theme/Block_FaqItem.svelte';
	import FeaturedVideo from '$milk/lib/FeaturedVideo.svelte';
	/* ## Variables ## */
	let title = `Immigration Services - ${$milk?.site?.title}`;
	let description = $milk?.site?.description;
	let image = $milk?.site?.facebook_photo;
	let slug = $page.params.slug;
	let themestyle = '';
	$: themestyle = `/themes/${$milk.config.theme}/style.css`;
	/* ## Data Loading ## */
	let unsubscribe = () => {};
	let blog_posts = [];
	let blog_css = [];
	let blog_scripts = [];
	let post_date = new Date();
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
	import { Q_GET_SERVICE } from '$graphql/sitespecific.graphql.js';
	import { createEventDispatcher, each } from 'svelte/internal';
// import BlockFaqItem from 'static/themes/hya/Block_FaqItem.svelte';
	/* ## Main ## */
	onMount(async () => {
		slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
		let queryVariables = { id: slug };
		let getService = $milk?.data?.gql(
			Q_GET_SERVICE,
			$milk.data.sources.wordpress,
			queryVariables,
			false,
			0
		);

		unsubscribe = await getService?.subscribe(async (fetched_data) => {
			let data = await fetched_data;
			post_date = new Date(data?.service?.date);
			blog_css = data?.service?.enqueuedStylesheets?.nodes || [];
			blog_scripts = data?.service?.enqueuedScripts?.nodes || [];
			blog_posts = [data?.service];
			title = data?.service?.title;
			description = data?.service.Services?.excerpt;
			image = data?.featuredImage?.node?.sourceUrl;
		});
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe(); // important for garbage collection otherwise memory leak
	});
	export { slug };


</script>	

<style>
	.blog-topbar { position: relative; margin: 20px 0 20px; }
	.breadcrumbs { font-size: var(--small-fontsize); }
	.breadcrumbs a { color: var(--color-black); }
	.breadcrumbs a:hover { color: var(--color-four); }

	.flex-wrap{
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
		gap: 10px;
	}
	@media screen and (max-width:768px){
		.flex-wrap{
			justify-content: flex-start;
		}
	}

	.related-post-wrap{
		width: 49%;
	}@media screen and (max-width:768px){
		.related-post-wrap{
			width: 100%;
		}
	}	

	.outer-wrap{
		margin:var(--margin-Xl) var(--margin-Xl);
		padding: var(--padding);
	}

	h2{
		text-transform: capitalize;
		text-align: center;
		font-size: var(--extralarge-fontsize);
		margin: 1em 0;
		color: var(--color-black);
	}
	
	

	.bg-grey{
		padding: var(--padding-med);
		background-color: var(--color-eight);
	}
	
	.bg-grey>h3>a{
		color: white;
	}

	.bg-white{
		background-color: white;
		box-shadow: -1px 2px 8px -2px;
	}

	.service-info{
		margin:0 var(--margin-Xl);
		padding: var(--padding-med);
		text-align: center;
	}

	
	
	
</style>
