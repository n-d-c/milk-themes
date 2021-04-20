<details class="theme-documentation">
	<summary><h3>{title}</h3></summary>
	<div class="content">
		<slot />
	</div>
</details>

<script>
	let title;
	export { title };
</script>

<style>
	details.theme-documentation {
		max-width: 100%;
		border: var(--border-size) var(--border-style) var(--border-color);
		box-shadow: var(--box-shadow);
		margin: var(--gutter);
	}
	details.theme-documentation summary {
		padding-right: 2.2rem;
		padding-left: 1rem;
		background: var(--background);
		color: var(--text-color);
		border: 0px none;
	}
	details[open].theme-documentation > summary {
		border-bottom: var(--border-size) var(--border-style)
			var(--border-color);
	}
	details.theme-documentation summary :is(h1, h2, h3, h4, h5, h6) {
		margin: 0;
		padding: 0;
	}
	details.theme-documentation summary::before {
		content: '×';
		color: var(--text-color);
		font-size: 2rem;
		line-height: 1rem;
		transform: rotate(-45deg);
		top: 1.2rem;
		left: unset;
		right: 0.6rem;
	}
	details[open].theme-documentation > summary:before {
		transform: rotate(90deg);
		color: #f00 !important;
		transition: color ease 2s, transform ease 1s;
	}
	details.theme-documentation .content {
		border: 0 none;
		padding: var(--padding);
	}
</style>
