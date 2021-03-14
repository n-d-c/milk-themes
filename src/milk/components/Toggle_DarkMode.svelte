<button on:click={toggleDarkMode}>
	Switch to {$milk?.browser?.darkmode ? 'Light' : 'Dark'} Mode
</button>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Methods and Functions ## */
	const toggleDarkMode = () => {
		$milk.browser.darkmode = !$milk?.browser?.darkmode;
	};
</script>
