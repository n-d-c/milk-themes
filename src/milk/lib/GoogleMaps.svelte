<div
	bind:this={map_element}
	class="map"
	on:mouseover={() => {
		show_map = true;
	}}
	on:click={() => {
		show_map = true;
	}}
	style={`/* background-image: url('${image_webp}'); background-image: -webkit-image-set('${image_webp}')1x ); background-image: image-set('${image_avif}')1x ); */`}
>
	{#if show_map}
		<iframe
			src={url}
			loading="lazy"
			frameborder="0"
			allowfullscreen="true"
			aria-hidden="false"
			tabindex="0"
			{title}
		/>
	{:else}
		<picture>
			{#if image_avif && image_avif != ''}
				<source type="image/avif" srcset={image_avif} />
			{/if}
			{#if image_webp && image_webp != ''}
				<source type="image/webp" srcset={image_webp} />
			{/if}
			<img
				alt="map"
				loading="lazy"
				src={image}
				width="270"
				height="184"
				on:load={() => {
					show_map = true;
				}}
			/>
		</picture>
		<img
			src={`/milk/img/onload_then_do_map.gif?cache=${cache_bust}`}
			rel="nocache"
			data-dev="uncachable proximity loader"
			alt="loader"
			loading="lazy"
			width="1"
			height="1"
			on:load={() => {
				show_map = true;
			}}
		/>
	{/if}
</div>

<script>
	import { onMount } from 'svelte';
	let map_element;
	let map_observer;
	let url;
	let title;
	let image;
	let image_webp;
	let image_avif;
	let show_map = false;
	let cache_bust = new Date().getTime();
	onMount(() => {
		map_observer = new IntersectionObserver(
			function (entries) {
				if (entries?.[0].isIntersecting === true) {
					show_map = true;
				}
			},
			{ threshold: [0] }
		);
		map_observer?.observe(map_element);
	});
	export { url, title, image, image_webp, image_avif };
</script>

<style>
	.map {
		display: block;
		text-align: left;
		width: 100%;
		height: 100%;
		min-height: 250px;
		padding: 0;
		font-size: 0;
		position: relative;
		background-size: cover !important;
		overflow: hidden;
	}
	iframe {
		display: block;
		border: 0 none;
		width: 100%;
		height: 100%;
	}
	/* ## in body iframes ## */
	body .map > iframe {
		min-height: 400px;
	}

	img {
		position: absolute;
		object-fit: cover;
		width: auto;
		min-width: 100%;
		height: auto;
		min-height: 100%;
		max-width: 100%;
	}
	@media screen and (max-width: 650px) {
		iframe {
			height: 300px;
		}
	}
</style>
