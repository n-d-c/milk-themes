<div class:active={toggled} class="additional-description">
	{@html htmlContent}
</div>

<summary>
	<span class="more" on:click={toggleHandler}>{spanTextContent}</span>
</summary>

<script>
	let toggled = false;
	let htmlContent;
	let spanTextContent = 'Show More';

	function toggleHandler() {
		toggled = !toggled;
		spanTextContent = toggled ? 'Show Less' : 'Show More';
	}
	export { toggled, spanTextContent, htmlContent };
</script>

<style>
	.additional-description {
		max-height: 0px;
		overflow-y: hidden;
		transition: all 0.5s ease-in-out;
	}

	.additional-description.active {
		overflow-y: visible;
		max-height: 9999px;
	}
	details {
		max-width: unset !important;
	}
	details {
		overflow: hidden;
	}
	summary {
		background: transparent;
		color: var(--color-black);
		cursor: pointer;
		padding: 1rem 0;
	}
	.attorney:nth-child(even) summary {
		background: var(--color-offwhite);
	}
	summary::before {
		content: '';
	}
	summary span {
		cursor: pointer;
		text-transform: uppercase;
		font-weight: bold;
		display: inline-block;
		width: auto;
		position: relative;
	}
	summary span::after {
		height: 2px;
		background-color: transparent;
		position: absolute;
		content: '';
		width: 0;
		margin: 0 50%;
		display: block;
		bottom: 0;
		left: 0;
		transition: margin 0.5s, width 0.5s, opacity 0.5s, color 0.5s,
			background-color 0.5s;
	}
	summary:hover span::after {
		margin: 0 -10%;
		width: 120%;
		opacity: 1;
		background-color: var(--color-three);
	}
</style>
