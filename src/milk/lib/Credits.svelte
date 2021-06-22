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
					src={$milk?.credits?.logo_mini}
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
				href={$milk?.credits?.vite_url}
				target="_blank"
				rel="noreferrer"
				title={$milk?.credits?.vite_title}
				class="built-with-vite"
				class:hide={!credit_vite}
			>
				<img
					src={$milk?.credits?.vite_logo}
					width="20"
					height="20"
					alt={$milk?.credits?.vite_title}
					loading="lazy"
					class="icon icon-vite"
				/>
			</a>
			<a
				href={$milk?.credits?.rollup_url}
				target="_blank"
				rel="noreferrer"
				title={$milk?.credits?.rollup_title}
				class="built-with-rollup"
				class:hide={!credit_rollup}
			>
				<img
					src={$milk?.credits?.rollup_logo}
					width="14"
					height="14"
					alt={$milk?.credits?.rollup_title}
					loading="lazy"
					class="icon icon-rollup"
				/>
			</a>
			<a
				href={$milk?.credits?.postcss_url}
				target="_blank"
				rel="noreferrer"
				title={$milk?.credits?.postcss_title}
				class="built-with-postcss"
				class:hide={!credit_postcss}
			>
				<img
					src={$milk?.credits?.postcss_logo}
					width="18"
					height="18"
					alt={$milk?.credits?.postcss_title}
					loading="lazy"
					class="icon icon-postcss"
				/>
			</a>
			<a
				href={$milk?.credits?.markdown_url}
				target="_blank"
				rel="noreferrer"
				title={$milk?.credits?.markdown_title}
				class="built-with-markdown"
				class:hide={!credit_markdown}
			>
				<img
					src={$milk?.credits?.markdown_logo}
					width="30"
					height="20"
					alt={$milk?.credits?.markdown_title}
					loading="lazy"
					class="icon icon-markdown"
				/>
			</a>
		</nobr>
	</div>
</div>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Variables ## */
	let name = $milk?.site?.author || 'Milk.js';
	let url = $milk?.site?.author_url || 'https://milkjs.com/';
	let email = $milk?.site?.author_email || 'info@milkjs.com';
	let credit_milk = $milk?.config?.credit?.milk ?? true;
	let credit_svelte = $milk?.config?.credit?.svelte ?? true;
	let credit_graphql = $milk?.config?.credit?.graphql ?? true;
	let credit_vite = $milk?.config?.credit?.vite ?? true;
	let credit_rollup = $milk?.config?.credit?.rollup ?? true;
	let credit_postcss = $milk?.config?.credit?.postcss ?? false;
	let credit_markdown = $milk?.config?.credit?.markdown ?? false;
	export {
		name,
		url,
		email,
		credit_milk,
		credit_svelte,
		credit_graphql,
		credit_vite,
		credit_rollup,
		credit_postcss,
		credit_markdown,
	};
</script>

<style>
	.hide {
		position: absolute;
		margin-left: -999999vw;
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
	.credits > div {
		display: inline-block;
	}
</style>
