<div
	class={`social-icon icon-for-${title
		.replace(/[^\w]/g, '')
		.toLowerCase()} ${title.replace(/[^\w]/g, '').toLowerCase()}`}
>
	<div>
		<a href={url} target="_blank" rel="noopener" {title}>
			<img
				src={icon}
				alt={title}
				class="icon"
				width={size}
				height={size}
				loading="lazy"
				style={`max-width: ${size}px; max-height: ${size}px;`}
			/>
			<span>{title}</span>
		</a>
	</div>
</div>

<script>
	let title = '';
	let icon = '';
	let size = 25;
	let url = '';
	export { title, icon, size, url };
</script>

<style>
	.social-icon {
		display: inline-block;
		vertical-align: middle;
	}
	.social-icon > div {
		/* display: grid;
		place-content: center; */
		position: relative;
		width: 100%;
		height: 100%;
		padding-top: calc(50% + 2px);
	}
	a {
		display: inline-block;
		vertical-align: middle;
		margin-top: -50%;
		width: 100%;
	}
	span {
		display: block;
	}
	.icon {
		width: auto;
		height: auto;
	}
</style>
