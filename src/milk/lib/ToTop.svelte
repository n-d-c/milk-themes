<button
	class="to-top"
	on:click={$browser.scrollToTop}
	title="Link to top of page."
>
	<span class="top-link"><span><slot>Back To Top</slot></span></span>
</button>

<script>
	/* ## MILK ## */
	import { browser } from '$milk/milk.js';
</script>

<style>
	.to-top {
		display: block;
		cursor: pointer;
		border: 0 none;
		padding: 0;
		margin: 0 auto;
		background: none;
	}
	.to-top:focus,
	.to-top:active {
		outline: none;
	}
	.top-link {
		pointer-events: none;
		cursor: pointer;
	}
</style>
