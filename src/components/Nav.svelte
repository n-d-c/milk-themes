<nav>
	<a href="/">Home</a>
	<a href="/about/">About</a>
	<a href="/stuff/">Stuff</a>
	{$wp.user.firstname}
</nav>

<script>
	import { onMount } from 'svelte';
	import { wp } from '$components/wp.js';
	onMount(async () => {
		// todo
	});
</script>
