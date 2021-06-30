<div class="callingcard" class:hide={!display}>
	<div class="callcard">
		<h2 class="fn org">
			<span class="organization-name">{$milk?.site.organization}</span>
		</h2>
		<p class="category">{$milk?.site.tagline}</p>
		<h3 class="tel">{$milk?.site.phone}</h3>
	</div>
	<div class="add-to-contacts">
		<button on:click={addToContacts} title="Add to Contacts">
			<img
				src="/img/icon-contactcard.svg"
				width="15"
				height="14"
				alt="Contact Card"
			/>
			Add to Contacts
		</button>
	</div>
	<div class="buttons">
		<div class="buttons-inner">
			<div class="left">
				<button
					title="Place Call"
					class="phone-button button-call"
					on:click={makeCall}
				>
					<img
						src="/img/icon-phone.svg"
						width="25"
						height="25"
						alt="Phone"
					/>
				</button>
			</div>
			<div class="middle" />
			<div class="right">
				<button
					title="Cancel"
					class="phone-button button-cancel"
					on:click={hideCallingCard}
				>
					<img
						src="/img/icon-cancel.svg"
						width="25"
						height="25"
						alt="Cancel"
					/>
				</button>
			</div>
		</div>
	</div>
</div>

<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	/* ## Variables ## */
	let display = false;
	/* ## Main ## */
	onMount(async () => {
		if (!window?.callingCard) {
			window.callingCard = {};
		}
		window.callingCard.show = showCallingCard;
		window.callingCard.hide = hideCallingCard;
		window.callingCard.call = makeCall;
		window.callingCard.add = addToContacts;
	});
	/* ## Methods & Function ## */
	const showCallingCard = () => {
		display = true;
	};
	const hideCallingCard = () => {
		display = false;
	};
	const makeCall = () => {
		window.location = `tel:+${$milk?.site?.telephone}`;
	};
	const addToContacts = () => {
		window.open($milk?.site?.vcf_file, 'contact');
	};
</script>

<style>
	.callingcard {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		min-width: 100%;
		height: 100vh;
		min-height: 100%;
		display: grid;
		background: var(--background-white, #fff);
		z-index: 999999;
	}
	h2,
	h3,
	p {
		color: var(--color-black, #000);
	}
	p {
		font-size: 25px;
		color: var(--color-grey, 585858);
	}
	.callcard {
		display: grid;
		place-content: center;
		text-align: center;
		padding: 5vw 5vw 2vw;
	}
	.buttons {
		text-align: center;
		width: 100%;
		display: grid;
		place-content: center;
		padding: 1vw 5vw 5vw;
	}
	.buttons-inner {
		max-width: 180px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 50px auto 50px;
		grid-template-areas: ' l m r ';
		width: 100vw;
	}
	button {
		display: inline-block;
		vertical-align: middle;
		padding: 0;
		margin: 0;
		border: 0 none;
		background: transparent none;
	}
	.phone-button {
		width: 50px;
		height: 50px;
		background: #4bcb70;
		border-radius: 25px;
		display: grid;
		place-content: center;
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
	}
	.phone-button:hover {
		-webkit-transform: scale(1.25);
		-ms-transform: scale(1.25);
		transform: scale(1.25);
		/* filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		); */
	}
	.phone-button img {
		width: 25px;
		height: auto;
		filter: invert(1);
	}
	.button-call {
		background: #4bcb70;
	}
	.left {
		grid-area: l;
		text-align: left;
		display: flex;
		/* align-items: center; */
		justify-content: flex-start;
		/* padding: 0 calc(50vw - 10vw - 50px) 0 10vw; */
	}
	.button-cancel {
		background: #ff3b2e;
	}
	.right {
		grid-area: r;
		text-align: right;
		display: flex;
		/* align-items: center; */
		justify-content: flex-end;
		/* padding: 0 10vw 0 calc(50vw - 10vw - 50px); */
	}
	.middle {
		grid-area: m;
	}
	.add-to-contacts {
		display: grid;
		place-items: center;
	}
	.add-to-contacts button {
		border: 2px solid #000;
		padding: 5px 15px;
		font-size: 16px;
		margin: 25px;
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
	}
	.add-to-contacts button:hover {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
		filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		);
	}
	.add-to-contacts button img {
		display: inline-block;
		width: 15px;
		height: auto;
		vertical-align: middle;
		position: relative;
		margin: -2px 5px 0 0;
	}
	.tel {
		margin: 15px 0;
	}
	.callingcard:not(.hide) {
		margin-left: 0vw;
		transition: all 0.5s;
	}
	.callingcard:is(.hide) {
		margin-left: 100vw;
		transition: all 0.2s;
	}
</style>
