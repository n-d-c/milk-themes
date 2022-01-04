<header {id} class={blockclass}>
	<div class="header-inner">
		<div class="header-content">
			<div class="logo">
				<a href="/" title="Home">
					<picture title={$milk.config.organization}>
						<img
							class="logo u-logo image"
							height={$milk.site.logo_height}
							width={$milk.site.logo_width}
							src={$milk.site.logo}
							alt={$milk.site.organization}
							loading="lazy"
							itemprop="logo"
							property="logo"
						/>
					</picture>
				</a>
			</div>
			<div class="contact">
				<div>
					<a
						href={`tel:+${$milk.site.phone}`}
						on:click|preventDefault={() => {
							if (window?.callingCard?.show) {
								window?.callingCard?.show();
							}
						}}
						title="Phone"
						rel="noreferrer"
					>
						{$milk.site.phone}
					</a>
				</div>
				<div class="address">
					<a
						href={$milk.site.google_maps}
						target="_blank"
						rel="noreferrer"
						title="Directions"
					>
						{$milk.site.address}, {$milk.site.address2}<br />
						{$milk.site.city}, {$milk.site.state_abbr}
						{$milk.site.zip}
					</a>
				</div>
			</div>
		</div>
	</div>
</header>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Vairables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'header';
	$: blockclass = `header ${blockstyle}`;
	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.header {
		padding: var(--padding) var(--padding) 0;
		min-height: 80px;
	}
	.header-inner {
		margin: 0 auto;
		max-width: var(--content-constrain, 1200px);
		text-align: center;
		padding: var(--padding-small);
	}
	a {
		transition: color var(--transition-speed);
		display: inline-block;
	}
	a:hover {
		text-decoration: none;
	}

	div.logo {
		max-width: 300px;
		width: 100%;
	}

	div.logo a {
		width: 100%;
	}
	img.logo {
		width: 100%;
	}

	.contact > div {
		margin-top: 5px;
	}

	@media screen and (max-width: 650px) {
		.header {
			display: none;
		}
	}
</style>
