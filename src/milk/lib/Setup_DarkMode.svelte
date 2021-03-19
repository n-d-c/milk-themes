<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	let darkMode;
	let setDarkMode = () => {};
	$: darkMode = $milk.browser.darkmode || false;
	$: setDarkMode(darkMode);
	/* ## Main ## */
	onMount(async () => {
		setDarkMode = () => {
			if (darkMode) {
				document?.querySelector('body')?.classList?.add('dark-mode');
				window.localStorage.setItem('dark-mode', 'true');
			} else {
				document?.querySelector('body')?.classList?.remove('dark-mode');
				window.localStorage.setItem('dark-mode', 'false');
			}
		};
		if ($milk?.config?.darkmode == 'disabled') {
			$milk.browser.darkmode = false;
		} else if ($milk?.theme?.darkmode != true) {
			$milk.browser.darkmode = false;
		} else if (window?.localStorage?.getItem('dark-mode') == 'true') {
			$milk.browser.darkmode = true;
		} else if (window?.localStorage?.getItem('dark-mode') == 'false') {
			$milk.browser.darkmode = false;
		} else if ($milk?.config?.darkmode == 'dark') {
			$milk.browser.darkmode = true;
		} else if ($milk?.config?.darkmode == 'light') {
			$milk.browser.darkmode = false;
		} else {
			$milk.browser.darkmode =
				window?.matchMedia &&
				window?.matchMedia('(prefers-color-scheme: dark)')?.matches;
		}
		$milk.browser.toggleDarkMode = toggleDarkMode;
	});
	export const toggleDarkMode = () => {
		$milk.browser.darkmode = !$milk?.browser?.darkmode;
	};
</script>
