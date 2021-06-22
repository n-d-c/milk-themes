<div {id} class={blockclass}>
	<div class="socialmedia-inner">
		<h2>Social Media</h2>
		<h3>Follow Us On</h3>
		<div class="social-icons">
			{#if $milk?.site?.facebook != ''}
				<SocialIcon
					title="Facebook"
					url={$milk?.site?.facebook}
					icon="/img/icon-socialmedia-facebook.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.twitter != ''}
				<SocialIcon
					title="Twitter"
					url={$milk?.site?.twitter}
					icon="/img/icon-socialmedia-twitter.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.instagram != ''}
				<SocialIcon
					title="Instagram"
					url={$milk?.site?.instagram}
					icon="/img/icon-socialmedia-instagram.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.linkedin != ''}
				<SocialIcon
					title="LinkedIn"
					url={$milk?.site?.linkedin}
					icon="/img/icon-socialmedia-linkedin.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.youtube != ''}
				<SocialIcon
					title="YouTube"
					url={$milk?.site?.youtube}
					icon="/img/icon-socialmedia-youtube.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.vimeo != ''}
				<SocialIcon
					title="Vimeo"
					url={$milk?.site?.vimeo}
					icon="/img/icon-socialmedia-vimeo.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.etsy != ''}
				<SocialIcon
					title="Etsy"
					url={$milk?.site?.etsy}
					icon="/img/icon-socialmedia-etsy.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.pinterest != ''}
				<SocialIcon
					title="Pinterest"
					url={$milk?.site?.pinterest}
					icon="/img/icon-socialmedia-pinterest.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.airbnb != ''}
				<SocialIcon
					title="AirBnB"
					url={$milk?.site?.airbnb}
					icon="/img/icon-socialmedia-airbnb.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.yelp != ''}
				<SocialIcon
					title="Yelp!"
					url={$milk?.site?.yelp}
					icon="/img/icon-socialmedia-yelp.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.tiktok != ''}
				<SocialIcon
					title="TikTok"
					url={$milk?.site?.tiktok}
					icon="/img/icon-socialmedia-tiktok.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.snapchat != ''}
				<SocialIcon
					title="SnapChat"
					url={$milk?.site?.snapchat}
					icon="/img/icon-socialmedia-snapchat.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.blog != ''}
				<SocialIcon
					title="Blog"
					url={$milk?.site?.blog}
					icon="/img/icon-socialmedia-blog.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.rss != ''}
				<SocialIcon
					title="RSS"
					url={$milk?.site?.rss}
					icon="/img/icon-socialmedia-rss.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.google_maps != ''}
				<SocialIcon
					title="Google Maps"
					url={$milk?.site?.google_maps}
					icon="/img/icon-socialmedia-google_maps.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.google_business != ''}
				<SocialIcon
					title="Google Business"
					url={$milk?.site?.google_business}
					icon="/img/icon-socialmedia-google_business.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.vcf_file != ''}
				<SocialIcon
					title="vCard"
					url={$milk?.site?.vcf_file}
					icon="/img/icon-socialmedia-vcard.svg"
					size="25"
				/>
			{/if}
			{#if $milk?.site?.calendar != ''}
				<SocialIcon
					title="Calendar"
					url={$milk?.site?.calendar}
					icon="/img/icon-socialmedia-calendar.svg"
					size="25"
				/>
			{/if}
			<slot />
		</div>
	</div>
</div>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import SocialIcon from '$milk/lib/SocialIcon.svelte';
	/* ## Variables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'socialmedia';
	$: blockclass = `socialmedia ${blockstyle}`;
	export { id, blockstyle };
</script>

<style>
	.socialmedia {
		display: block;
		padding: var(--padding) var(--padding) 100px;;
		color: var(--color-black, #000);
		text-align: center;
		background: var(--color-white, #fff);
	}
	.socialmedia-inner {
		margin: 0 auto;
		max-width: var(--constrain-content);
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
