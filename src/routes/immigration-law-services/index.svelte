<Head_Language lang="en" />
<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />
<Head_Facebook {title} {description} image="/img/hero_services_01.jpg" />
<Head_Twitter {title} {description} image="/img/hero_services_01.jpg" />
<Layout_Main id="immigration-attorneys">
	<Hero
		id="hero-immigration-services"
		image_url="/img/hero_services_02.jpg"
		img_srcset="/img/hero_services_02.jpg"
		image_loading="eager"
		avif_srcset="/img/hero_services_02.avif"
		webp_srcset="/img/hero_services_02.webp"
		title="Harlan York and Associates"
		parallax="false">&nbsp;</Hero
	>
	<Block_CallOutText
		id="call-out-text"
		blockstyle="block-style01"
		extraclasses="floating-calltoaction"
		title="Immigration Services"
	>
		<p>{description}</p>
	</Block_CallOutText>

	<Block_ServicesList id="services" blockstyle="" />
	<div class="service-area">
		<p>
			Harlan York and Associates practices law in the areas of
			Immigration, Deportation Defense, Family Immigration, Corporate
			Immigration, Naturalization throughout Essex County – Hudson County
			– Morris County – Passaic County – Somerset County – Middlesex
			County – Bergen County – New Jersey -Immigration Lawyer – NJ
			Immigration Lawyer – Jersey City-Newark-Paterson Passaic Elizabeth
			Edison Woodbridge Toms River Hamilton Trenton Camden Clifton Passaic
			Garfield Wallington Cherry Hill East Orange Passaic Union City
			Bayonne Irvington Old Bridge Lakewood North Bergen Vineland Union
			Wayne Parsippany-Troy Hills New Brunswick Plainfield Bloomfield
			Perth Amboy East Brunswick West New York West Orange Hackensack
			Atlantic City Kearny Mount Laurel Montclair Essex Hoboken North
			Brunswick Belleville. In addition to serving clients in New York,
			Pennsylvania, the greater United States, and Internationally.
		</p>
	</div>
	<Block_eBooksList />
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
	import Block_Testimonials from '$theme/Block_Testimonials.svelte';
	import Block_Featured from '$theme/Block_Featured.svelte';
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_Ratings from '$theme/Block_Ratings.svelte';
	import Block_eBooksList from '$theme/Block_eBooksList.svelte';
	/* ## Variables ## */
	const title = `Immigration Services - ${$milk?.site?.title}`;
	const description =
		'At Harlan York & Associates, our immigration attorneys use their extensive experience with thousands of cases and daily reviews of new developments in the constantly changing field of immigration law to give you the best legal counsel available.';
</script>

<style>
	.content {
		text-align: center;
	}
	.title {
		position: relative;
		margin-bottom: -100px;
	}
	.service-area {
		text-align: center;
	}
	.service-area p {
		text-align: left;
		margin: auto;
		max-width: 800px;
		font-style: italic;
		color: #666;
		margin-bottom: 45px;
	}
</style>
