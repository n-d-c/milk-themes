<form method="post" on:submit|preventDefault={formSubmit}>
	<div class="w-half input-label-wrap">
		<label for="input_1_3">First name</label>
		<input id="input_1_3" type="text" name="input_1_3" />
	</div>

	<div class="w-half input-label-wrap">
		<label for="input_1_6">Last Name</label>
		<input type="text" id="input_1_6" name="input_1_6" />
	</div>
	<div class="w-half input-label-wrap">
		<label for="input_2">Email Address</label>
		<input type="email" name="input_2" />
	</div>

	<div class="w-half input-label-wrap">
		<label for="input_3">Phone</label>
		<input type="tel" name="input_3" id="input_3" />
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
	</div>
	<button type="submit">Submit</button>
</form>

<script>
	const stripHtml = (string) => string.replace(/(<([^>]+)>)/gi, '');
	const initialState = {
		isSuccess: false,
		message: '',
		validationError: {},
	};
	function updateState(elemState, newState) {
		Object.keys(newState).forEach(
			(key) => (elemState[key] = newState[key])
		);
	}
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
				updateState(formElement, response);

				if (response.isSuccess) {
					alert('submission success:' + response.isSuccess);

					formElement.reset();
				}
			})
			.catch((error) => {
				updateState({
					...initialState,
					...{
						message: 'Check the console for the error details.',
					},
				});
				console.log(error);
			});
	}
	// https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/

	// const initialState = {
	// 	isSuccess: false,
	// 	message: '',
	// 	validationError: {},
	// };

	// const normalizeResponse = (url, response) => {
	// 	if (url.match(/wp-json\/gf\/v2\/forms\/\d+\/submissions/)) {
	// 		return normalizeGravityFormsResponse(response);
	// 	}

	// 	return {
	// 		...initialState,
	// 		...{
	// 			message: 'Are you submitting to the right URL?',
	// 		},
	// 	};
	// };

	// const normalizeGravityFormsResponse = (response) => {
	// 	const isSuccess = response.is_valid;
	// 	const message = isSuccess
	// 		? stripHtml(response.confirmation_message)
	// 		: 'There was a problem with your submission.';
	// 	const validationError = isSuccess
	// 		? {}
	// 		: Object.fromEntries(
	// 				Object.entries(response.validation_messages).map(
	// 					([key, value]) => [`input_${key}`, value]
	// 				)
	// 		  );

	// 	return {
	// 		isSuccess,
	// 		message,
	// 		validationError,
	// 	};
	// };

	// const wpForm = () => {
	// 	return {
	// 		...initialState,
	// 		submit(event) {
	// 			console.log('is submit running?');
	// 			event.preventDefault();
	// 			event.stopPropagation();
	// 			const formElement = this.$refs.form,
	// 				action =
	// 					'https://admin.immigrationlawnj.com/wp-json/gf/v2/forms/2/submissions',
	// 				method = formElement,
	// 				body = new FormData(formElement);

	// 			fetch(action, {
	// 				method,
	// 				body,
	// 			})
	// 				.then((response) => response.json())
	// 				.then((response) => normalizeResponse(action, response))
	// 				.then((response) => {
	// 					this.updateState(response);

	// 					if (this.isSuccess) {
	// 						alert('submission success:' + this.isSuccess);
	// 						formElement.reset();
	// 					}
	// 				})
	// 				.catch((error) => {
	// 					this.updateState({
	// 						...initialState,
	// 						...{
	// 							message:
	// 								'Check the console for the error details.',
	// 						},
	// 					});
	// 					alert(error);
	// 				});
	// 		},
	// 		updateState(newState) {
	// 			Object.keys(newState).forEach(
	// 				(key) => (this[key] = newState[key])
	// 			);
	// 		},
	// 	};
	// };

	// window.wpForm = wpForm;
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
	.w-full {
		flex: 1;
	}
	.w-half {
		flex-basis: 49%;
	}
</style>
