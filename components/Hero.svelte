<div
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
					loading="lazy"
					width="1600"
					height="900"
				/>
			</picture>
		{/if}
	</div>
	<slot />
</div>

<script>
	let add_class = '';
	let image_url = '';
	let image_position = 'center center';
	let parallax = false;
	let aspect_ratio = '16/9';
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
	$: img_srcset =
		img_srcset && img_srcset.length > 0 ? img_srcset : image_url;
	export {
		add_class,
		image_url,
		image_position,
		parallax,
		aspect_ratio,
		img_srcset,
		avif_srcset,
		webp_srcset,
		title,
	};
</script>

<style>
	.hero {
		display: grid;
		place-items: center;
		background-size: cover;
		position: relative;
		overflow: hidden;
		text-align: center;
		position: relative;
	}
	.hero-background {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -20;
	}
	.hero:not(.parallax) .hero-background {
		margin-left: -50%;
	}
	.bg-image {
		position: absolute;
		object-fit: cover;
	}
	@media screen and (min-width: 1400px) {
		.hero-background {
			filter: blur(0.5px);
		}
	}
</style>
