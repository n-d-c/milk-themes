<div {id} class={blockclass}>
	<div class="services-inner">
		<h2>Immigration Law Is All We Do</h2>
		<div class="blurb">
			<h3>
				When Your Freedom Is On The Line, Why Hire Lawyers Who Only
				Dabble In Immigration?
			</h3>
			<div class="block-content">
				<p>
					Harlan York & Associates is one of the most successful
					immigration law firms in the country.
				</p>
				<p>
					Using our extensive experience on thousands of immigration
					cases and daily reviews of new developments in the changing
					field of immigration law, we offer you the best legal
					counsel available.
				</p>
				<p>
					Harlan York & Associates are the best immigration lawyers
					for Green Cards, Deportation, Family Immigration, and
					Naturalization in New York, New Jersey, and the area. Harlan
					York has been named Immigration Lawyer of the Year four
					times by Best Lawyers, the most respected publication in the
					legal profession.
				</p>
			</div>
		</div>
		<div class="listing-grid services-listing">
			{#each services as service}
				<div class="service">
					<a
						href={`/immigration-law-services/${service?.slug}`}
						title={service?.title}
					>
						<div>
							<img
								class="icon"
								src={service?.Services?.icon?.sourceUrl}
								alt={service?.title}
								width="40"
								height="40"
							/>
						</div>
						<h4>{service?.title}</h4>
						<div>
							{@html cleanUp(service?.Services?.excerpt)}
						</div>
					</a>
				</div>
			{/each}
		</div>
		<div>
			<a href="/immigration-law-services" class="fancy-link">
				<span>View All Services</span>
			</a>
		</div>
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	import { stripTags } from '$milk/util/helpers.js';
	/* ## Variables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'services';
	$: blockclass = `services ${blockstyle}`;
	/* ## Data Loading ## */
	import { preload_services } from '$graphql/sitespecific.preload.js';
	let services = preload_services.slice(0, 6);
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
				services = data.services.nodes.slice(0, 6);
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
		padding: var(--padding-large);
		text-align: center;
	}
	.services-inner {
		padding: 50px var(--padding-inner, 20px) 100px;
		margin: 0 auto;
		max-width: var(--content-constrain);
		background: var(--color-offwhite, #f4f4f4);
	}
	h2,
	h3,
	p {
		color: var(--color-black, #000);
	}
	h2 {
		font-size: var(--extralarge-fontsize);
		margin-bottom: 40px;
	}

	h3 {
		color: var(--color-one);
		font-family: var(--font-main);
	}
	.service {
		background-color: white;
		display: inline-block;
		vertical-align: top;
		position: relative;
		width: 275px;
		max-width: 80%;
		height: 350px;
		margin: clamp(10px, 4vw, 30px);
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
		padding: 20px 15px;
	}
	.service:hover {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
		background: rgba(0, 0, 0, 0.05);
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
	.icon {
		width: 50px;
		height: auto;
		margin-bottom: 10px;
	}
	@media screen and (max-width: 850px) {
		.services-inner {
			padding: var(--padding-outer, 2vw) 10px;
		}
		.service {
			margin: clamp(10px, 4vw, 30px) 5px;
			width: 265px;
		}
	}
	@media screen and (max-width: 500px) {
		.services {
			padding: var(--padding-outer, 5vw) 20px;
		}
		.services-inner {
			padding: var(--padding-outer, 5vw) 10px;
		}
		.service {
			width: 250px;
			margin-left: -15px;
			margin-right: -15px;
			max-width: 100%;
		}
		.service h4 {
			font-size: calc(var(--font-size-h4, 22px) - 3px);
		}
	}
	@media screen and (max-width: 350px) {
		.services {
			padding: var(--padding-outer, 5vw) 15px;
		}
		.services-inner {
			padding: var(--padding-outer, 5vw) 0px;
		}
		.service {
			width: 220px;
			height: auto;
		}
	}
	@media screen and (min-width: 650px) {
		.services .blurb {
			margin: var(--padding);
			display: grid;
			grid-template-columns: 1fr 2fr;
			text-align: left;
			column-gap: 3em;
		}
	}
</style>
