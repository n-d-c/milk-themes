{#if display}
	<div class="paymentcard" class:hide={!display}>
		<button class="close" on:click={hidePaymentCard}>
			<img
				alt="Close"
				height="40"
				width="40"
				loading="lazy"
				src="/img/icon-close.svg"
				class="icon"
			/>
		</button>
		<div class="contents">
			<h1>Make a Payment</h1>
			<hr />
			<h2 class="pay-with pay-with-paypal">
				Pay with
				<img
					alt="PayPal"
					class="logo-paypal"
					src="/img/logo-paypal.svg"
				/>
			</h2>
			<p><em>(No PayPal account is necessary)</em></p>
			<div class="form-row">
				<label for="fullname">Full Name:</label>
				<input
					type="text"
					name="fulname"
					bind:value={fullname}
					placeholder="Full Name"
				/>
			</div>
			<div class="form-row">
				<label for="email">Email Address:</label>
				<input
					type="email"
					name="email"
					bind:value={email}
					placeholder="Email Address"
				/>
			</div>
			<div class="form-row">
				<label for="case">Phone Number:</label>
				<input
					type="text"
					name="phone"
					bind:value={phone}
					placeholder="Phone Number"
				/>
			</div>
			<div class="form-row">
				<label for="casenum">Case Number:</label>
				<input
					type="text"
					name="casenum"
					bind:value={casenum}
					placeholder="Case Number"
				/>
			</div>
			<form
				action="https://www.paypal.com/cgi-bin/webscr"
				method="post"
				target="_blank"
			>
				<input type="hidden" name="cmd" value="_xclick" />
				<input
					type="hidden"
					name="business"
					value={$milk?.site?.paypal}
				/>
				<input type="hidden" name="item_name" bind:value={itemdesc} />
				<input type="hidden" name="item_number" value="1" />
				<input type="hidden" name="no_shipping" value="1" />
				<input type="hidden" name="no_note" value="1" />
				<input type="hidden" name="currency_code" value="USD" />
				<input type="hidden" name="lc" value="US" />
				<input type="hidden" name="bn" value="PP-BuyNowBF" />
				<div class="form-row">
					<label for="amount">Amount:</label>
					<input
						type="number"
						name="amount"
						step="0.01"
						value="0.00"
						placeholder="0.00"
						onblur="this.value = parseFloat(this.value).toFixed(2)"
					/>
				</div>
				<div class="form-row button-row">
					<button
						type="submit"
						value="Submit"
						alt="PayPal - The safer, easier way to pay online."
					>
						<picture>
							<source
								type="image/avif"
								srcset="/img/button_paypal.avif"
							/>
							<source
								type="image/webp"
								srcset="/img/button_paypal.webp"
							/>
							<img
								src="/img/button_paypal.png"
								alt="Pay with PayPal"
								loading="lazy"
								width="300"
								height="171"
								class="button-paypal-img"
							/>
						</picture>
					</button>
				</div>
				<img
					alt="PayPal Tracking Pixel"
					border="0"
					src="https://www.paypal.com/en_AU/i/scr/pixel.gif"
					width="1"
					height="1"
				/>
			</form>
			<hr />
			<h2 class="pay-with pay-with-lawpay">
				Pay with
				<img class="logo-lawpay" src="/img/logo-lawpay.svg" />
			</h2>
			<a
				href={$milk?.site?.lawpay}
				target="_blank"
				rel="noreferrer"
				title="Pay with LawPay"
				class="lawpay-link button"
			>
				<picture>
					<source
						type="image/avif"
						srcset="/img/button_lawpay.avif"
					/>
					<source
						type="image/webp"
						srcset="/img/button_lawpay.webp"
					/>
					<img
						src="/img/button_lawpay.png"
						alt="Pay with LawPay"
						loading="lazy"
						width="229"
						height="86"
						class="button-lawpay-img"
					/>
				</picture>
			</a>
		</div>
	</div>
{/if}

<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	/* ## Variables ## */
	let display = false;
	let fullname = '';
	let email = '';
	let phone = '';
	let casenum = '';
	let itemdesc = '';
	$: itemdesc = `Payment for Legal Services - ${casenum} ${fullname} ${email} ${phone}`;
	/* ## Main ## */
	onMount(async () => {
		if (!window?.paymentCard) {
			window.paymentCard = {};
		}
		window.paymentCard.show = showPaymentCard;
		window.paymentCard.hide = hidePaymentCard;
	});
	/* ## Methods & Function ## */
	const showPaymentCard = () => {
		display = true;
	};
	const hidePaymentCard = () => {
		display = false;
	};
</script>

<style>
	.paymentcard {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		min-width: 100%;
		height: 100vh;
		min-height: 100%;
		display: grid;
		background: var(--background-white, #fff);
		text-align: center;
		z-index: 999999;
	}
	.close {
		position: absolute;
		top: 2vw;
		right: 4vw;
		z-index: 9999;
	}
	.close:hover img {
		filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)
			brightness(70%) contrast(97%);
	}
	@media screen and (max-width: 650px) {
		.close {
			right: unset;
			left: 4vw;
		}
	}
	h1,
	h2 {
		margin: 0;
		padding: 0;
	}
	h1 {
		margin-bottom: -10px;
	}
	p em {
		font-size: var(--small-fontsize);
		font-weight: 400;
		font-style: italic;
	}
	p {
		margin-bottom: 0;
	}
	button {
		display: inline-block;
		margin: 0;
		padding: 0;
		border: 0 none;
		background: transparent;
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
		filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		);
	}
	.hide {
		display: block;
		width: 100vw;
		position: absolute;
		left: -100vw;
	}
	.contents {
		margin: auto;
		padding: var(--padding);
		max-width: var(--content-constrain);
		min-width: 300px;
	}
	.pay-with {
		white-space: nowrap;
	}
	.logo-lawpay {
		height: 100px;
		width: auto;
		display: inline-block;
		vertical-align: middle;
	}
	.lawpay-link {
		display: block;
		position: relative;
		margin-top: -30px;
		border: 0px none;
		background: transparent;
	}
	.lawpay-link:hover {
		transform: scale(1.1);
		transition: all 0.3s ease;
		transform-origin: center;
		filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		);
	}
	.form-row {
		padding: 2px;
		text-align: left;
	}
	.form-row label {
		display: inline-block;
		vertical-align: middle;
		width: 120px;
		text-align: right;
	}
	.button-row {
		text-align: center;
		margin-bottom: -25px;
	}
	.button-row button,
	a.button {
		border: 0px none !important;
		display: inline-block;
		transition: all 0.3s ease;
		transform-origin: center;
	}
	.button-paypal-img {
		height: 60px;
		width: auto;
	}
	.button-lawpay-img {
		height: 60px;
		width: auto;
	}
	.pay-with-paypal {
		position: relative;
		margin-top: -15px;
	}
	.pay-with-lawpay {
		position: relative;
		margin-top: -40px;
	}
	@media screen and (max-width: 350px) {
		.form-row label {
			display: block;
			text-align: left;
			width: auto;
			font-size: var(--small-fontsize);
		}
		em {
			display: none;
		}
	}
</style>
