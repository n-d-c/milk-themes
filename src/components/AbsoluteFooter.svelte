<footer class="bg-yellow-vibrant">
	<div class="footer-inner">
		<div class="top-link" title="Link to top of page.">
			<ToTop>
				<img
					src="/img/icon-triangle-up.svg"
					width="18"
					height="29"
					alt="To Top"
					loading="lazy"
				/>
				<a href="#TopLinkAnchor" title="Link to top of page.">TOP</a>
			</ToTop>
		</div>
		<Copyright
			owner="Harlan York & Associates"
			tagline="Immigration Attourneys"
		/>
		<Credits
			name="Nelson Design Collective"
			url="https://nelsondesigncollective.com/"
			email="support@nelsondesigncollective.com"
		/>
	</div>
</footer>

<script>
	import ToTop from '$components/ToTop.svelte';
	import Copyright from '$components/Copyright.svelte';
	import Credits from '$components/Credits.svelte';
</script>

<style>
	footer {
		text-align: center;
		padding: 15px var(--padding-inner, 20px) 7px;
		font-size: var(--font-size-small, 15px);
		min-height: 90px;
		display: block;
		box-sizing: border-box;
	}
	@media screen and (max-width: 649px) {
		footer {
			min-height: 165px;
		}
	}
	.footer-inner {
		margin: 0 auto;
		max-width: var(--content-width-max, 1020px);
	}
	.top-link {
		display: inline-block;
		text-align: center;
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
		position: relative;
		margin-top: -10px;
	}
	.top-link:hover,
	.top-link:focus {
		-webkit-transform: scale(1.25);
		-ms-transform: scale(1.25);
		transform: scale(1.25);
		/* filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		); */
		color: var(--color-white, #fff) !important;
		/* filter: invert(1); */
	}
	.top-link a {
		color: inherit;
		text-decoration: none;
		display: block;
		font-size: 16px;
	}
	.top-link:hover a,
	.top-link:focus a {
		color: var(--color-white, #fff) !important;
	}
	.top-link img {
		width: 18px;
		height: auto;
		margin-bottom: -15px;
		filter: invert(0);
	}
	.top-link:hover img {
		color: var(--color-white, #fff) !important;
		filter: invert(1);
	}
	@media screen and (min-width: 650px) {
		.footer-inner {
			display: grid;
			grid-template-columns: 1fr auto 1fr;
			grid-template-areas: ' l m r ';
		}
		.top-link {
			grid-area: m;
		}
	}
</style>
