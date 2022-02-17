<div class="modal">
	<form method="post" on:submit|preventDefault={formSubmit}>
		<input type="text" name="input_1_3" placeholder="First Name" />
		{#if errorMessages['input_1']}
			<p>{errorMessages['input_1']}</p>
		{/if}
		<input type="text" name="input_1_6" placeholder="Last Name" />
		<input type="email" name="input_2" placeholder="Email" />
		{#if errorMessages['input_2']}
			<p>{errorMessages['input_2']}</p>
		{/if}
		<input type="tel" name="input_3" placeholder="000-000-0000" />
		{#if errorMessages['input_3']}
			<p>{errorMessages['input_3']}</p>
		{/if}
		<input type="hidden" name="input_4" value={eBookTitle} />
		<button type="submit">Submit</button>
		{#if responseMessage}
			<p class="response-msg">{responseMessage}</p>
		{/if}
	</form>
</div>

<script>
	let eBookTitle;
	let downloadLink;
	let errorMessages = {};
	let responseMessage = '';
	let submissionSuccess = false;
	const doDownload = () => {
		window.location = downloadLink;
	};
	const stripHtml = (string) => string.replace(/(<([^>]+)>)/gi, '');

	const normalizeResponse = (response) => {
		console.log(response);
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
				'https://admin.immigrationlawnj.com/wp-json/gf/v2/forms/3/submissions',
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
					doDownload();
					// downloadAvailable = !downloadAvailable;
					formElement.reset();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function forceDownload(blob) {
		// Create an invisible anchor element
		const anchor = document.createElement('a');
		anchor.style.display = 'none';
		anchor.href = window.URL.createObjectURL(blob);
		anchor.setAttribute('download');
		document.body.appendChild(anchor);

		// Trigger the download by simulating click
		anchor.click();

		// Clean up
		window.URL.revokeObjectURL(anchor.href);
		document.body.removeChild(anchor);
	}

	function downloadResource() {
		const url = this.href;
		fetch(url, {
			headers: new Headers({
				Origin: window.location.origin,
			}),
			mode: 'cors',
		})
			.then((response) => response.blob())
			.then((blob) => forceDownload(blob))
			.catch((e) => console.error(e));
	}

	export { downloadLink, eBookTitle };
</script>

<style>
	input,
	textarea {
		margin: 0.4em 0;
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
		margin: auto;
		text-align: center;
		font-size: var(--large-fontsize);
	}
	.response-msg {
		margin-top: 1em;
		font-size: 110%;
	}
</style>
