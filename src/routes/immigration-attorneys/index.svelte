<Head_Language lang="en" />
<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />
<Head_Facebook {title} {description} image="/img/hero_attorneys_01.jpg" />
<Head_Twitter {title} {description} image="/img/hero_attorneys_01.jpg" />
<Layout_Main id="immigration-attorneys">
	<Hero
		id="hero-immigration-attorneys-01"
		image_url="/img/hero_attorneys_01.jpg"
		img_srcset="/img/hero_attorneys_01.jpg"
		avif_srcset="/img/hero_attorneys_01.avif"
		webp_srcset="/img/hero_attorneys_01.webp"
		title="Harlan York and Associates"
		parallax="false">&nbsp;</Hero
	>
	<Block_CallOutText
		id="call-out-text"
		blockstyle="block-style01"
		extraclasses="floating-calltoaction"
		title="Our Attorneys"
	>
		<p>
			{description}
		</p>
	</Block_CallOutText>
	<Block_Attorneys id="attorneys" blockstyle="" />
	<Block_eBook id="marriage-ebook" wpid="cG9zdDoyNDY=" blockstyle="" />
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
	import Block_Attorneys from '$theme/Block_Attorneys.svelte';
	import Block_CallToAction from '$theme/Block_CallToAction.svelte';
	import Block_eBook from '$theme/Block_eBook.svelte';
	import Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';
	import Block_Languages from '$theme/Block_Languages.svelte';
	import Block_Featured from '$theme/Block_Featured.svelte';
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_Ratings from '$theme/Block_Ratings.svelte';
	/* ## Variables ## */
	const title = `Immigration Attorneys - ${$milk?.site?.title}`;
	const description =
		'We understand Immigration Law. It is all we do. We have helped thousands of immigrants and their families get green cards, specialized visas, stop deportation, and handle just about any immigration related issue. Our immigration attorneys will answer your questions in a way that you cna understand, without complicated legal jargon. We charge reasonable fees and our entire law firm works directly on your case.';
</script>

<style>
</style>
