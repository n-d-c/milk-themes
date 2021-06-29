<Head_Language lang="en" />
<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />
<Head_Facebook {title} {description} image="/img/hero_services_01.jpg" />
<Head_Twitter {title} {description} image="/img/hero_services_01.jpg" />
<Layout_Main id="immigration-attorneys">
	<Hero
		id="hero-immigration-services"
		image_url="/img/hero_services_01.jpg"
		img_srcset="/img/hero_services_01.jpg"
		avif_srcset="/img/hero_services_01.avif"
		webp_srcset="/img/hero_services_01.webp"
		title="Harlan York and Associates"
		parallax="false">&nbsp;</Hero
	>
	<Block_CallOutText
		id="call-out-text"
		blockstyle="block-style01"
		extraclasses="floating-calltoaction"
		title="Immigation Services"
	>
		<p>
			{description}
		</p>
	</Block_CallOutText>
	<div class="content">
		<h1 class="title">Our Services</h1>
	</div>
	<Block_ServicesList id="services" blockstyle="" />
	<Block_Testimonials id="testimonials" blockstyle="block-style05" />

	<Block_CallToAction
		id="call-to-action"
		blockstyle="block-style01"
		extraclasses="regular-calltoaction"
	/>
	<Block_LanguagesWeSpeak />
	<Block_Languages id="languages" blockstyle="block-style04" />
	<Block_FAQs id="FAQs" blockstyle="" />
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
	import Block_ServicesList from '$theme/Block_ServicesList.svelte';
	import Block_CallToAction from '$theme/Block_CallToAction.svelte';
	import Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';
	import Block_Languages from '$theme/Block_Languages.svelte';
	import Block_FAQs from '$theme/Block_FAQs.svelte';
	import Block_Testimonials from '$theme/Block_Testimonials.svelte';
	import Block_Featured from '$theme/Block_Featured.svelte';
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_Ratings from '$theme/Block_Ratings.svelte';
	/* ## Variables ## */
	const title = `Immigration Services - ${$milk?.site?.title}`;
	const description =
		'At Harlan York & Associates our immigration attorneys use their extensive experience on thousands of cases and daily reviews of new developments in the constantly changing field of immigration law to give you the best legal counsel available.';
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
