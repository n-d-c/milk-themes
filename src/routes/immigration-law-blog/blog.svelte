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
			<div class="callout-detials">
				By: {blog_post?.author?.node?.name}
				&nbsp;&nbsp;|&nbsp;&nbsp;
				{months[post_date.getMonth()]}
				{post_date.getDate()},
				{post_date.getFullYear()}
			</div>
		</Block_CallOutText>
		<div class="content">
			<div class="content-inner">
				<div class="blog-topbar">
					<div class="breadcrumbs">
						<a href="/">Home</a>
						›
						<a href="/immigration-law-blog">Blog</a>
						›
						<a href={`/immigration-law-blog/${blog_post?.slug}`}>{blog_post?.title}</a>
					</div>
				</div>	
				{@html blog_post?.content}
				<div class="author">
					<div class="author-image">
						<picture>
							<source
								type="image/avif"
								srcset={blog_post?.author?.node?.Users?.avifImage
									?.sourceUrl}
							/>
							<source
								type="image/webp"
								srcset={blog_post?.author?.node?.Users?.webpImage
									?.sourceUrl}
							/>
							<img
								src={blog_post?.author?.node?.Users?.jpegImage?.sourceUrl}
								alt={blog_post?.author?.node?.name}
								loading="lazy"
								width="260"
								height="260"
							/>
						</picture>
					</div>
					<div class="author-content">
						<h2>About {blog_post?.author?.node?.name}</h2>
						<p>{blog_post?.author?.node?.description}</p>
						<div class="author-links">
							{#if blog_post?.author?.node?.Users?.attorneyLink}
								<a
									href={blog_post?.author?.node?.Users?.attorneyLink}
									title={blog_post?.author?.node?.name}
									class="button"
								>
									View Full Bio
								</a>
							{/if}
							<a href="/immigration-attorneys" class="fancy-link">
								<span>See Our Attorneys</span>
							</a>
						</div>
					</div>
				</div>
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
	import { Q_GET_POST_BYSLUG } from '$graphql/wordpress.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const checkSlug = urlParams.get('slug');
		if (checkSlug && checkSlug.length > 1) {
			slug = checkSlug;
		} else {
			slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
		};
		// console.log({slug});
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
			post_date = new Date(data?.postBy?.date);
			blog_css = data?.postBy?.enqueuedStylesheets?.nodes || [];
			blog_scripts = data?.postBy?.enqueuedScripts?.nodes || [];
			blog_posts = [data?.postBy];
			title = data?.title;
			description = data?.excerpt;
			image = data?.featuredImage?.node?.sourceUrl;
			if (window.location.href.includes('blog/?slug=') || window.location.href.includes('blog?slug=')) {
				window.history.replaceState({ additionalInformation: 'Dynamic Blog Routing' }, title, window.location.href.replace('blog/?slug=', '').replace('blog?slug=', ''));
			};
		});
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe(); // important for garbage collection otherwise memory leak
	});
	export { slug };
</script>

<style>
	.blog-topbar { position: relative; margin: -20px 0 20px; }
	.breadcrumbs { font-size: var(--small-fontsize); }
	.breadcrumbs a { color: var(--color-black); }
	.breadcrumbs a:hover { color: var(--color-four); }
	.author { background: var(--color-seven); color: var(--color-white); text-align: center; margin: 75px auto 25px; }
	.author-image { text-align: center; position: relative; }
	.author-image img { border-radius: 50%; overflow: hidden; margin: 25px; width: 80%; max-width: 250px; height: auto; }
	@media screen and (min-width: 650px) {
		.author {
			display: grid;
			grid-template-columns: 1fr 2fr;
			text-align: left;
			column-gap: 3em;
		}
		.author-image { text-align: center; }
	}
	.author-content { padding: 20px; }
	.author-content h2 { color: var(--color-white); }
	.content .author a { color: var(--color-white) !important; }
	.content .author a.button { background: var(--color-four); text-transform: uppercase; font-weight: bold; margin-right: 25px; border: 0 none; }
	.content .author a.button:hover { background: var(--color-black); }
</style>
