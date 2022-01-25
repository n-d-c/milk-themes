<form method="post" on:submit|preventDefault={formSubmit}>
	<div class="w-half input-label-wrap">
		<label for="input_1_3">First name</label>
		<input id="input_1_3" type="text" name="input_1_3" />
		{#if errorMessages['input_1']}
			<p>{errorMessages['input_1']}</p>
		{/if}
	</div>

	<div class="w-half input-label-wrap">
		<label for="input_1_6">Last Name</label>
		<input type="text" id="input_1_6" name="input_1_6" />
	</div>
	<div class="w-half input-label-wrap">
		<label for="input_2">Email Address</label>
		<input type="email" name="input_2" />
		{#if errorMessages['input_2']}
			<p>{errorMessages['input_2']}</p>
		{/if}
	</div>

	<div class="w-half input-label-wrap">
		<label for="input_3">Phone</label>
		<input type="tel" name="input_3" id="input_3" />
		{#if errorMessages['input_3']}
			<p>{errorMessages['input_3']}</p>
		{/if}
	</div>
	<div class="w-full input-label-wrap">
		<label for="input_4">Message</label>
		<textarea
			class="message-box"
			type="textarea"
			name="input_4"
			id="input_4"
			rows="5"
			cols="50"
		/>
		{#if errorMessages['input_4']}
			<p>{errorMessages['input_4']}</p>
		{/if}
	</div>
	{#if responseMessage}
		<p class="form-message">{responseMessage}</p>
	{/if}
	<button type="submit">Submit</button>
</form>

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
	label {
		display: block;
	}
	form {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin: 0 auto;
		max-width: 800px;
	}

	input,
	textarea {
		width: 100%;
	}

	button {
		margin: 0 auto;
		flex-basis: 100%;
	}

	.form-message {
		margin: 0 auto;
		text-align: center;
	}
	.w-full {
		flex: 100%;
	}
	.w-half {
		flex-basis: 49%;
	}
</style>
