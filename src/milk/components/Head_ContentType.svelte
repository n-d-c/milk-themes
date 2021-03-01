<svelte:head>
	<meta charset={encoding} />
	<meta http-equiv="content-type" {content} />
</svelte:head>

<script>
	/* ## Variables ## **/
	let mime_type = 'text/html';
	let encoding = 'utf-8';
	let content = 'text/html; charset=utf-8';
	$: content = `${mime_type}; charset=${encoding}`;
	/* ## Exports ## **/
	export { mime_type, encoding };
</script>
