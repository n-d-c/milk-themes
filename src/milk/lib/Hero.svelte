<div
	{id}
	class={`hero ${add_class}`}
	class:parallax={parallax == 'true'}
	style={`/* aspect-ratio: ${aspect_ratio}; */ width: 100%; height: -webkit-calc(100vw / 16 * 9); height: -moz-calc(100vw / 16 * 9); height: calc(100vw / 16 * 9);`}
>
	<div class="hero-background" {style}>
		{#if parallax != 'true'}
			<picture>
				{#if avif_srcset && avif_srcset.length > 0}
					<source type="image/avif" srcset={avif_srcset} />
				{/if}
				{#if webp_srcset && avif_srcset.length > 0}
					<source type="image/webp" srcset={webp_srcset} />
				{/if}
				<img
					class="bg-image"
					src={image_url}
					srcset={img_srcset}
					style={img_style}
					alt={title}
					loading={image_loading}
					width="1600"
					height="900"
				/>
			</picture>
		{/if}
	</div>
	<div class="hero-inner"><div class="hero-content"><slot /></div></div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	let id;
	let add_class = '';
	let image_url;
	let image_position = 'center center';
	let parallax = false;
	let aspect_ratio = '16/9';
	let image_loading = 'lazy';
	let img_srcset;
	let avif_srcset;
	let webp_srcset;
	let title = '';
	$: image_attachment = parallax != 'true' ? 'scroll' : 'fixed';
	$: style =
		parallax != 'true'
			? `background: transparent none;`
			: `background: transparent url('${image_url}') ${image_position} no-repeat; background-attachment: ${image_attachment}; background-size: ${background_size}`;
	$: background_size =
		parallax != 'true'
			? 'calc(100% + 2px) auto'
			: 'auto max(100vh, calc(100vw / 16 * 9))';
	$: img_width = parallax != 'true' ? '100%' : '100%';
	$: img_height = parallax != 'true' ? 'auto' : '100vh';
	$: img_position = parallax != 'true' ? 'absolute' : 'fixed';
	$: img_style = `width: ${img_width} !important; height: auto !important; min-height: 100%; position: ${img_position};`;
	// $: img_srcset =
	// 	img_srcset && img_srcset.length > 0
	// 		? addDomainIfMissing(img_srcset)
	// 		: addDomainIfMissing(image_url);
	// let img = '';
	// let wepb = '';
	// let avif = '';
	// $: image_url = addDomainIfMissing(image_url);
	// $: avif_srcset = addDomainIfMissing(avif_srcset);
	// $: webp_srcset = addDomainIfMissing(webp_srcset);

	const addDomainIfMissing = (tmp) => {
		// return url;
		if (tmp == '' || (tmp && tmp.startsWith('http'))) {
			// console.log(tmp);
			return tmp;
		} else {
			// console.log(tmp);
			// console.log(`${$milk.site.url}${tmp}`);
			return `${$milk.site.url}${tmp}`;
		}
	};
	onMount(async () => {
		if (!window?.location?.href?.includes('localhost')) {
			img_srcset =
				img_srcset && img_srcset.length > 0
					? addDomainIfMissing(img_srcset)
					: addDomainIfMissing(image_url);
			image_url = addDomainIfMissing(image_url);
			avif_srcset = addDomainIfMissing(avif_srcset);
			webp_srcset = addDomainIfMissing(webp_srcset);
		} else {
			img_srcset =
				img_srcset && img_srcset.length > 0 ? img_srcset : image_url;
		}
	});
	export {
		id,
		add_class,
		image_url,
		image_position,
		parallax,
		aspect_ratio,
		img_srcset,
		avif_srcset,
		webp_srcset,
		title,
		image_loading,
	};
</script>

<style>
	.hero {
		width: 100%;
		/* min-height: min(calc(100vw / 16 * 9), 100vh); */
		display: grid;
		place-items: center;
		background-size: cover;
		position: relative;
		overflow: hidden;
		text-align: center;
		position: relative;
		min-height: 50vh;
	}
	.hero-background {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		background-position: center;
	}
	.hero-inner {
		position: relative;
		z-index: 10;
		max-width: var(--content-constrain, 1200px);
		text-align: center;
		padding: var(--padding-small);
	}
	.hero:not(.parallax) .hero-background {
		margin-left: -50%;
	}
	.bg-image {
		position: absolute;
		object-fit: cover;
		background-position: center;
	}
	@media screen and (min-width: 1400px) {
		.hero-background {
			filter: blur(0.5px);
		}
	}
</style>
