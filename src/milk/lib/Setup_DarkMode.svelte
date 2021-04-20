<script>
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk, browser } from '$milk/milk.js';
	let darkMode;
	let setDarkMode = () => {};
	$: darkMode = $browser?.darkmode || false;
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
			$browser.darkmode = false;
		} else if ($milk?.theme?.darkmode != true) {
			$browser.darkmode = false;
		} else if (window?.localStorage?.getItem('dark-mode') == 'true') {
			$browser.darkmode = true;
		} else if (window?.localStorage?.getItem('dark-mode') == 'false') {
			$browser.darkmode = false;
		} else if ($milk?.config?.darkmode == 'dark') {
			$browser.darkmode = true;
		} else if ($milk?.config?.darkmode == 'light') {
			$browser.darkmode = false;
		} else {
			$browser.darkmode =
				window?.matchMedia &&
				window?.matchMedia('(prefers-color-scheme: dark)')?.matches;
		}
		$browser.toggleDarkMode = toggleDarkMode;
	});
	export const toggleDarkMode = () => {
		$browser.darkmode = !$browser?.darkmode;
	};
</script>
