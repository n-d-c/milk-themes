<div {id} class={blockclass}>
	<div class="services-inner">
		<div class="services-list">
			{#each services as service}
				<div class="service" id={service?.slug}>
					<div class="service-icon">
						<img
							class="icon"
							src={service?.Services?.icon?.sourceUrl}
							alt={service?.title}
							width="40"
							height="40"
						/>
					</div>
					<div class="service-content">
						<h4>{service?.title}</h4>
						<div>
							{@html cleanUp(service?.Services?.excerpt)}
						</div>
						<div>
							<details>
								<summary>
									<span class="more">Show More</span>
									<span class="less">Show Less</span>
								</summary>
								<div class="content">
									{@html service?.Services?.description}
								</div>
							</details>
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
	/* 	
	.attorneys-list {
		margin-top: -100px;
	}
	@media screen and (min-width: 650px) {
		.attorneys-list {
			text-align: left;
		}
	}
	.attorney {
		padding: var(--padding-large);
	}
	.attorney img {
		margin: 0 var(--padding-large) var(--padding-large);
	}
	.attorney:nth-child(even) {
		background: var(--color-offwhite);
	}
	.attorney:nth-child(odd) {
	}
	@media screen and (min-width: 650px) {
		.attorney:nth-child(even) img {
			float: right;
			margin: 0 0 var(--padding-large) var(--padding-large);
		}
		.attorney:nth-child(odd) img {
			float: left;
			margin: 0 var(--padding-large) var(--padding-large) 0;
		}
	}
	.attorney::after {
		content: '';
		display: block;
		clear: both;
	}
	.attorney .email {
		position: relative;
		margin: -10px 0 10px;
	}
	.attorney .email a {
		color: var(--color-one);
	}
	details {
		max-width: unset !important;
	}
	summary {
		background: var(--color-white);
		color: var(--color-black);
		cursor: pointer;
		padding: 1rem 0;
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
	} */
	.service {
		display: inline-block;
		vertical-align: top;
		position: relative;
		/* border: 4px solid var(--color-yellow-vibrant, #f4ba38); */
		/* width: 275px; */
		max-width: 80%;
		height: auto;
		margin: clamp(10px, 4vw, 30px) auto;
		/* border-radius: 75px; */
		/* background: var(--background-white, #fff); */
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
		/* filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0)); */
		padding: 20px 15px;
		border: 3px solid transparent;
		border-radius: 45px;
		position: relative;
	}
	.service:hover {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
		background: rgba(0, 0, 0, 0.05);
		/* filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		);
		border: 3px solid #000; */
		/* background: var(--background-offwhite, #f4f4f4) !important; */
	}
	.service h4 {
		font-weight: normal;
		text-transform: uppercase;
		margin-bottom: 0px;
	}
	.service p {
		font-size: calc(var(--font-size-small, 15px) - 1px);
	}
	.service a {
		text-decoration: none;
		color: var(--color-black);
	}
	.service-content {
		text-align: center;
	}
	.service-icon {
		text-align: center;
		position: relative;
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
			grid-template-columns: 20% calc(100% - 20% - 2em);
			column-gap: 2em;
		}
		.service-content {
			text-align: left;
		}
	}
</style>
