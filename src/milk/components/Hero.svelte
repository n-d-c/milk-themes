<div class="hero">
	<div class="hero-inner"><div class="hero-content"><slot /></div></div>
</div>

<style>
	.hero {
		width: 100%;
		min-height: min(calc(100vw / 16 * 9), 100vh);
		display: grid;
		place-content: center;
	}
	.hero-inner {
		display: inline-block;
		text-align: center;
	}
	.hero-content {
		padding: 5vw var(--hero-padding, 20vw);
	}
</style>
