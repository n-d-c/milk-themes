export const makeInstallable = () => {
	/* #### Installable Web App #### */
	let deferredPrompt;

	const installButton = document.getElementById('installButton')

	if (installButton) {

		window.addEventListener('beforeinstallprompt', (e) => {
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later.
			deferredPrompt = e;
			// Update UI notify the user they can add to home screen.
			// eslint-disable-next-line
			console.log(`🍭Installable: Setup for Install Events.`);
			if (!(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true)) {
				installButton.style.display = 'inline-block';
			}
		});

		installButton.addEventListener('click', (e) => {
			// hide our user interface that shows our A2HS button
			installButton.style.display = 'none';
			// Show the prompt
			deferredPrompt.prompt();
			// Wait for the user to respond to the prompt
			deferredPrompt.userChoice.then((choiceResult) => {
					if (choiceResult.outcome === 'accepted') {
						// eslint-disable-next-line
						console.log(`🍭Installable: 👍 User Accepted Install Prompt.`);
					} else {
						// eslint-disable-next-line
						console.log(`🍭Installable: 👎 User Dismissed Install Prompt.`);
					}
					deferredPrompt = null;
				});
		});

		if (window.matchMedia('(display-mode: standalone)').matches) {
			// eslint-disable-next-line
			console.log(`🍭Installable: 🍬App in installed mode.`);
		}

		window.addEventListener('appinstalled', (e) => {
			// eslint-disable-next-line
			console.log(`🍭Installable: 🍬App is installed.`);
		});

	}

}
