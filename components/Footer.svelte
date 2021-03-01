<div class="footer">
	<div class="footer-inner">
		<div class="contact-information">
			<ContactCard
				type="organization"
				specific_type="LocalBusiness"
				photo={$wp?.site?.photo}
				photo_avif={$wp?.site?.photo_avif}
				photo_webp={$wp?.site?.photo_webp}
				logo={$wp?.site?.logo}
				logo_width={$wp?.site?.logo_width}
				logo_height={$wp?.site?.logo_height}
				first_name={$wp?.site?.first_name}
				last_name={$wp?.site?.last_name}
				middle_name={$wp?.site?.middle_name}
				prefix_name={$wp?.site?.prefix_name}
				suffix_name={$wp?.site?.suffix_name}
				nick_name={$wp?.site?.nick_name}
				organization={$wp?.site?.organization}
				website={$wp?.site?.url}
				email_address={$wp?.site?.email_address}
				phone={$wp?.site?.phone}
				fax={$wp?.site?.fax}
				address={`${$wp?.site?.address}, ${$wp?.site?.address2}`}
				city={$wp?.site?.city}
				state={$wp?.site?.state}
				state_abbr={$wp?.site?.state_abbr}
				zip={$wp?.site?.zip}
				country={$wp?.site?.country}
				country_abbr={$wp?.site?.country_abbr}
				hours_of_operation={$wp?.site?.hours_of_operation}
				hours_of_operation_dt={$wp?.site?.hours_of_operation_dt}
				price_range={$wp?.site?.price_range}
				birthday={$wp?.site?.birthday}
				category={$wp?.site?.category}
				notes={$wp?.site?.description}
				latitude={$wp?.site?.latitude}
				longitude={$wp?.site?.longitude}
				google_maps={$wp?.site?.google_maps}
				google_business={$wp?.site?.google_business}
				facebook={$wp?.site?.facebook}
				facebook_image={$wp?.site?.facebook_image}
				twitter={$wp?.site?.twitter}
				twitter_image={$wp?.site?.twitter_image}
				instagram={$wp?.site?.instagram}
				linkedin={$wp?.site?.linkedin}
				youtube={$wp?.site?.youtube}
				vimeo={$wp?.site?.vimeo}
				rss={$wp?.site?.rss}
				etsy={$wp?.site?.etsy}
				yelp={$wp?.site?.yelp}
				airbnb={$wp?.site?.airbnb}
				tiktok={$wp?.site?.tiktok}
				snapchat={$wp?.site?.snapchat}
				pinterest={$wp?.site?.pinterest}
				blog={$wp?.site?.blog}
				vcf_file={$wp?.site?.vcf_file}
			/>
		</div>
		<div class="google-maps">
			<GoogleMaps
				url={$wp?.site?.google_maps_embed}
				image={$wp?.site?.google_maps_image}
				image_webp={$wp?.site?.google_maps_image_webp}
				image_avif={$wp?.site?.google_maps_image_avif}
				title={`Directions to ${$wp?.site?.organization} - ${$wp?.site?.tagline}`}
			/>
		</div>
	</div>
</div>

<script>
	/* ## WP ## */
	import { wp } from '$components/wp.js';
	/* ## Components ## */
	import ContactCard from '$components/ContactCard.svelte';
	import GoogleMaps from '$components/GoogleMaps.svelte';
</script>

<style>
	.footer {
		text-align: center;
		padding: 0;
		font-size: var(--font-size-small, 15px);
		min-height: 90px;
		display: block;
		box-sizing: border-box;
		background: var(--color-blue-deep, #00354a);
		color: var(--color-white, #fff);
		line-height: 1.75em;
	}
	.footer-inner {
		margin: 0 auto;
		max-width: var(--content-width-max, 1020px);
	}
	.contact-information {
		padding: var(--padding-inner, 20px);
		text-align: left;
	}
	.google-maps {
		position: relative;
		padding: 0;
	}
	@media screen and (min-width: 600px) {
		.footer-inner {
			display: grid;
			grid-template-columns: 50% 50%;
			grid-template-areas: ' l r ';
		}
		.contact-information {
			grid-area: l;
		}
		.google-maps {
			grid-area: r;
		}
	}
</style>
