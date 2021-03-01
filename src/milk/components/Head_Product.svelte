<svelte:head>
	<meta property="og:type" content="product" />
	<meta property="product:price:amount" content={price} />
	<meta property="product:price:currency" content={currency} />
	<meta property="og:availability" content={availability} />
	<slot />
</svelte:head>

<script>
	/* ## Variables ## **/
	let price;
	let currency;
	let availability; // Valid Status: instock, preorder, backorder, pending, out of stock, discontinued
	/* ## Observables ## */
	$: price = price && price != '' ? price : '0.00';
	$: currency = currency && currency != '' ? currency : 'USD';
	$: availability =
		availability && availability != '' ? availability : 'instock';
	/* ## Exports ## **/
	export { price, currency, availability };
</script>
