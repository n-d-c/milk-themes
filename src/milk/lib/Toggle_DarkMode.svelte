{#if $milk.config.darkmode != 'disabled' && $milk.theme.darkmode == true}
	<button on:click={$milk?.browser?.toggleDarkMode} class="toggle-dark-mode">
		<slot>
			Switch to {$milk?.browser?.darkmode ? 'Light' : 'Dark'} Mode
		</slot>
	</button>
{/if}

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
</script>
