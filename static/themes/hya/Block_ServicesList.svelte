<div {id} class={blockclass}>
	<div class="services-inner">
		<div class="services-list">
			{#each services as service}
				<div class="service" id={service?.slug}>
					<div class="service-icon">
						<h4>{service?.title}</h4>
						{#if 'service-has-single' === service?.categories?.nodes[0]?.slug}
							<div class="extra-buttons">
								<a
									href="immigration-law-services/{service?.slug}"
									class="read-more"
									>Read More
								</a>
							</div>
						{/if}
					</div>
					<div class="service-content">
						<div>
							{@html cleanUp(service?.Services?.description)}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	import { stripTags } from '$milk/util/helpers.js';
	import { scrollToHash } from '$milk/util/scroll.js';
	let id;
	let blockstyle = '';
	let blockclass = 'services';
	$: blockclass = `services ${blockstyle}`;
	/* ## Data Loading ## */
	import { preload_services } from '$graphql/sitespecific.preload.js';
	let services = preload_services;
	let unsubscribe_services = () => {};
	import { Q_GET_SERVICES } from '$graphql/sitespecific.graphql.js';
	/* ## Main ## */
	let cleanUp = (html) => {
		return html.replace(/\u00a0/g, ' ');
	};
	onMount(async () => {
		cleanUp = (html) => {
			return stripTags(html).replace(/\u00a0/g, ' ');
		};
		let queryVariables = { size: 999 };
		let getServices = $milk?.data?.gql(
			Q_GET_SERVICES,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_services = await getServices?.subscribe(
			async (fetched_data) => {
				let data = await fetched_data;
				// console.log(data);
				services = data.services.nodes;
				setTimeout(scrollToHash, 1000);
			}
		);
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_services(); // important for garbage collection otherwise memory leak
	});
	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.services {
		display: block;
		padding: 50px var(--padding-inner, 20px);
		text-align: center;
	}
	.services-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
	}
	.service {
		background-color: white;
		display: inline-block;
		vertical-align: top;
		position: relative;
		max-width: 100%;
		height: auto;
		margin: clamp(10px, 4vw, 30px) auto;
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
		padding: 0;
		position: relative;
		border-radius: 0;
		border: 0;
	}
	.service:hover {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
		background: rgba(0, 0, 0, 0.05);
	}
	.service h4 {
		font-weight: bold;
		text-transform: capitalize;
		font-family: var(--font-special);
		margin-bottom: 0px;
		color: var(--color-four);
		text-align: left;
	}
	.service p {
		font-size: calc(var(--font-size-small, 15px) - 1px);
	}
	.service a {
		color: var(--color-white);
		font-weight: bold;
	}
	.service-content {
		text-align: center;
	}

	.service-content > div {
		padding: 2em 1em;
	}

	.service-icon {
		background-color: var(--color-six);
		text-align: left;
		position: relative;
		padding: 2em;
	}
	.icon {
		width: 50%;
		max-width: 100px;
		height: auto;
		margin-bottom: 20px;
	}
	details {
		max-width: unset !important;
	}
	summary {
		background: var(--color-white);
		color: var(--color-black);
		cursor: pointer;
		padding: 0.25rem 0;
		transition: all 0.3s ease;
		margin-top: -10px;
	}
	.service:hover summary {
		background: #f2f2f2;
	}
	.attorney:nth-child(even) summary {
		background: var(--color-offwhite);
	}
	summary::before {
		content: '';
	}
	summary span {
		cursor: pointer;
		text-transform: uppercase;
		font-weight: bold;
		display: inline-block;
		width: auto;
		position: relative;
	}
	summary .less {
		display: none;
	}
	details[open] summary .less {
		display: inline-block;
	}
	details[open] summary .more {
		display: none;
	}
	details .content {
		border: 0px none;
	}

	summary span::after {
		height: 2px;
		background-color: transparent;
		position: absolute;
		content: '';
		width: 0;
		margin: 0 50%;
		display: block;
		bottom: 0;
		left: 0;
		transition: margin 0.5s, width 0.5s, opacity 0.5s, color 0.5s,
			background-color 0.5s;
	}
	summary:hover span::after {
		margin: 0 -10%;
		width: 120%;
		opacity: 1;
		background-color: var(--color-three);
	}
	@media screen and (min-width: 650px) {
		.service {
			display: grid;
			grid-template-columns: 35% calc(100% - 35% - 2em);
			column-gap: 2em;
		}
		.service-content {
			text-align: left;
		}
	}
</style>
