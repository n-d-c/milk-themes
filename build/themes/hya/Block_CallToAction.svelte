<div {id} class={blockclass}>
	<div class="calltoaction-inner">
		<h2 class="title">Let Us Get To Work On Your Case Now</h2>
		<div>
			<button class="call-button" on:click={doCall}>
				<img
					src="/img/icon-phone-yellow.svg"
					class="icon icon-phone"
					loading="lazy"
					alt="Call Us"
					width="40"
					height="40"
				/>
				<span>(973) 642-1111</span>
			</button>
		</div>
		<div class="caption">We return most calls within 24 hours</div>
		<hr />
		<div class="actions">
			<div>
				<button on:click={doEmail}>
					<img
						src="/img/icon-email.svg"
						class="icon icon-email"
						loading="lazy"
						alt="Email Us"
						width="30"
						height="23"
					/>
					<span>EMAIL US</span>
				</button>
			</div>
			<div>
				<button on:click={doCalendar}>
					<img
						src="/img/icon-pen.svg"
						class="icon icon-pen"
						loading="lazy"
						alt="Consultation"
						width="30"
						height="30"
					/>
					<span>CONSULTATION</span>
				</button>
			</div>
			<div>
				<button>
					<img
						src="/img/icon-invoice.svg"
						class="icon icon-invoice"
						loading="lazy"
						alt="Pay Invoice"
						width="30"
						height="30"
					/>
					<span>PAY INVOICE</span>
				</button>
			</div>
		</div>
	</div>
</div>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## */
	let id;
	let blockstyle = '';
	let extraclasses = '';
	let blockclass = 'calltoaction';
	$: blockclass = `calltoaction ${blockstyle} ${extraclasses}`;
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
	export { id, blockstyle, extraclasses };
</script>

<style>
	.calltoaction {
		display: block;
		text-align: center;
	}
	.calltoaction-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
	}
	h2 {
		color: var(--color-white, #fff);
	}
	button {
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
	}
	button:hover {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
		/* filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		); */
	}
	button.call-button {
		color: var(--color-white, #fff);
		text-decoration: none;
		font-size: var(--large-fontsize);
		display: inline-block;
		padding: 10px 25px 10px 12px;
		border: 3px solid var(--color-white, #fff);
		background: transparent;
		margin: 25px 10px 15px;
		white-space: nowrap;
		min-width: 215px;
		display: inline-block;
	}
	button.call-button:hover {
		border: 3px solid var(--color-three);
	}
	button.call-button span {
		white-space: nowrap;
		position: relative;
		display: inline-block;
		line-height: 40px;
		vertical-align: middle;
	}
	.caption {
		text-transform: uppercase;
		font-size: 12px;
		letter-spacing: 1px;
	}
	hr {
		display: block;
		margin: 25px auto 0;
		border: 0 none;
		border-top: 3px solid var(--color-white, #fff);
	}
	.actions {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}
	.actions > div {
		text-align: center;
		display: grid;
		place-content: center;
	}
	.actions button {
		background: none;
		display: block;
		width: 100%;
		border: 0 none;
		color: var(--color-white, #fff);
		font-size: var(--base-fontsize);
		text-align: center;
	}
	.actions button:hover {
		filter: brightness(0.55) sepia(1) saturate(300%) hue-rotate(5deg)
			brightness(1.16) saturate(85%);
		/* drop-shadow(
				var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
			); */
	}
	.actions button span {
		display: block;
		text-align: center;
	}
	.icon {
		margin: 30px auto 15px;
		max-width: 30px;
		max-height: 30px;
		width: auto;
		height: auto;
		vertical-align: middle;
	}
	.icon-phone {
		margin: 0;
		max-width: 40px;
		max-height: 40px;
		transform-origin: center center;
	}
	@keyframes tada {
		0% {
			transform: scale(1);
		}
		10%,
		20% {
			transform: scale(0.9) rotate(-8deg);
		}
		30%,
		50%,
		70% {
			transform: scale(1.2) rotate(8deg);
		}
		40%,
		60% {
			transform: scale(1.2) rotate(-8deg);
		}
		80%,
		100% {
			transform: scale(1) rotate(0);
		}
	}
	button:hover .icon-phone {
		animation: tada 2s 1 linear;
	}
	@media screen and (max-width: 475px) {
		.actions button {
			font-size: var(--base-fontsiz);
		}
	}
	@media screen and (max-width: 400px) {
		.actions {
			display: block;
		}
	}
</style>
