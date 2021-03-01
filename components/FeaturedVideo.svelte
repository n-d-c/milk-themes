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
				src={`/img/onload_then_do_video.gif?cache=${cache_bust}`}
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
	let video_element;
	let video_observer;
	let show_video = false;
	let cache_bust = new Date()?.getTime();
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
</script>

<style>
	.video {
		display: block;
		width: 100%;
		padding: 0 var(--padding-inner, 20px);
		color: var(--color-black, #000);
		text-align: center;
		background: var(--background-white, #fff);
		overflow-x: hidden;
	}
	.video-inner {
		margin: 0 auto;
		max-width: var(--content-width-max, 1020px);
		position: relative;
		width: min(100%, min(100vw, var(--content-width-max, 1200px)));
		height: min(
			calc(100vw / 300 * 129),
			calc(var(--content-width-max, 1200px) / 300 * 129)
		);
		max-width: 100%;
	}
	picture {
		display: block;
	}
	img,
	.the-video {
		display: block;
		width: min(100%, min(100vw, var(--content-width-max, 1200px)));
		height: min(
			calc(100vw / 300 * 129),
			calc(var(--content-width-max, 1200px) / 300 * 129)
		);
		max-width: 100%;
	}
	iframe {
		width: min(100%, min(100vw, var(--content-width-max, 1200px)));
		height: min(
			calc(100vw / 300 * 129),
			calc(var(--content-width-max, 1200px) / 300 * 129)
		);
		max-width: 100%;
	}
</style>
