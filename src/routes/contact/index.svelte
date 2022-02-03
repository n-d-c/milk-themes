<Head_Language lang="es" />
<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />
<Head_Facebook {title} {description} image="/img/hero_services_01.jpg" />
<Head_Twitter {title} {description} image="/img/hero_services_01.jpg" />
<Layout_Main id="immigration-espanol">
	<Hero
		id="hero-espanol"
		image_url="/img/hero_espanol_01.jpg"
		image_loading="eager"
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
		title="Contact Us"
	>
		<p>{description}</p>
	</Block_CallOutText>
	<div class="content">
		<div class="content-inner">
			<h1>
				Harlan York & Associates Lawyers Work Throughout New Jersey, New
				York, Pennsylvania And Beyond.
			</h1>
			<p>
				From our main oﬃce in Newark, New Jersey, our immigration
				lawyers have consulted with people from more than 100 nations.
				Our immigration law clients run the gamut from small start-ups
				to Fortune 500 companies, and manual laborers to PhDs. All
				clients receive prompt, personal service directly from our
				immigration attorneys.
			</p>
			<p>
				We’ve dealt with every angle of Immigration Law including: Green
				Cards, Deportation Defense, Family Immigration, Corporate
				Immigration, and Naturalization law cases.
			</p>

			<h2>Harlan York And Associates</h2>
			<div class="business-info">
				<div class="row-2-col-25-75">
					<div>
						<img
							src="/img/contact-icons_pin.png"
							alt="map pin icon"
							class="business-icon"
						/>
					</div>
					<div>
						60 Park Place, Suite 1010 <br />
						Newark, NJ 07102
					</div>
				</div>
				<div class="row-2-col-25-75">
					<div>
						<img
							src="/img/contact-icons_phone.png"
							alt="phone icon"
							class="business-icon"
						/>
					</div>
					<div>
						Telephone: (973) 642-1111 <br />
						Facsimile: (973) 642-0022
					</div>
				</div>
				<div class="row-2-col-25-75">
					<div>
						<img
							src="/img/contact-icons_clock.png"
							alt="clock icon"
							class="business-icon"
						/>
					</div>
					<div>
						<strong>Hours of Operation</strong> <br />
						9:00am – 5:00pm / Monday – Friday
					</div>
				</div>
			</div>

			<Block_ContactForm />
			<GoogleMaps
				url={$milk?.site?.google_maps_embed}
				image={$milk?.site?.google_maps_image}
				image_webp={$milk?.site?.google_maps_image_webp}
				image_avif={$milk?.site?.google_maps_image_avif}
				title={`Directions to ${$milk?.site?.organization} - ${$milk?.site?.tagline}`}
			/>
			<h1>Directions To Harlan York And Associates</h1>
			<p>
				We are located in the Military Park Building at 60 Park Place in
				downtown Newark – just oﬀ of Raymond Boulevard and Broad Street.
				We are minutes from Newark Penn Station and adjacent to the New
				Jersey Performing Arts Center. There are several parking lots
				and garages in our neighborhood. Immigration is very close to
				our oﬃce as well. Multiple route directions below.
			</p>
			<h2>VIA NJ TURNPIKE</h2>
			<p>
				NJ Turnpike to exit 15E. After toll booth follow signs for
				Raymond Boulevard. Continue on Raymond. Go past Penn Station. At
				corner of Raymond & Broad Street, turn right onto Park Place.
			</p>
			<h2>VIA GARDEN STATE PARKWAY</h2>
			<p>
				Follow the Garden State Parkway North to exit 145 (Route 280)
				Follow Route 280 East. Stay to the right to exit 15 (Route 21
				South – Downtown). At the bottom of the ramp, make right onto
				Route 21 South, (McCarter Highway). Make right onto Raymond
				Boulevard. Continue on Raymond to corner of Raymond & Broad
				Street, then turn right onto Park Place.
			</p>
			<h2>VIA ROUTE 280</h2>
			<p>
				Follow Route 280 East to exit 15 (Route 21 South – Downtown). At
				the bottom of the ramp, make a right onto Route 21 South
				(McCarter Highway). Make right onto Raymond Boulevard. Continue
				on Raymond to corner of Raymond & Broad Street, then turn right
				onto Park Place.
			</p>

			<h2>VIA ROUTE 78</h2>
			<p>
				Follow Route 78 East until it splits near Newark Airport. Stay
				right and follow Routes 1&9 South to Route 21 North (McCarter
				Highway). Travel across the viaduct into downtown Newark. After
				crossing the viaduct stay in the left hand turn lane & at the
				ﬁrst light make a left onto Miller Street. Make a right hand
				turn onto Broad Street. Follow Broad Street for about 20 blocks.
				One block past Prudential Building bear right onto Park Place.
			</p>

			<h2>FROM GW BRIDGE & LINCOLN TUNNEL</h2>
			<p>
				Follow signs to the NJ Turnpike South. Take NJ Turnpike South to
				exit 15E. After toll booth follow signs for Raymond Boulevard.
				Continue on Raymond. Go past Penn Station. At corner of Raymond
				& Broad Street, turn right onto Park Place.
			</p>

			<h2>FROM HOLLAND TUNNEL</h2>
			<p>
				Take NJ Turnpike South to exit 14. Follow signs to Route 21
				(McCarter Highway). Travel across the viaduct into downtown
				Newark. After crossing the viaduct stay in the left hand turn
				lane & at the ﬁrst light make a left onto Miller Street. Make a
				right hand turn onto Broad Street. Follow Broad Street for about
				20 blocks. One block past Prudential Building bear right onto
				Park Place.
			</p>
			<h2>VIA PUBLIC TRANSPORTATION</h2>
			<p>
				You can use any New Jersey Transit Train to get to Newark Penn
				Station. 60 Park Place is a short walk from Penn Station;
				proceed by foot up Raymond Boulevard towards Broad Street and
				make a right onto Park Place.
			</p>
		</div>
	</div>
	<Block_LanguagesWeSpeak />
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
	import SocialMedia from '$milk/lib/SocialMedia.svelte';
	import Block_ContactForm from '$theme/Block_ContactForm.svelte';

	import GoogleMaps from '$milk/lib/GoogleMaps.svelte';
	/* ## Variables ## */
	const title = `Contact Us - ${$milk?.site?.title}`;
	const description =
		'Harlan York & Associates returns phone calls within 24 hours or less in most cases. We answer emails on nights and weekends and use texting during emergency cases. Contact us for 24/7 personal access to the best immigration lawyers for your case today.';
</script>

<style>
	.content {
		margin-bottom: 0;
	}

	.content-inner {
		text-align: left;
	}

	.business-info {
		max-width: 700px;
		margin: auto;
	}

	.business-icon {
		width: 40px;
		height: 40px;
		object-fit: contain;
	}

	.row-2-col-25-75 {
		display: flex;
		max-width: 300px;
		margin: 0 auto;
	}

	.row-2-col-25-75 div:first-child {
		width: 25%;
	}
	.row-2-col-25-75 div:last-child {
		width: 75%;
	}
</style>
