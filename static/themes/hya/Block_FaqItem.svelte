<div class="single-faq-wrap">
	<div on:click={toggle} aria-expanded={isOpen} class="icon-wrap">
		<i />
		<i />
	</div>
	<div class="faq-content">
		<h3>{title}</h3>

		{#if isOpen}
			<div transition:slide={{ duration: 300 }} class="dropdown">
				<p>{content}</p>
			</div>
		{/if}
	</div>
</div>

<script>
	import { slide } from 'svelte/transition';
	let isOpen = false;
	const toggle = () => (isOpen = !isOpen);
	let title, content;

	export { title, content };
</script>

<style>
	.single-faq-wrap {
		display: flex;
		gap: 15px;
		width: auto;
	}
	.icon-wrap {
		position: relative;
		width: 40px;
		height: 40px;
	}

	.faq-content {
		flex: 1;
	}

	.icon-wrap i {
		position: absolute;
		display: block;
		background-color: var(--color-black);
	}

	.icon-wrap i:first-child {
		height: 16%;
		width: 100%;
		top: 50%;
		margin-top: -8%;
	}

	.icon-wrap i:nth-child(2) {
		height: 100%;
		width: 16%;
		left: 50%;
		margin-left: -8%;
		transform-origin: center;
		transition: transform 0.2s ease-in;
	}

	.dropdown {
		width: 50%;
	}

	[aria-expanded='true'] i:nth-child(2) {
		transform: rotate(0.25turn);
	}
</style>
