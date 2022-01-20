<Head_Language lang="es" />
<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />
<Head_Facebook {title} {description} image="/img/hero_services_01.jpg" />
<Head_Twitter {title} {description} image="/img/hero_services_01.jpg" />
<Layout_Main id="immigration-espanol">
	<Hero
		id="hero-espanol"
		image_url="/img/hero_espanol_01.jpg"
		img_srcset="/img/hero_espanol_01.jpg"
		avif_srcset="/img/hero_espanol_01.avif"
		webp_srcset="/img/hero_espanol_01.webp"
		title="Harlan York and Associates"
		parallax="false">&nbsp;</Hero
	>
	<Block_CallOutText
		id="call-out-text"
		blockstyle="block-style01"
		extraclasses="floating-calltoaction"
		title="Abogado de Inmigración"
	>
		<p>{description}</p>
	</Block_CallOutText>
	<Block_ContactForm />
	<Block_LanguagesWeSpeak />
	<Block_Languages id="languages" blockstyle="block-style04" />
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
	import Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';
	import Block_Languages from '$theme/Block_Languages.svelte';
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_ContactForm from '$theme/Block_ContactForm.svelte';
	/* ## Variables ## */
	const title = `Abogado de Inmigración - ${$milk?.site?.title}`;
	const description =
		'Llame a un bufete de abogados de inmigración dedicados y con mucha experiencia para tener la mejor posibilidad de luchar.';
</script>

<style>
	.content {
		margin-bottom: 0;
	}
	.content-inner h2 {
		text-align: center;
	}
	.image-grid {
		text-align: center;
	}
	.image-grid img {
		margin: 20px;
		max-width: calc(100% - 40px);
		height: auto;
	}
	.video {
		margin: 50px 20px;
		text-align: center;
	}
	.video p {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 25px;
		font-style: italic;
	}
	.center {
		text-align: center;
	}
	.testimonials {
		text-align: center;
		margin-top: 50px;
	}
	.testimonials figure {
		margin: 10px auto;
		padding: 20px;
		text-align: left;
		font-style: italic;
		transition: all 0.3s;
		max-width: 800px;
	}
	.testimonials figure:hover {
		background: #eee;
		border-radius: 20px;
		transition: all 0.3s;
	}
	.testimonials blockquote {
		margin: 0;
	}
	.testimonials figcaption {
		padding: 0 25px;
	}
	.testimonials cite {
		color: #666;
		font-style: italic;
	}
	.testimonials cite::before {
		content: '- ';
	}
	.image-callout {
		margin: 25px;
		text-align: center;
	}
	.image-callout img {
		max-width: 80%;
		width: 400px;
		margin: 10px auto;
	}
	.image-callout p {
		font-style: italic;
	}
</style>
