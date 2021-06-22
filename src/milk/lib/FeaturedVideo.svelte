<div
	bind:this={video_element}
	on:mouseover={() => {
		show_video = true;
	}}
	on:click={() => {
		show_video = true;
	}}
	class="video"
>
	<div class="video-inner">
		{#if show_video}
			<iframe
				src="//player.vimeo.com/video/108146056"
				title="Video"
				frameborder="0"
				webkitallowfullscreen
				mozallowfullscreen
				allowfullscreen
				allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
				class="the-video"
			/>
		{:else}
			<picture>
				<source type="image/avif" srcset="/img/video_featured.avif" />
				<source type="image/webp" srcset="/img/video_featured.webp" />
				<img
					alt="video"
					loading="lazy"
					src="/img/video_featured.jpg"
					width="300"
					height="150"
					on:load={() => {
						show_video = true;
					}}
				/>
			</picture>
			<img
				src={`/milk/img/onload_then_do_video.gif?cache=${cache_bust}`}
				rel="nocache"
				data-dev="uncachable proximity loader"
				alt="loader"
				loading="lazy"
				width="1"
				height="1"
				on:load={() => {
					show_video = true;
				}}
			/>
		{/if}
	</div>
</div>

<script>
	import { onMount } from 'svelte';
	let id;
	let blockstyle = '';
	let blockclass = 'featuredvideo';
	$: blockclass = `featuredvideo ${blockstyle}`;
	let video_element;
	let video_observer;
	let show_video = false;
	let cache_bust = new Date()?.getTime();
	let video_source = '';
	let video_jpg = '';
	let video_webp = '';
	let video_avif = '';
	onMount(() => {
		video_observer = new IntersectionObserver(
			function (entries) {
				if (entries?.[0]?.isIntersecting === true) {
					show_video = true;
				}
			},
			{ threshold: [0] }
		);
		video_observer?.observe(video_element);
	});
	export { id, blockstyle, video_source, video_jpg, video_webp, video_avif };
</script>

<style>
	.video {
		display: block;
		width: 100%;
		text-align: center;
		overflow-x: hidden;
		padding: var(--padding);
	}
	.video-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
		position: relative;
		width: min(100%, min(100vw, var(--content-constrain)));
		height: min(
			calc(100vw / 300 * 129),
			calc(var(--content-constrain) / 300 * 129)
		);
		max-width: 100%;
	}
	picture {
		display: block;
	}
	img,
	.the-video {
		display: block;
		width: min(100%, min(100vw, var(--content-constrain)));
		height: min(
			calc(100vw / 300 * 129),
			calc(var(--content-constrain) / 300 * 129)
		);
		max-width: 100%;
	}
	iframe {
		width: min(100%, min(100vw, var(--content-constrain)));
		height: min(
			calc(100vw / 300 * 129),
			calc(var(--content-constrain) / 300 * 129)
		);
		max-width: 100%;
	}
</style>
