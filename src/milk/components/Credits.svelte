<svelte:head>
	<meta name="author" content={`${name} [${email}]`} />
	<meta name="author" type="website" content={name} />
	<meta
		name="generator"
		content="Made with MILK: Snowpack, Skypack, Svelte, PWA, WordPress, GraphQL, REST, JAMStack, SSR, SWR, Web Components by DevLove & RandomUser"
	/>
</svelte:head>

<div class="credits">
	<div class="site-credits">
		<nobr>
			Site by <wbr />
			<a
				href={url}
				target="_blank"
				rel="noreferrer"
				title={`Link to ${name}, the web design agency that designed and developed this site.`}
			>
				{name}
			</a>
		</nobr>
	</div>
	<div class="built-with" class:hide={!credit_milk}>
		<nobr>
			Built with <wbr />
			<a
				href={$milk?.credits?.url}
				target="_blank"
				rel="noreferrer"
				title={$milk?.credits?.tagline}
				class="built-with-milk"
			>
				<img
					src={$milk?.credits?.logo}
					width="20"
					height="20"
					alt={$milk?.credits?.title}
					loading="lazy"
					class="icon icon-milk"
				/>
			</a>
			<a
				href={$milk?.credits?.svelte_url}
				target="_blank"
				rel="noreferrer"
				title={$milk?.credits?.svelte_title}
				class="built-with-svelte"
				class:hide={!credit_svelte}
			>
				<img
					src={$milk?.credits?.svelte_logo}
					width="15"
					height="15"
					alt={$milk?.credits?.svelte_title}
					loading="lazy"
					class="icon icon-svelte"
				/>
			</a>
			<a
				href={$milk?.credits?.graphql_url}
				target="_blank"
				rel="noreferrer"
				title={$milk?.credits?.graphql_title}
				class="built-with-graphql"
				class:hide={!credit_graphql}
			>
				<img
					src={$milk?.credits?.graphql_logo}
					width="20"
					height="20"
					alt={$milk?.credits?.graphql_title}
					loading="lazy"
					class="icon icon-graphql"
				/>
			</a>
			<a
				href={$milk?.credits?.snowpack_url}
				target="_blank"
				rel="noreferrer"
				title={$milk?.credits?.snowpack_title}
				class="built-with-graphql"
				class:hide={!credit_snowpack}
			>
				<img
					src={$milk?.credits?.snowpack_logo}
					width="20"
					height="20"
					alt={$milk?.credits?.snowpack_title}
					loading="lazy"
					class="icon icon-snowpack"
				/>
			</a>
		</nobr>
	</div>
</div>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## */
	let name = $milk?.credits?.name || 'Milk.js';
	let url = $milk?.credits?.url || 'https://milkjs.com/';
	let email = $milk?.credits?.email || 'info@milkjs.com';
	let credit_milk = $milk?.config?.credit?.milk ?? true;
	let credit_svelte = $milk?.config?.credit?.svelte ?? true;
	let credit_graphql = $milk?.config?.credit?.graphql ?? true;
	let credit_snowpack = $milk?.config?.credit?.snowpack ?? true;
	export {
		name,
		url,
		email,
		credit_milk,
		credit_svelte,
		credit_graphql,
		credit_snowpack,
	};
</script>

<style>
	.hide {
		position: absolute;
		margin-left: -999999vw;
	}
	a {
	}
	img {
		display: inline-block;
		vertical-align: middle;
		cursor: pointer;
	}
	img.icon {
		margin-top: -5px 0;
	}
	.site-credits {
		line-height: 30px;
		vertical-align: middle;
	}
	.built-with {
		line-height: 30px;
		vertical-align: middle;
	}
</style>
