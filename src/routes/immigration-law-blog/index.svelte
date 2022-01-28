<Head_Language lang="en" />
<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />
<Head_Facebook {title} {description} image="/img/hero_blog_01.jpg" />
<Head_Twitter {title} {description} image="/img/hero_blog_01.jpg" />
<Layout_Main id="blog">
	<Hero
		id="hero-immigration-blog-01"
		image_url="/img/hero_blog_01.jpg"
		img_srcset="/img/hero_blog_01.jpg"
		image_loading="eager"
		avif_srcset="/img/hero_blog_01.avif"
		webp_srcset="/img/hero_blog_01.webp"
		title="Harlan York and Associates"
		parallax="false">&nbsp;</Hero
	>
	<Block_CallOutText
		id="call-out-text"
		blockstyle="block-style01"
		extraclasses="floating-calltoaction"
		title="Immigration Law Blog"
	>
		<p>{description}</p>
	</Block_CallOutText>
	<div class="controls">
		<div class="controls-inner">
			<Block_WP_BlogCategorySelector bind:category />
			<Block_WP_BlogSearch bind:search />
		</div>
	</div>
	<Block_WP_BlogListing
		id="blogposts"
		blockstyle=""
		blog_path="/immigration-law-blog"
		bind:offset
		bind:size
		bind:count
		bind:category
		bind:search
		bind:totalsize
		title="Blog Posts"
	/>
	<div class="pagination">
		<div class="pagination-inner">
			<Block_WP_BlogPerPage bind:size options={[1, 10, 20, 50, 100]} />
			<Block_WP_BlogPagination
				bind:count
				bind:offset
				bind:size
				bind:totalsize
			/>
		</div>
	</div>
	<Block_WP_BlogListAllPages blog_path="/immigration-law-blog" />
	<Block_CallToAction
		id="call-to-action"
		blockstyle="block-style01"
		extraclasses="regular-calltoaction"
	/>
	<Block_Languages id="languages" blockstyle="block-style04" />
	<Block_Featured id="featured" blockstyle="" />
	<Block_Ratings id="ratings" blockstyle="" />
	<SocialMedia id="socialmedia" blockstyle="" />
</Layout_Main>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Head_Language from '$milk/lib/Head_Language.svelte';
	import Head_HTML from '$milk/lib/Head_HTML.svelte';
	import Head_Facebook from '$milk/lib/Head_Facebook.svelte';
	import Head_Twitter from '$milk/lib/Head_Twitter.svelte';
	import Layout_Main from '$theme/Layout_Main.svelte';
	import Hero from '$milk/lib/Hero.svelte';
	import Block_CallOutText from '$theme/Block_CallOutText.svelte';
	import Block_CallToAction from '$theme/Block_CallToAction.svelte';
	import Block_Languages from '$theme/Block_Languages.svelte';
	import Block_WP_BlogListing from '$milk/lib/Block_WP_BlogListing.svelte';
	import Block_WP_BlogListAllPages from '$milk/lib/Block_WP_BlogListAllPages.svelte';
	import Block_WP_BlogCategorySelector from '$milk/lib/Block_WP_BlogCategorySelector.svelte';
	import Block_WP_BlogSearch from '$milk/lib/Block_WP_BlogSearch.svelte';
	import Block_WP_BlogPerPage from '$milk/lib/Block_WP_BlogPerPage.svelte';
	import Block_WP_BlogPagination from '$milk/lib/Block_WP_BlogPagination.svelte';
	import Block_Featured from '$theme/Block_Featured.svelte';
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_Ratings from '$theme/Block_Ratings.svelte';
	/* ## Variables ## */
	const title = `Immigration Blog - ${$milk?.site?.title}`;
	const description =
		'Immigration law is a constantly changing legal field. Immigration lawyer Harlan York provides this blog, so you can stay up to date on how legal trends affect immigration law cases.';
	let category = '';
	let search = '';
	let count = 0;
	let offset = 0;
	let size = 10;
	let totalsize = 1;
</script>

<style>
	.content {
		text-align: center;
	}
	.title {
		position: relative;
		margin-bottom: -100px;
	}
	.controls,
	.pagination {
		display: block;
		padding: 50px var(--padding-inner, 20px) 0px;
		color: var(--color-black, #000);
	}
	.controls-inner,
	.pagination-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
		padding: 0 var(--padding);
	}
	.pagination,
	.pagination-inner {
		margin-bottom: 50px;
		text-align: left;
	}
</style>
