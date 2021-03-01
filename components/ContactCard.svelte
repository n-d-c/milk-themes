<svelte:head>
	<link async rel="profile" href="http://microformats.org/profile/hcard" />
</svelte:head>
<!-- ###### !!!!!! WARNING !!!!!! ###### -->
<!-- Note: These specs depend on exact markup and classes and heiarchy.
	Getting multiple ones implimented at the same time takes a ton of very
	careful testing with the validators.  If you don't know what you are doing,
	best not to edit this component.
 -->
<div
	class="vcard h-card"
	data-impliments="microformat, microdata, rdfa"
	data-microformat="hCard, vCard, oCard, h-card, h-addr, geo, h-geo"
	data-microdata="Person, Organization, PostalAddress, LocalBusiness, openingHours, Place, webFeed, Service"
	data-rdfa="Person, Organization, PostalAddress, LocalBusiness, openingHours, Place, webFeed, Service"
	vocab="https://schema.org/"
	itemscope
	itemtype={item_type}
	typeof={`${specific_type} Organization Person Service`}
>
	<link itemprop="additionalType" href="https://schema.org/Organization" />
	<link itemprop="additionalType" href="https://schema.org/Person" />
	<link itemprop="additionalType" href="https://schema.org/Service" />
	<!-- ## MicroFormat ## -->
	<!-- Note: Do not change class names without checking the format spec RFC2426. -->
	<!-- Impliments the Following MicroFormats:
	hCard/vCard: http://microformats.org/wiki/hcard
	geo: http://microformats.org/wiki/geo
	h-card: http://microformats.org/wiki/h-card
	h-adr: http://microformats.org/wiki/h-adr
	h-geo: http://microformats.org/wiki/h-geo -->
	<!-- Validate Using: https://pin13.net
	Validation Chrome Extension: https://chrome.google.com/webstore/detail/microformats/oalbifknmclbnmjlljdemhjjlkmppjjl
	-->

	<!-- ## MicroData ## -->
	<!-- Note: Do not change attributes without checking the format spec on https://schema.org/. -->
	<!-- Impliments the Following MicroData:
	MicroData Person: https://schema.org/Person
	MicroData Organization: https://schema.org/Organization
	MicroData PostalAddress: https://schema.org/PostalAddress
	MicroData LocalBusiness: https://schema.org/LocalBusiness
	MicroData openingHours: https://schema.org/openingHours
	MicroData Place: https://schema.org/Place
	MicroData webFeed: https://schema.org/webFeed
	MicroData Service: https://schema.org/Service -->
	<!-- Validate Using: https://search.google.com/structured-data/testing-tool/u/0/
	Validation Chrome Extension: https://chrome.google.com/webstore/detail/structured-data-testing-t/kfdjeigpgagildmolfanniafmplnplpl
	-->

	<!-- ## RDFa ## -->
	<!-- Note: Do not change attributes without checking the format spec on https://schema.org/. -->
	<!-- Impliments the Following RDFa:
	RDFa Person: https://schema.org/Person
	RDFa Organization: https://schema.org/Organization
	RDFa PostalAddress: https://schema.org/PostalAddress
	RDFa LocalBusiness: https://schema.org/LocalBusiness
	RDFa openingHours: https://schema.org/openingHours
	RDFa Place: https://schema.org/Place
	RDFa webFeed: https://schema.org/webFeed
	RDFa Service: https://schema.org/Service -->
	<!-- Validate Using: https://search.google.com/structured-data/testing-tool/u/0/
	Validation Chrome Extension: https://chrome.google.com/webstore/detail/structured-data-testing-t/kfdjeigpgagildmolfanniafmplnplpl
	-->

	<!-- TODO: Microfotmat JSON header injections. -->

	<!-- TODO: Facebook OpenGraph header injections. -->
	<!-- Validate Using: https://developers.facebook.com/tools/debug/
	Validation Chrome Extension: https://chrome.google.com/webstore/detail/open-graph-preview/ehaigphokkgebnmdiicabhjhddkaekgh/
	Social Share Preview Extension: https://socialsharepreview.com/browser-extensions
	-->

	<!-- TODO: TwitterGraph header injections. -->

	<!-- TODO: JSON-LD header injections. -->

	<!-- TODO: vCard auto generation w/ forced download client side. -->

	<!-- Type Heiarachy > Organization > LocalBusiness > Specific Business Type  -->

	{#if photo && photo != ''}
		<div class="picture">
			<picture title={`${full_name}`}>
				{#if photo_avif && photo_avif != ''}
					<source type="image/avif" srcset={photo_avif} />
				{/if}
				{#if photo_webp && photo_webp != ''}
					<source type="image/webp" srcset={photo_webp} />
				{/if}
				<img
					class="photo u-photo"
					height="300"
					width="300"
					src={photo}
					alt={full_name}
					loading="lazy"
					itemprop="image"
					property="image"
				/>
			</picture>
			{#if logo && logo != ''}
				<picture title={`${organization}`}>
					<img
						class="logo u-logo image"
						height={logo_height}
						width={logo_width}
						src={logo}
						alt={organization}
						loading="lazy"
						itemprop="logo"
						property="logo"
					/>
				</picture>
			{/if}
		</div>
	{/if}

	{#if type && type != 'organization'}
		<div
			class="fn p-name"
			title="Full Name"
			itemprop="name"
			property="name"
		>
			<div class="n">
				{#if prefix_name && prefix_name != ''}
					<span class="honorific-prefix p-honorific-prefix">
						{prefix_name}
					</span>
				{/if}
				{#if first_name && first_name != ''}
					<span class="given-name p-given-name" title="First Name">
						{first_name}
					</span>
				{/if}
				{#if middle_name && middle_name != ''}
					<span class="additional-name p-additional-name">
						{middle_name}
					</span>
				{/if}
				{#if last_name && last_name != ''}
					<span class="family-name p-family-name" title="Last Name">
						{last_name}
					</span>
				{/if}
				{#if suffix_name && suffix_name != ''}
					<span class="honorific-suffix p-honorific-suffix">
						{suffix_name}
					</span>
				{/if}
				{#if nick_name && nick_name != ''}
					(<span class="nickname p-nickname" title="Nickname">
						{nick_name}
					</span>)
				{/if}
			</div>
		</div>
		{#if organization && organization != ''}
			<div
				itemscope
				itemtype="https://schema.org/Organization"
				vocab="https://schema.org/"
				typeof="Organization"
			>
				<div
					class="org p-org p-organization-name"
					title="Company/Organization"
					itemprop="name"
					property="name"
				>
					{organization}
				</div>
			</div>
		{/if}
	{:else}
		<div
			class="fn n org p-name p-org p-organization-name"
			title="Company/Organization"
			itemprop="name"
			property="name"
		>
			{organization}
		</div>
	{/if}

	{#if email_address && email_address != ''}
		<div class="emailaddress">
			<span class="label">Email:</span>
			<a
				class="email u-email"
				href={`mailto:${email_address}`}
				title="Email Address"
				itemprop="email"
				property="email"
			>
				<span class="type p-label">Email</span>
				<span class="value">{email_address}</span>
			</a>
		</div>
	{/if}
	{#if phone && phone != ''}
		<div class="telephone">
			<span class="label">Telephone:</span>
			<a
				class="tel p-tel"
				href={`tel:+${phone}`}
				title="Telephone"
				itemprop="telephone"
				property="telephone"
			>
				<span itemprop="telephone" property="telephone">{phone}</span>
			</a>
		</div>
	{/if}
	{#if fax && fax != ''}
		<div class="facsimile">
			<span class="label">Facsimile:</span>
			<a
				class="fax tel p-tel"
				href={`tel:+${fax}`}
				title="Fax"
				itemprop="faxNumber"
				property="faxNumber"
			>
				<span itemprop="faxNumber" property="faxNumber">{fax}</span>
			</a>
		</div>
	{/if}

	<div
		class="adr p-adr h-adr"
		title="Address"
		itemprop="address"
		itemscope
		itemtype="https://schema.org/PostalAddress"
		vocab="https://schema.org/"
		property="address"
		typeof="PostalAddress"
		on:click={openMap}
	>
		<span class="label">Address:</span>
		{#if address && address != ''}
			<div
				class="street-address p-street-address"
				title="Street Address"
				itemprop="streetAddress"
				property="streetAddress"
			>
				{address}
			</div>
		{/if}
		<div>
			{#if city && city != ''}
				<span
					class="locality p-locality"
					title="City/Locality"
					itemprop="addressLocality"
					property="addressLocality"
				>
					{city}
				</span>,
			{/if}
			{#if state_abbr && state_abbr != ''}
				<span class="state" title="State/Region">
					<abbr
						class="region p-region"
						title={state}
						itemprop="addressRegion"
						property="addressRegion"
					>
						{state_abbr}
					</abbr>,
				</span>
			{/if}
			{#if zip && zip != ''}
				<span
					class="postal-code p-postal-code"
					title="Zipcode/Postal Code"
					itemprop="postalCode"
					property="postalCode"
				>
					{zip}
				</span>
			{/if}
			{#if country_abbr && country_abbr != ''}
				<span class="country" title="Country">
					<abbr
						class="country-name p-country-name"
						title={country}
						itemprop="addressCountry"
						property="addressCountry"
					>
						{country_abbr}
					</abbr>
				</span>
			{/if}
		</div>
	</div>

	<div
		itemprop="location"
		itemscope
		vocab="https://schema.org/"
		itemtype="https://schema.org/Place"
		property="location"
		typeof="Place"
		class="hide"
	>
		<div itemprop="name" property="name" class="hide">{full_name}</div>
		<div
			itemprop="address"
			itemscope
			itemtype="https://schema.org/PostalAddress"
			vocab="https://schema.org/"
			property="address"
			typeof="PostalAddress"
		>
			<span class="label">Address:</span>
			{#if address && address != ''}
				<div
					class="street-address p-street-address"
					title="Street Address"
					itemprop="streetAddress"
					property="streetAddress"
				>
					{address}
				</div>
			{/if}
			<div>
				{#if city && city != ''}
					<span
						class="locality p-locality"
						title="City/Locality"
						itemprop="addressLocality"
						property="addressLocality"
					>
						{city}
					</span>,
				{/if}
				{#if state_abbr && state_abbr != ''}
					<span class="state" title="State/Region">
						<abbr
							class="region p-region"
							title={state}
							itemprop="addressRegion"
							property="addressRegion"
						>
							{state_abbr}
						</abbr>,
					</span>
				{/if}
				{#if zip && zip != ''}
					<span
						class="postal-code p-postal-code"
						title="Zipcode/Postal Code"
						itemprop="postalCode"
						property="postalCode"
					>
						{zip}
					</span>
				{/if}
				{#if country_abbr && country_abbr != ''}
					<span class="country" title="Country">
						<abbr
							class="country-name p-country-name"
							title={country}
							itemprop="addressCountry"
							property="addressCountry"
						>
							{country_abbr}
						</abbr>
					</span>
				{/if}
			</div>
		</div>
	</div>

	{#if website && website != ''}
		<div class="website" title="Website">
			<span class="label">Website:</span>
			<a
				class="url u-url"
				target="website"
				href={website}
				title={`Website for ${full_name}`}
				itemprop="url"
				property="url"
			>
				{website}
			</a>
		</div>
	{/if}

	{#if type && type == 'organization'}
		{#if hours_of_operation && hours_of_operation != ''}
			<div class="hours-of-operation note p-note">
				<span class="label">Hours of Operation:</span>
				<div
					class="hours"
					title="Hours of Operation"
					itemprop="openingHours"
					property="openingHours"
					content={hours_of_operation_dt}
				>
					{hours_of_operation}
				</div>
			</div>
		{/if}
		{#if price_range && price_range != ''}
			<div class="price note p-note">
				<span class="label">Price Range:</span>
				<span
					class="price-range"
					title="Price Range"
					itemprop="priceRange"
					property="priceRange"
					content={price_range}
				>
					{price_range}
				</span>
			</div>
		{/if}
	{/if}
	{#if category && category != ''}
		<div class="categories">
			<span class="label">Categories:</span>
			<div class="category p-category" title="Categories">
				{category}
			</div>
		</div>
	{/if}
	{#if notes && notes != ''}
		<div class="notes">
			<span class="label">Notes:</span>
			<div class="note p-note">{notes}</div>
		</div>
	{/if}
	{#if type && type != 'organization'}
		{#if birthday && birthday != ''}
			<div class="birthday">
				<span class="label">Birthday:</span>
				<time
					class="bday dt-bday"
					title="Birthday"
					itemprop="birthDate"
					property="birthDate"
				>
					{birthday}
				</time>
			</div>
		{/if}
	{/if}

	<div class="location" title="Location">
		{#if google_maps && google_maps != ''}
			<div class="directions" title="Directions">
				<span class="label">Directions:</span>
				<a
					class="url u-url"
					target="google_maps"
					href={google_maps}
					title={`Directions to ${full_name}}`}
					rel="url"
					itemprop="hasMap"
					property="hasMap"
				>
					{google_maps}
				</a>
			</div>
		{/if}
		<div class="geo h-geo">
			{#if latitude && latitude != ''}
				<span class="label">Geolocation:</span>
				<span
					class="latitude p-latitude"
					itemprop="latitude"
					property="latitude">{latitude}</span
				>,
			{/if}
			{#if longitude && longitude != ''}
				<span
					class="longitude p-logitude"
					itemprop="longitude"
					property="longitude">{longitude}</span
				>
			{/if}
		</div>
	</div>

	<div class="social-media">
		{#if google_business && google_business != ''}
			<div class="google_business" title="Google Business Profile">
				<span class="label">Business Profile:</span>
				<a
					class="url u-url"
					target="google_business"
					href={google_business}
					title="Business Profile"
					rel="url"
					itemprop="url"
					property="url"
				>
					{google_business}
				</a>
			</div>
		{/if}
		{#if facebook && facebook != ''}
			<div class="facebook" title="Facebook">
				<span class="label">Facebook:</span>
				<a
					class="url u-url"
					target="facebook"
					href={facebook}
					title="Facebook"
					rel="url"
					itemprop="url"
					property="url"
				>
					{facebook}
				</a>
			</div>
		{/if}
		{#if twitter && twitter != ''}
			<div class="twitter" title="Twitter">
				<span class="label">Twitter:</span>
				<a
					class="url u-url"
					target="twitte"
					href={twitter}
					title="Twitter"
					rel="url"
					itemprop="url"
					property="url"
				>
					{twitter}
				</a>
			</div>
		{/if}
		{#if instagram && instagram != ''}
			<div class="instagram" title="Instagram">
				<span class="label">Instagram:</span>
				<a
					class="url u-url"
					target="instagram"
					href={instagram}
					title="Instagram"
					rel="url"
					itemprop="url"
					property="url"
				>
					{instagram}
				</a>
			</div>
		{/if}
		{#if linkedin && linkedin != ''}
			<div class="linkedin" title="LinkedIn">
				<span class="label">LinkedIn:</span>
				<a
					class="url u-url"
					target="linkedin"
					href={linkedin}
					title="LinkedIn"
					rel="url"
					itemprop="url"
					property="url"
				>
					{linkedin}
				</a>
			</div>
		{/if}
		{#if youtube && youtube != ''}
			<div class="youtube" title="YouTube">
				<span class="label">YouTube:</span>
				<a
					class="url u-url"
					target="youtube"
					href={youtube}
					title="YouTube"
					rel="url"
					itemprop="url"
					property="url"
				>
					{youtube}
				</a>
			</div>
		{/if}
		{#if vimeo && vimeo != ''}
			<div class="youtube" title="Vimeo">
				<span class="label">Vimeo:</span>
				<a
					class="url u-url"
					target="vimeo"
					href={vimeo}
					title="Vimeo"
					rel="url"
					itemprop="url"
					property="url"
				>
					{vimeo}
				</a>
			</div>
		{/if}
		{#if rss && rss != ''}
			<div class="rss" title="RSS">
				<span class="label">RSS:</span>
				<a
					class="url u-url"
					target="rss"
					href={rss}
					title="RSS"
					rel="url"
					itemprop="url"
					property="url"
				>
					{rss}
				</a>
			</div>
		{/if}
		{#if blog && blog != ''}
			<div class="blog" title="Blog">
				<span class="label">Blog:</span>
				<a
					class="url u-url"
					target="blog"
					href={blog}
					title="Blog"
					rel="url"
					itemprop="url"
					property="url"
				>
					{blog}
				</a>
			</div>
		{/if}
		{#if etsy && etsy != ''}
			<div class="etsy" title="Etsy">
				<span class="label">Etsy:</span>
				<a
					class="url u-url"
					target="etsy"
					href={etsy}
					title="Etsy"
					rel="url"
					itemprop="url"
					property="url"
				>
					{etsy}
				</a>
			</div>
		{/if}
		{#if yelp && yelp != ''}
			<div class="yelp" title="Yelp!">
				<span class="label">Yelp!:</span>
				<a
					class="url u-url"
					target="yelp"
					href={yelp}
					title="Yelp!"
					rel="url"
					itemprop="url"
					property="url"
				>
					{yelp}
				</a>
			</div>
		{/if}
		{#if airbnb && airbnb != ''}
			<div class="airbnb" title="AirBnB">
				<span class="label">AirBnB:</span>
				<a
					class="url u-url"
					target="airbnb"
					href={airbnb}
					title="AirBnB"
					rel="url"
					itemprop="url"
					property="url"
				>
					{airbnb}
				</a>
			</div>
		{/if}
		{#if tiktok && tiktok != ''}
			<div class="tiktok" title="TikTok">
				<span class="label">TikTok:</span>
				<a
					class="url u-url"
					target="tiktok"
					href={tiktok}
					title="TikTok"
					rel="url"
					itemprop="url"
					property="url"
				>
					{tiktok}
				</a>
			</div>
		{/if}
		{#if snapchat && snapchat != ''}
			<div class="snapchat" title="SnapChat">
				<span class="label">SnapChat:</span>
				<a
					class="url u-url"
					target="snapchat"
					href={snapchat}
					title="SnapChat"
					rel="url"
					itemprop="url"
					property="url"
				>
					{snapchat}
				</a>
			</div>
		{/if}
		{#if pinterest && pinterest != ''}
			<div class="pinterest" title="Pinterest">
				<span class="label">Pinterest:</span>
				<a
					class="url u-url"
					target="pinterest"
					href={pinterest}
					title="Pinterest"
					rel="url"
					itemprop="url"
					property="url"
				>
					{pinterest}
				</a>
			</div>
		{/if}
	</div>

	{#if vcf_file && vcf_file != ''}
		<div class="vcf-file" title="vCard File">
			<span class="label">vCard File:</span>
			<a
				class="url u-url"
				target="vcf_file"
				href={vcf_file}
				title="vCard File"
				rel="url"
				itemprop="url"
				property="url"
				encodingFormat="Text"
			>
				{vcf_file}
			</a>
		</div>
	{/if}
</div>

<!-- Note: These specs depend on exact markup and classes and heiarchy.  Getting multiple ones implimented at the same time takes a ton of very careful testing with the validators.  If you don't know what youa re doing, best not to edit this component. -->
<script>
	let type = 'person';
	let specific_type = 'Person';
	let item_type = 'https://schema.org/Person';
	let type_of = 'Person';
	/* ## Person or Organization ## */
	let photo;
	let photo_avif;
	let photo_webp;
	let photo_type = 'image';
	let organization;
	let website;
	let email_address;
	let phone;
	let fax;
	let address;
	let city;
	let state;
	let state_abbr;
	let zip;
	let country;
	let country_abbr;
	let category;
	let notes;
	let latitude;
	let longitude;
	let google_maps;
	let google_business;
	let facebook;
	let facebook_image;
	let twitter;
	let twitter_image;
	let instagram;
	let linkedin;
	let youtube;
	let vimeo;
	let rss;
	let blog;
	let etsy;
	let yelp;
	let airbnb;
	let tiktok;
	let snapchat;
	let pinterest;
	let vcf_file;
	/* ## Person ## */
	let full_name;
	let first_name;
	let last_name;
	let middle_name;
	let prefix_name;
	let suffix_name;
	let nick_name;
	let birthday;
	/* ## Organization ## */
	let hours_of_operation;
	let hours_of_operation_dt;
	let price_range;
	let logo;
	let logo_height = '';
	let logo_width = '';
	$: type = type && type != 'organization' ? 'person' : 'organization';
	$: specific_type =
		type && specific_type && type != 'organization'
			? 'Person'
			: specific_type != ''
			? `${specific_type}`
			: 'Organization';
	$: item_type =
		type && type != 'organization'
			? 'https://schema.org/Person'
			: `https://schema.org/${specific_type}`;
	$: type_of = type && type != 'organization' ? 'Person' : 'Organization';
	$: photo_type = type && type != 'organization' ? 'image' : 'logo';
	$: full_name =
		type && type != 'organization' && (organization || last_name)
			? `${first_name} ${last_name}`
			: `${organization}`;
	const openMap = () => {
		if (google_maps && google_maps != '') {
			const win = window.open(google_maps, 'google_maps');
			win.focus();
		}
	};
	export {
		type,
		specific_type,
		photo,
		photo_avif,
		photo_webp,
		first_name,
		last_name,
		middle_name,
		prefix_name,
		suffix_name,
		nick_name,
		organization,
		logo,
		logo_height,
		logo_width,
		website,
		email_address,
		phone,
		fax,
		address,
		city,
		state,
		state_abbr,
		zip,
		country,
		country_abbr,
		birthday,
		category,
		notes,
		hours_of_operation,
		hours_of_operation_dt,
		price_range,
		latitude,
		longitude,
		google_maps,
		google_business,
		facebook,
		facebook_image,
		twitter,
		twitter_image,
		instagram,
		etsy,
		linkedin,
		youtube,
		vimeo,
		rss,
		yelp,
		airbnb,
		tiktok,
		snapchat,
		pinterest,
		blog,
		vcf_file,
	};
</script>

<style>
	.label {
		font-weight: bold;
	}
	.type {
		display: block;
		position: absolute;
		margin-left: -9999vw;
	}
	.adr {
		cursor: pointer;
		display: inline-block;
	}
	.adr:hover {
		color: var(--color-yellow-vibrant, #f4ba38);
	}
	.hide {
		display: block;
		position: absolute;
		margin-left: -9999vw;
	}
</style>
