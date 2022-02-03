<div class="component-contactform">
	<h1>Email Us</h1>
	<p>Have a Question About Immigration?</p>
	<p>
		Contact Harlan York with your questions. We answer emails within 24
		hours or less.
	</p>
	<form method="post" on:submit|preventDefault={formSubmit}>
		<div class="flex-box">
			<div class="w-half input-label-wrap">
				<label for="input_1_3">First name</label>
				<input
					id="input_1_3"
					type="text"
					name="input_1_3"
					placeholder="First Name *"
				/>
				{#if errorMessages['input_1']}
					<p class="error-msg">{errorMessages['input_1']}</p>
				{/if}
			</div>

			<div class="w-half input-label-wrap">
				<label for="input_1_6">Last Name</label>
				<input
					type="text"
					id="input_1_6"
					name="input_1_6"
					placeholder="Last Name *"
				/>
			</div>
			<div class="w-half input-label-wrap">
				<label for="input_2">Email Address</label>
				<input
					type="email"
					name="input_2"
					placeholder="Email Address *"
				/>
				{#if errorMessages['input_2']}
					<p class="error-msg">{errorMessages['input_2']}</p>
				{/if}
			</div>

			<div class="w-half input-label-wrap">
				<label for="input_3">Phone</label>
				<input
					type="tel"
					name="input_3"
					id="input_3"
					placeholder="Phone Number *"
				/>
				{#if errorMessages['input_3']}
					<p class="error-msg">{errorMessages['input_3']}</p>
				{/if}
			</div>
			<div class="w-full input-label-wrap">
				<label for="input_4">Message</label>
				<textarea
					placeholder="Your Message..."
					class="message-box"
					type="textarea"
					name="input_4"
					id="input_4"
					rows="5"
					cols="50"
				/>
				{#if errorMessages['input_4']}
					<p class="error-msg">{errorMessages['input_4']}</p>
				{/if}
			</div>
		</div>
		{#if responseMessage}
			<p class="form-message">{responseMessage}</p>
		{/if}
		<button type="submit">Submit</button>
	</form>
</div>

<script>
	const stripHtml = (string) => string.replace(/(<([^>]+)>)/gi, '');
	let errorMessages = {};
	let responseMessage = '';
	let submissionSuccess = false;

	const normalizeResponse = (response) => {
		const isSuccess = response.is_valid;
		const message = isSuccess
			? stripHtml(response.confirmation_message)
			: 'There was a problem with your submission.';
		const validationError = isSuccess
			? {}
			: Object.fromEntries(
					Object.entries(response.validation_messages).map(
						([key, value]) => [`input_${key}`, value]
					)
			  );

		errorMessages = validationError;
		responseMessage = message;
		submissionSuccess = isSuccess;
		return {
			isSuccess,
			message,
			validationError,
		};
	};

	function formSubmit() {
		const formElement = this,
			action =
				'https://admin.immigrationlawnj.com/wp-json/gf/v2/forms/2/submissions',
			method = formElement.method,
			body = new FormData(formElement);

		fetch(action, {
			method,
			body,
		})
			.then((response) => response.json())
			.then((response) => normalizeResponse(response))
			.then((response) => {
				if (response.isSuccess) {
					alert('submission success:' + response.isSuccess);

					formElement.reset();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}
</script>

<style>
	h2 {
		text-align: center;
	}
	label {
		display: none;
	}
	.component-contactform {
		max-width: 800px;
		margin: 5em auto;
	}

	.flex-box {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	input,
	textarea {
		margin: 0.7em 0;
		padding: 0.8em 1em;
		width: 100%;
		border-color: var(--color-eight);
	}
	::placeholder {
		color: black;
		opacity: 0.8;
	}
	button {
		width: 25%;
		min-width: 190px;
		margin-left: auto;
		padding: 1em 0;
		text-transform: uppercase;
		font-weight: 800;
		font-size: var(--button-fontsize);
		background-color: var(--color-one);
		color: var(--color-white);
		border: none;
	}
	.error-msg {
		color: red;
	}

	.form-message {
		margin: 0 auto;
		text-align: center;
		font-size: var(--large-fontsize);
	}
	.w-full {
		flex: 100%;
	}
	.w-half {
		flex-basis: 49%;
	}

	@media screen and (max-width: 768px) {
		.w-half {
			flex-basis: 100%;
		}
		button {
			width: 100%;
		}
	}
</style>
