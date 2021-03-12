<div
	class="color-swatch"
	style={`background: var(${color}); height: ${size}; width: ${size}`}
	title={`Color: ${title}, Use: ${color}`}
/>

<script>
	let title;
	let color;
	let size;
	$: title = title || '';
	$: color = color || 'transparent';
	$: size = size || '40px';
	export { title, size, color };
</script>

<style>
	.color-swatch {
		display: inline-block;
		margin: 5px;
		border: var(--border-size) var(--border-style) var(--border-color);
		vertical-align: middle;
	}
</style>
