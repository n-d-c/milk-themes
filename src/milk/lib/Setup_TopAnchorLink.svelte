<script>
	import { onMount } from 'svelte';
	/* ## Main ## */
	onMount(async () => {
		if (!document?.querySelector('#TopLinkAnchor')) {
			const a = document?.createElement('a');
			a.name = `TopLinkAnchor`;
			a.id = `TopLinkAnchor`;
			const body = document?.querySelector('body');
			if (body) {
				body?.insertBefore(a, body?.firstChild);
			}
		}
	});
</script>
