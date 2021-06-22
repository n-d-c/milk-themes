<footer {id} class={blockclass}>
	<div class="absolute-footer-inner">
		<slot name="content">
			<div class="middle-left-right">
				<div class="middle">
					<slot name="middle">
						<ToTop>
							<svg
								aria-hidden="true"
								focusable="false"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 320 512"
								><path
									fill="currentColor"
									d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z"
								/></svg
							>
							<a
								class="top-link"
								href="#TopLinkAnchor"
								title="Link to top of page.">TOP</a
							>
						</ToTop>
					</slot>
				</div>
				<div class="left">
					<slot name="left">
						<Copyright
							owner={$milk?.site?.organization || 'Milk.js'}
							tagline={$milk?.site?.tagline ||
								'Milk, it does a website good.'}
						/>
					</slot>
				</div>
				<div class="right">
					<slot name="right">
						<Credits
							name={$milk.site.author ||
								$milk.theme.theme_by ||
								$milk?.credits?.name}
							url={$milk.site.author_url ||
								$milk.theme.theme_by_url ||
								$milk?.credits?.url}
							email={$milk.site.email ||
								$milk.theme.theme_by_email ||
								$milk?.credits?.email}
						/>
					</slot>
				</div>
			</div>
		</slot>
	</div>
</footer>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Imports ## */
	import Copyright from '$milk/lib/Copyright.svelte';
	import Credits from '$milk/lib/Credits.svelte';
	import ToTop from '$milk/lib/ToTop.svelte';
	/* ## Vairables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'absolute-footer';
	$: blockclass = `absolute-footer ${blockstyle}`;
	export { id, blockstyle };
</script>

<style>
	.absolute-footer-inner {
		margin: 0 auto;
		max-width: var(--content-constrain, auto);
		padding: var(--padding-small);
	}
	.top-link {
		display: block;
	}
	.middle-left-right {
		display: block;
		text-align: center;
		position: relative;
		width: auto;
		font-size: 0;
	}
	.middle-left-right > div {
		display: inline-block;
		vertical-align: middle;
		width: auto;
		font-size: var(--base-fontsize);
	}
	.middle-left-right .left {
		float: left;
		text-align: left;
		padding-right: var(--padding);
		/* order: 1; */
		width: calc(calc(100% - 60px) / 2);
	}
	.middle-left-right .middle {
		text-align: center;
		/* order: 2; */
		width: 60px;
	}
	.middle-left-right .right {
		float: right;
		text-align: right;
		padding-left: var(--padding);
		/* order: 3; */
		width: calc(calc(100% - 60px) / 2);
	}
	@media screen and (max-width: 650px) {
		.middle-left-right > div {
			display: block;
			font-size: var(--small-fontsize);
		}
		.middle-left-right .left {
			float: none;
			text-align: center;
			padding-right: var(--padding);
			padding-left: var(--padding);
			width: auto;
		}
		.middle-left-right .middle {
			text-align: center;
			width: auto;
		}
		.middle-left-right .right {
			float: none;
			text-align: center;
			padding-left: var(--padding);
			padding-right: var(--padding);
			width: auto;
		}
	}
</style>
