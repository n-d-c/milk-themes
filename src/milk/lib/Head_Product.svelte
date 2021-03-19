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
	$: price ||= '0.00';
	$: currency ||= 'USD';
	$: availability ||= 'instock';
	/* ## Exports ## **/
	export { price, currency, availability };
</script>
