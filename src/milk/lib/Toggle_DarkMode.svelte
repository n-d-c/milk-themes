{#if $milk.config.darkmode != 'disabled' && $milk.theme.darkmode == true}
	<button on:click={$browser?.toggleDarkMode} class="toggle-dark-mode">
		<slot>
			Switch to {$browser?.darkmode ? 'Light' : 'Dark'} Mode
		</slot>
	</button>
{/if}

<script>
	/* ## MILK ## */
	import { milk, browser } from '$milk/milk.js';
</script>
