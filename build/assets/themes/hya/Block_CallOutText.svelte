<div {id} class={blockclass}>
	<div class="callouttext-inner">
		<h2>{title}</h2>
		<div class="callout-content"><slot /></div>
	</div>
</div>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## */
	let id;
	let title = '';
	let blockstyle = '';
	let extraclasses = '';
	let blockclass = 'callouttext';
	$: blockclass = `callouttext ${blockstyle} ${extraclasses}`;
	/* ## Methods and Functions ## */
	const doCall = () => {
		if (window?.callingCard?.show) {
			window?.callingCard?.show();
		}
	};
	const doEmail = () => {
		if (window?.location) {
			window.location = `mailto:${$milk?.site?.email_address}`;
		}
	};
	const doCalendar = () => {
		if (window?.calendarCard?.show) {
			window?.calendarCard?.show();
		}
	};
	/* ## Exports ## */
	export { id, blockstyle, extraclasses, title };
</script>

<style>
	.callouttext {
		display: block;
		text-align: center;
	}
	.callouttext-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
		color: var(--color-white, #fff);
	}
	h2 {
		color: var(--color-white, #fff);
		font-size: var(--extralarge-fontsize);
	}
	.callout-content {
		text-align: left;
		color: var(--color-white, #fff);
		margin: 0 calc(var(--padding-large) / 2);
		font-style: italic;
	}
</style>
