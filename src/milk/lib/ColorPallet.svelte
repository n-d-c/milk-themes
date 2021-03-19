<div class="color-pallets">
	<h4>{title}</h4>
	<div class="color-pallet">
		{#each swatches as swatch}
			<ColorSwatch title={swatch?.name} color={swatch?.color} {size} />
		{:else}
			No swatches found.
		{/each}
	</div>
	<div class="color-pallet swatches-details">
		<h5>Details</h5>
		{#each swatches as swatch}
			<div>
				<ColorSwatch
					title={swatch?.name}
					color={swatch?.color}
					size={size_smallest}
				/>
				{swatch?.color}
				<i>({swatch?.class} {swatch?.background_class})</i>
			</div>
		{:else}
			No swatches found.
		{/each}
		<div><slot /></div>
	</div>
</div>

<script>
	/* ## Components ## */
	import ColorSwatch from '$milk/lib/ColorSwatch.svelte';
	/* ## Variables ## */
	let title = '';
	let swatches = [];
	let size = '40px';
	let size_smaller = '30px';
	let size_smallest = '20px';
	/* ## Exports ## */
	export { title, swatches };
</script>

<style>
	.color-pallet {
		display: block;
		margin: 5px;
		border: var(--border-size) var(--border-style) var(--border-color);
		background: var(--background);
		color: var(--text-color);
		padding: var(--padding);
	}
	i {
		font-size: smaller;
	}
</style>
