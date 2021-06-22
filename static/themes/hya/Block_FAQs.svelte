<div {id} class={blockclass}>
	<div class="faqs-inner">
		<h2>Frequently Asked Questions</h2>
		<p>
			Loren Ipsum Dolor Sit Amet, Consetetur Sadipschin Elitr, Sed Diam
			Nonumy Eirmod.
		</p>
		<div class="faq-list">
			{#each faqs as faq}
				<div class="faq" id={faq?.slug}>
					<details>
						<summary>
							<span>{faq?.title}</span>
						</summary>
						<div class="content">
							{@html faq?.FAQ?.answer}
						</div>
					</details>
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
	let id;
	let blockstyle = '';
	let blockclass = 'faqs';
	$: blockclass = `faqs ${blockstyle}`;
	/* ## Data Loading ## */
	import { preload_faqs } from '$graphql/sitespecific.preload.js';
	let faqs = preload_faqs;
	let unsubscribe_faqs = () => {};
	import { Q_GET_FAQS } from '$graphql/sitespecific.graphql.js';
	/* ## Main ## */
	onMount(async () => {
		let queryVariables = { size: 99 };
		let getFAQs = $milk?.data?.gql(
			Q_GET_FAQS,
			$milk.data.sources.wordpress,
			queryVariables
		);
		unsubscribe_faqs = await getFAQs?.subscribe(async (fetched_data) => {
			let data = await fetched_data;
			// console.log(data);
			faqs = data.fAQs.nodes;
			console.log(faqs);
		});
	});
	/* ## Exit ## */
	onDestroy(() => {
		unsubscribe_faqs(); // important for garbage collection otherwise memory leak
	});

	export { id, blockstyle };
</script>

<style>
	h2 {
		font-size: var(--extralarge-fontsize);
	}
	.faqs {
		display: block;
		padding: 50px var(--padding-inner, 20px) 0;
		text-align: center;
	}
	.faqs-inner {
		margin: 0 auto;
		max-width: var(--content-width-max, 1020px);
		background: var(--color-offwhite);
		padding: calc(var(--padding) * 2) 0;
	}

	.faqs-list {
		margin: var(--padding);
		position: relative;
		font-size: 0;
	}
	.faq {
		margin: var(--padding);
		text-align: left;
	}
	@media screen and (min-width: 650px) {
		.faq {
			display: inline-block;
			vertical-align: top;
			width: calc(calc(98% - calc(var(--padding) * 3)) / 2);
			font-size: var(--base-fontsize);
		}
	}
	details {
		max-width: unset !important;
	}
	summary {
		background: var(--color-offwhite);
		color: var(--color-black);
		cursor: pointer;
		padding: 1rem 0;
		z-index: 99;
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
	details summary {
		padding-left: 4rem;
		padding-right: 1rem;
	}
	details summary::before {
		content: '×';
		color: #000;
		font-size: 4rem;
		line-height: 1rem;
		transform: rotate(-45deg);
		top: 1.2rem;
		left: 0.6rem;
	}
	details[open] > summary:before {
		transform: rotate(90deg);
		color: #f00 !important;
		transition: color ease 2s, transform ease 1s;
	}
</style>
