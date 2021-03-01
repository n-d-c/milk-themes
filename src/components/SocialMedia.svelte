<div class="socialmedia">
	<div class="socialmedia-inner">
		<h2>Social Media</h2>
		<h3>Follow Us On</h3>
		<div class="social-icons">
			{#if $wp?.site?.facebook != ''}
				<SocialIcon
					title="Facebook"
					url={$wp?.site?.facebook}
					icon="/img/icon-socialmedia-facebook.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.twitter != ''}
				<SocialIcon
					title="Twitter"
					url={$wp?.site?.twitter}
					icon="/img/icon-socialmedia-twitter.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.instagram != ''}
				<SocialIcon
					title="Instagram"
					url={$wp?.site?.instagram}
					icon="/img/icon-socialmedia-instagram.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.linkedin != ''}
				<SocialIcon
					title="LinkedIn"
					url={$wp?.site?.linkedin}
					icon="/img/icon-socialmedia-linkedin.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.youtube != ''}
				<SocialIcon
					title="YouTube"
					url={$wp?.site?.youtube}
					icon="/img/icon-socialmedia-youtube.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.vimeo != ''}
				<SocialIcon
					title="Vimeo"
					url={$wp?.site?.vimeo}
					icon="/img/icon-socialmedia-vimeo.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.etsy != ''}
				<SocialIcon
					title="Etsy"
					url={$wp?.site?.etsy}
					icon="/img/icon-socialmedia-etsy.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.pinterest != ''}
				<SocialIcon
					title="Pinterest"
					url={$wp?.site?.pinterest}
					icon="/img/icon-socialmedia-pinterest.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.airbnb != ''}
				<SocialIcon
					title="AirBnB"
					url={$wp?.site?.airbnb}
					icon="/img/icon-socialmedia-airbnb.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.yelp != ''}
				<SocialIcon
					title="Yelp!"
					url={$wp?.site?.yelp}
					icon="/img/icon-socialmedia-yelp.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.tiktok != ''}
				<SocialIcon
					title="TikTok"
					url={$wp?.site?.tiktok}
					icon="/img/icon-socialmedia-tiktok.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.snapchat != ''}
				<SocialIcon
					title="SnapChat"
					url={$wp?.site?.snapchat}
					icon="/img/icon-socialmedia-snapchat.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.blog != ''}
				<SocialIcon
					title="Blog"
					url={$wp?.site?.blog}
					icon="/img/icon-socialmedia-blog.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.rss != ''}
				<SocialIcon
					title="RSS"
					url={$wp?.site?.rss}
					icon="/img/icon-socialmedia-rss.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.google_maps != ''}
				<SocialIcon
					title="Google Maps"
					url={$wp?.site?.google_maps}
					icon="/img/icon-socialmedia-google_maps.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.google_business != ''}
				<SocialIcon
					title="Google Business"
					url={$wp?.site?.google_business}
					icon="/img/icon-socialmedia-google_business.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.vcf_file != ''}
				<SocialIcon
					title="vCard"
					url={$wp?.site?.vcf_file}
					icon="/img/icon-socialmedia-vcard.svg"
					size="25"
				/>
			{/if}
			{#if $wp?.site?.calendar != ''}
				<SocialIcon
					title="Calendar"
					url={$wp?.site?.calendar}
					icon="/img/icon-socialmedia-calendar.svg"
					size="25"
				/>
			{/if}
			<slot />
		</div>
	</div>
</div>

<script>
	/* ## WP ## */
	import { wp } from '$components/wp.js';
	/* ## Components ## */
	import SocialIcon from '$components/SocialIcon.svelte';
</script>

<style>
	.socialmedia {
		display: block;
		padding: 100px var(--padding-inner, 20px);
		color: var(--color-black, #000);
		text-align: center;
		background: var(--background-white, #fff);
	}
	.socialmedia-inner {
		margin: 0 auto;
		max-width: var(--content-width-max, 1020px);
	}
	h2 {
		position: absolute;
		margin-left: -9999vw;
	}
	h3,
	p {
		color: var(--color-black, #000);
	}
</style>
