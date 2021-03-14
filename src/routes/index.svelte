<Head_Language lang="en" />
<Head_HTML
	title="DevLove - Milk"
	description="Milk Website Booster"
	keywords="Milk, Website"
/>
<Head_Facebook />
<Head_Twitter />
<Layout_Main>
	<Hero>
		{#if logo}
			<img
				src={logo}
				alt={title}
				width={logo_width}
				height={logo_height}
			/>
		{/if}
		{#if title}<h1>{title}</h1>{/if}
		{#if tagline}<h2>{tagline}</h2>{/if}
		{#if excerpt}<h3>{excerpt}</h3>{/if}
		{#if details}<p>{details}</p>{/if}
	</Hero>
	<div class="content">
		<div class="content-inner">
			<h1>
				Welcome to 🥛Milk<span
					class="font-resize"
					style="--font-size: 0.60">.js</span
				>
			</h1>
			<div>
				<ul>
					<li>
						<a href="/documentation">Milk.js Documentation</a>
					</li>
					<li>
						<a href="/documentation/theme">
							Theme Documentation ({$milk?.theme?.name})
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</Layout_Main>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Head_Language from '$milk_components/Head_Language.svelte';
	import Head_HTML from '$milk_components/Head_HTML.svelte';
	import Head_Facebook from '$milk_components/Head_Facebook.svelte';
	import Head_Twitter from '$milk_components/Head_Twitter.svelte';
	import Layout_Main from '$site_theme/Layout_Main.svelte';
	import Hero from '$milk_components/Hero.svelte';
	/* ## Variables ## */
	let title;
	let tagline;
	let excerpt;
	let details;
	let logo;
	let logo_width;
	let logo_height;
	$: title ||= $milk?.credits?.title || '';
	$: tagline ||= $milk?.credits?.tagline || '';
	$: excerpt ||= $milk?.credits?.excerpt || '';
	$: details ||= $milk?.credits?.details || '';
	$: logo ||= $milk?.credits?.logo || '';
	$: logo_width ||= $milk?.credits?.logo_width || '200';
	$: logo_height ||= $milk?.credits?.logo_height || '200';
</script>

<style>
	img {
		width: 20vw;
		height: auto;
		margin: 0;
		position: relative;
		min-width: 100px;
	}
	.content-inner h1 {
		text-align: center;
	}
</style>
