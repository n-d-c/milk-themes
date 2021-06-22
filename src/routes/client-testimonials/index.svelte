<Head_Language lang="en" />
<Head_HTML
	title={`Immigration Services - ${$milk?.site?.title}`}
	description={$milk?.site?.description}
	keywords={$milk?.site?.keywords}
/>
<Head_Facebook />
<Head_Twitter />
<Layout_Main id="immigration-attorneys">
	<Hero
		id="hero-client-testimonials-02"
		image_url="/img/hero_homepage_02.jpg"
		img_srcset="/img/hero_homepage_02.jpg"
		avif_srcset="/img/hero_homepage_02.avif"
		webp_srcset="/img/hero_homepage_02.webp"
		title="Client Testimonials"
		parallax="false">&nbsp;</Hero
	>
	<Block_CallOutText
		id="call-out-text"
		blockstyle="block-style01"
		extraclasses="floating-calltoaction"
		title="Immigation Services"
	>
		<p>
			Our Immigration Attorneys help thousands of clients avoid
			deportation, get their green cards and become US citizens. See what
			our clients and colleagues have to say about how Harlan York &
			Associates helped them with their case.
		</p>
	</Block_CallOutText>
	<div class="content">
		<h1 class="title">Client Testimonials</h1>
	</div>
	<Block_TestimonialsList id="testimonials" blockstyle="" />

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
	import Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';
	import Block_Languages from '$theme/Block_Languages.svelte';
	import Block_TestimonialsList from '$theme/Block_TestimonialsList.svelte';
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
