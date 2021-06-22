<Head_Language lang="en" />
<Head_HTML
	title={`Immigration Services - ${$milk?.site?.title}`}
	description={$milk?.site?.description}
	keywords={$milk?.site?.keywords}
/>
<Head_Facebook />
<Head_Twitter />
<Layout_Main id="blog">
	<Hero
		id="hero-immigration-blog-01"
		image_url="/img/hero_blog_01.jpg"
		img_srcset="/img/hero_blog_01.jpg"
		avif_srcset="/img/hero_blog_01.avif"
		webp_srcset="/img/hero_blog_01.webp"
		title="Harlan York and Associates"
		parallax="false"
	>
		<h1>Our Blog</h1>
	</Hero>
	<Block_CallOutText
		id="call-out-text"
		blockstyle="block-style01"
		extraclasses="floating-calltoaction"
		title="Immigation Law Blog"
	>
		<p>
			Immigration law is a constantly changing legal field. Immigration
			lawyer Harlan York provides this blog so you can stay up to date on
			how legal trends affect immigration law cases.
		</p>
	</Block_CallOutText>
	<Block_WP_BlogListing
		id="featured-blogposts"
		blockstyle=""
		blog_path="/immigration-law-blog"
		offset="0"
		size="10"
		pagination="false"
	/>
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
	import Block_Featured from '$theme/Block_Featured.svelte';
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_Ratings from '$theme/Block_Ratings.svelte';
</script>

<style>
	.content {
		text-align: center;
	}
	.title {
		position: relative;
		margin-bottom: -100px;
	}
</style>
