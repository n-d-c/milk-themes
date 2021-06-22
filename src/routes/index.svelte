<Head_Language lang="en" />
<Head_HTML
	title={$milk?.site?.title}
	description={$milk?.site?.description}
	keywords={$milk?.site?.keywords}
/>
<Head_Facebook />
<Head_Twitter />
<Layout_Main id="page-homepage">
	<Hero
		id="hero-home-01"
		image_url="/img/hero_homepage_01.jpg"
		img_srcset="/img/hero_homepage_01.jpg"
		avif_srcset="/img/hero_homepage_01.avif"
		webp_srcset="/img/hero_homepage_01.webp"
		title="Harlan York and Associates"
		parallax="false"
	>
		<h1>
			Protecting the Rights of Immigrants across America for a Quarter
			Century
		</h1>
	</Hero>
	<Block_CallToAction
		id="call-to-action-02"
		blockstyle="block-style01"
		extraclasses="floating-calltoaction"
	/>
	<Block_Services id="services" blockstyle="" />
	<Block_Team id="team" blockstyle="block-style02" />
	<Hero
		id="hero-home-02"
		image_url="/img/hero_homepage_02.jpg"
		img_srcset="/img/hero_homepage_02.jpg"
		avif_srcset="/img/hero_homepage_02.avif"
		webp_srcset="/img/hero_homepage_02.webp"
		title="Working with Clients"
		parallax="false">&nbsp;</Hero
	>
	<Block_Testimonials id="testimonials" blockstyle="block-style05" />
	<Hero
		id="hero-home-03"
		image_url="/img/hero_homepage_03.jpg"
		img_srcset="/img/hero_homepage_03.jpg"
		avif_srcset="/img/hero_homepage_03.avif"
		webp_srcset="/img/hero_homepage_03.webp"
		title="Helping Clients"
		parallax="false">&nbsp;</Hero
	>
	<Block_WP_BlogListingByCategory
		id="featured-blogposts"
		blockstyle=""
		blog_path="/immigration-law-blog"
		category="Featured"
		offset="0"
		size="2"
		pagination="false"
	>
		<span slot="before">
			<h2>Latest News</h2>
			<h2>Immigration Law Blog</h2>
			<div class="block-content">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Maecenas sollicitudin luctus purus at euismod. Mauris
					ultrices magna in libero porttitor, id posuere velit
					venenatis. Fusce in lectus ut nulla ultrices euismod.
				</p>
			</div>
		</span>
		<span slot="after">
			<a href="#" class="fancy-link">
				<span>View Our Blog</span>
			</a>
		</span>
	</Block_WP_BlogListingByCategory>
	<Block_Featured id="featured" blockstyle="" />
	<FeaturedVideo
		id="featured-video"
		blockstyle=""
		video_source="//player.vimeo.com/video/108146056"
		video_jpg="/img/video_featured.jpg"
		video_webp="/img/video_featured.webp"
		video_avif="/img/video_featured.avif"
	/>
	<SocialMedia id="socialmedia" blockstyle="" />
	<Block_CallToAction
		id="call-to-action"
		blockstyle="block-style01"
		extraclasses="regular-calltoaction"
	/>
	<Block_Ratings id="ratings" blockstyle="" />
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
	import Block_CallToAction from '$theme/Block_CallToAction.svelte';
	import Block_Team from '$theme/Block_Team.svelte';
	import Block_Services from '$theme/Block_Services.svelte';
	import Block_Testimonials from '$theme/Block_Testimonials.svelte';
	import Block_WP_BlogListingByCategory from '$milk/lib/Block_WP_BlogListingByCategory.svelte';
	import Block_Featured from '$theme/Block_Featured.svelte';
	import FeaturedVideo from '$milk/lib/FeaturedVideo.svelte';
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_Ratings from '$theme/Block_Ratings.svelte';
</script>

<style>
</style>
