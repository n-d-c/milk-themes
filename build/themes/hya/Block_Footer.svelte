<div {id} class={blockclass}>
	<div class="footer-inner">
		<div class="contact-information">
			<ContactCard
				type="organization"
				specific_type="LocalBusiness"
				photo={$milk?.site?.photo}
				photo_avif={$milk?.site?.photo_avif}
				photo_webp={$milk?.site?.photo_webp}
				logo={$milk?.site?.logo}
				logo_width={$milk?.site?.logo_width}
				logo_height={$milk?.site?.logo_height}
				first_name={$milk?.site?.first_name}
				last_name={$milk?.site?.last_name}
				middle_name={$milk?.site?.middle_name}
				prefix_name={$milk?.site?.prefix_name}
				suffix_name={$milk?.site?.suffix_name}
				nick_name={$milk?.site?.nick_name}
				organization={$milk?.site?.organization}
				website={$milk?.site?.url}
				email_address={$milk?.site?.email_address}
				phone={$milk?.site?.phone}
				fax={$milk?.site?.fax}
				address={`${$milk?.site?.address}, ${$milk?.site?.address2}`}
				city={$milk?.site?.city}
				state={$milk?.site?.state}
				state_abbr={$milk?.site?.state_abbr}
				zip={$milk?.site?.zip}
				country={$milk?.site?.country}
				country_abbr={$milk?.site?.country_abbr}
				hours_of_operation={$milk?.site?.hours_of_operation}
				hours_of_operation_dt={$milk?.site?.hours_of_operation_dt}
				price_range={$milk?.site?.price_range}
				birthday={$milk?.site?.birthday}
				category={$milk?.site?.category}
				notes={$milk?.site?.description}
				latitude={$milk?.site?.latitude}
				longitude={$milk?.site?.longitude}
				google_maps={$milk?.site?.google_maps}
				google_business={$milk?.site?.google_business}
				facebook={$milk?.site?.facebook}
				facebook_image={$milk?.site?.facebook_image}
				twitter={$milk?.site?.twitter}
				twitter_image={$milk?.site?.twitter_image}
				instagram={$milk?.site?.instagram}
				linkedin={$milk?.site?.linkedin}
				youtube={$milk?.site?.youtube}
				vimeo={$milk?.site?.vimeo}
				rss={$milk?.site?.rss}
				etsy={$milk?.site?.etsy}
				yelp={$milk?.site?.yelp}
				airbnb={$milk?.site?.airbnb}
				tiktok={$milk?.site?.tiktok}
				snapchat={$milk?.site?.snapchat}
				pinterest={$milk?.site?.pinterest}
				blog={$milk?.site?.blog}
				vcf_file={$milk?.site?.vcf_file}
			/>
			<div class="extra-buttons">
				<a href="#" on:click|preventDefault={doCall}> Call Us </a>
				<a
					href={`mailto:${$milk?.site?.email_address}`}
					on:click|preventDefault={doEmail}
				>
					Email
				</a>
				<a href="#" on:click|preventDefault={doCalendar}>
					Consultation
				</a>
			</div>
		</div>
		<div class="google-maps">
			<GoogleMaps
				url={$milk?.site?.google_maps_embed}
				image={$milk?.site?.google_maps_image}
				image_webp={$milk?.site?.google_maps_image_webp}
				image_avif={$milk?.site?.google_maps_image_avif}
				title={`Directions to ${$milk?.site?.organization} - ${$milk?.site?.tagline}`}
			/>
		</div>
	</div>
</div>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import ContactCard from '$milk/lib/ContactCard.svelte';
	import GoogleMaps from '$milk/lib/GoogleMaps.svelte';
	/* ## Vairables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'footer';
	$: blockclass = `footer ${blockstyle}`;
	/* ## Methods and Functions ## */
	const doCall = () => {
		if (window?.callingCard?.show) {
			window?.callingCard?.show();
		}
	};
	const doEmail = () => {
		if (window?.location) {
			window.location = `mailto:${$milk?.site?.email_address}`;
		}
	};
	const doCalendar = () => {
		if (window?.calendarCard?.show) {
			window?.calendarCard?.show();
		}
	};
	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.footer-inner {
		margin: 0 auto;
		max-width: var(--content-constrain, 1200px);
		text-align: center;
	}
</style>
