{#if downloadAvailable}
	<div>
		<a
			href={downloadLink}
			target="_blank"
			rel="noreferrer"
			class="fancy-link"
			title="Read eBook"
		>
			<span> Download The FREE eBook </span>
		</a>
	</div>
{/if}
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
			<p>{responseMessage}</p>
		{/if}
	</form>
</div>

<script>
	let downloadAvailable = false;
	let eBookTitle;
	let downloadLink;
	let errorMessages = {};
	let responseMessage = '';
	let submissionSuccess = false;
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
					downloadAvailable = !downloadAvailable;
					formElement.reset();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	export { downloadLink, eBookTitle };
</script>
