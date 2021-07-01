<Head_Language lang="en" />
<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />
<Head_Facebook {title} {description} image="/img/hero_services_01.jpg" />
<Head_Twitter {title} {description} image="/img/hero_services_01.jpg" />
<Layout_Main id="immigration-resources">
	<Hero
		id="hero-immigration-resources-01"
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
		title="Immigration Resources"
	>
		<p>{description}</p>
	</Block_CallOutText>
	<div class="content">
		<div class="content-inner">
			<h1>Resource Library</h1>
			<br /><br />
		</div>
		<div class="content-inner">
			<h2>eBooks</h2>
		</div>
	</div>
	<Block_eBooksList id="ebooks" />
	<div class="content">
		<div class="content-inner">
			<h2>Videos</h2>
		</div>
	</div>
	<Block_VideosList id="videos" />
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
	import Block_eBooksList from '$theme/Block_eBooksList.svelte';
	import Block_VideosList from '$theme/Block_VideosList.svelte';
	import Block_CallToAction from '$theme/Block_CallToAction.svelte';
	import Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';
	import Block_Languages from '$theme/Block_Languages.svelte';
	import Block_Featured from '$theme/Block_Featured.svelte';
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_Ratings from '$theme/Block_Ratings.svelte';
	/* ## Variables ## */
	const title = `Immigration Resources - ${$milk?.site?.title}`;
	const description =
		'Please feel free to access our Free Resource Library. If you have any questions our Attorneys are available for consultation.  Immigration law is a constantly changing legal field. What makes Harlan York the best lawyer in the field is his knowledge, and passion for staying up to date with trending legal challenges that could affect your case. Harlan’s Immigration Resource Library and Blog is filled with informative and practical advice from getting a green card through marriage, to detailed explanations of litigation, business immigration, citizenship, waivers and appeals.';
</script>

<style>
	.content {
		margin-bottom: 0;
	}
	.content-inner h2 {
		text-align: center;
	}
</style>
