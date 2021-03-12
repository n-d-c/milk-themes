<Documentation {title} {tagline} {excerpt} {logo}>
	<h2>Documentation for {$milk?.theme?.name} theme.</h2>
	<p>
		<a href={$milk?.theme?.url} title={$milk?.theme?.name}>
			{$milk?.theme?.url}
		</a>
	</p>
	<hr />

	<div class="theme-fonts">
		<h3>Theme Fonts</h3>
		<div class="fonts">
			<h4>Special Font</h4>
			<div class="fonts">
				<h1 class="font-special">
					This is the special font. (ABC123!@#)
				</h1>
				<h2 class="font-special">
					This is the special font. (ABC123!@#)
				</h2>
				<h3 class="font-special">
					This is the special font. (ABC123!@#)
				</h3>
				<h4 class="font-special">
					This is the special font. (ABC123!@#)
				</h4>
				<h5 class="font-special">
					This is the special font. (ABC123!@#)
				</h5>
				<h6 class="font-special">
					This is the special font. (ABC123!@#)
				</h6>
				<p class="font-special">
					This is the special font. (ABC123!@#)
				</p>
			</div>
			<hr />
			<h5>Additional Information</h5>
			--font-special
			<i>(.font-special)</i>
		</div>
		<div class="fonts">
			<h4>Main Font</h4>
			<div class="fonts">
				<h1 class="font-main">This is the main font. (ABC123!@#)</h1>
				<h2 class="font-main">This is the main font. (ABC123!@#)</h2>
				<h3 class="font-main">This is the main font. (ABC123!@#)</h3>
				<h4 class="font-main">This is the main font. (ABC123!@#)</h4>
				<h5 class="font-main">This is the main font. (ABC123!@#)</h5>
				<h6 class="font-main">This is the main font. (ABC123!@#)</h6>
				<p class="font-main">This is the main font. (ABC123!@#)</p>
			</div>
			<hr />
			<h5>Additional Information</h5>
			--font-main
			<i>(.font-main)</i>
		</div>
	</div>
	<hr />

	<h3>Theme Color Scheme</h3>
	<ColorPallet
		title="Monochrome"
		swatches={[
			{
				name: 'Transparent',
				color: '--color-transparent',
				class: '.color-transparent',
				background_class: '.background-transparent',
			},
			{
				name: 'White',
				color: '--color-white',
				class: '.color-white',
				background_class: '.background-white',
			},
			{
				name: 'Off White',
				color: '--color-offwhite',
				class: '.color-offwhite',
				background_class: '.background-offwhite',
			},
			{
				name: 'Grey Light',
				color: '--color-grey-light',
				class: '.color-grey-light',
				background_class: '.background-grey-light',
			},
			{
				name: 'Grey',
				color: '--color-grey',
				class: '.color-grey',
				background_class: '.background-grey',
			},
			{
				name: 'Grey Dark',
				color: '--color-grey-dark',
				class: '.color-grey-dark',
				background_class: '.background-grey-dark',
			},
			{
				name: 'Charcoal',
				color: '--color-charcoal',
				class: '.color-charcoal',
				background_class: '.background-charcoal',
			},
			{
				name: 'Black',
				color: '--color-black',
				class: '.color-black',
				background_class: '.background-black',
			},
		]}
	>
		<hr />
		<h5>Additional Information</h5>
		<div>.monochrome <i> (turn all contents into black and white) </i></div>
		<div>
			.print-monochrome
			<i> (turn all contents into black and white when printing) </i>
		</div>
		<div>
			.no-print <i> (hide for printing) </i>
		</div>
		<div>
			.hide <i>
				(hide visually, still accessable to screen readers and digital
				voice searches)
			</i>
		</div>
		<div>
			.remove <i>
				(hide for everyone including seo and screen readers)
			</i>
		</div>
		<div>
			.do-not-speak <i>
				(hide for screen readers and digital voice searches only, still
				visible)
			</i>
		</div>
		{#if $milk?.theme?.darkmode}
			<div>
				.light-mode <i>
					(force <span class="light-mode inline-block"
						><span style="background: var(--color-white);"
							>light mode</span
						></span
					> for a block or element)
				</i>
			</div>
			<div>
				.dark-mode <i>
					(force <span class="dark-mode inline-block"
						><span style="background: var(--color-white);"
							>dark mode</span
						></span
					> for a block or element)
				</i>
			</div>
		{/if}
	</ColorPallet>

	<ColorPallet
		title="Colors"
		swatches={[
			{
				name: 'Color 1',
				color: '--color-one',
				class: '.color-one',
				background_class: '.background-one',
			},
			{
				name: 'Color 2',
				color: '--color-two',
				class: '.color-two',
				background_class: '.background-two',
			},
			{
				name: 'Color 3',
				color: '--color-three',
				class: '.color-three',
				background_class: '.background-three',
			},
			{
				name: 'Color 4',
				color: '--color-four',
				class: '.color-four',
				background_class: '.background-four',
			},
			{
				name: 'Color 5',
				color: '--color-five',
				class: '.color-five',
				background_class: '.background-five',
			},
			{
				name: 'Color 6',
				color: '--color-six',
				class: '.color-six',
				background_class: '.background-six',
			},
			{
				name: 'Color 7',
				color: '--color-seven',
				class: '.color-seven',
				background_class: '.background-seven',
			},
			{
				name: 'Color 8',
				color: '--color-eight',
				class: '.color-eight',
				background_class: '.background-eight',
			},
		]}
	>
		<hr />
		<h5>Additional Information</h5>
		<div>
			.color-three <i>
				(set the color to <span class="color-three">Color 3</span>, use
				any of these numbers:
				<span class="color-one">one</span>,
				<span class="color-two">two</span>,
				<span class="color-three">three</span>,
				<span class="color-four">four</span>,
				<span class="color-five">five</span>,
				<span class="color-six">six</span>,
				<span class="color-seven">seven</span>, or
				<span class="color-eight">eight</span>)
			</i>
		</div>
		<div>
			.background-seven
			<i>
				(set the background color to
				<span class="background-seven inline-block">Color 7</span>, use
				any numbers:
				<span class="background-one inline-block">one</span>,
				<span class="background-two inline-block">two</span>,
				<span class="background-three inline-block">three</span>,
				<span class="background-four inline-block">four</span>,
				<span class="background-five inline-block">five</span>,
				<span class="background-six inline-block">six</span>,
				<span class="background-seven inline-block">seven</span>, or
				<span class="background-eight inline-block">eight</span>)
			</i>
		</div>
	</ColorPallet>

	<div class="notices">
		<h4>Notices</h4>
		<div class=" light-mode">
			<div class="notices" style="background: var(--color-white);">
				{#if $milk?.theme?.darkmode}<h5>Light Mode</h5>{/if}
				<div class="notice error"><em>Notice:</em> Error message.</div>
				<div class="notice warning">
					<em>Notice:</em> Warning message.
				</div>
				<div class="notice success">
					<em>Notice:</em> Success message.
				</div>
				<div class="notice notice">
					<em>Notice:</em> Notice message.
				</div>
			</div>
		</div>
		{#if $milk?.theme?.darkmode}
			<div class="dark-mode">
				<div class="notices" style="background: var(--color-white);">
					<h5>Dark Mode</h5>
					<div class="notice error">
						<em>Notice:</em> Error message.
					</div>
					<div class="notice warning">
						<em>Notice:</em> Warning message.
					</div>
					<div class="notice success">
						<em>Notice:</em> Success message.
					</div>
					<div class="notice notice">
						<em>Notice:</em> Notice message.
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="style-test">
		<Test_HTML mode="light" />
		<Test_HTML mode="dark" />
	</div>

	<hr />
	<slot />
</Documentation>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Documentation from '$milk_components/Documentation.svelte';
	// import ColorSwatch from '$milk_components/ColorSwatch.svelte';
	import ColorPallet from '$milk_components/ColorPallet.svelte';
	import Test_HTML from '$milk_components/Test_HTML.svelte';
	/* ## Variables ## */
	let title;
	let tagline;
	let excerpt;
	let logo;
	// let size = '45px';
	// let size_small = '20px';
	$: title = title || $milk?.theme?.name;
	$: tagline = tagline || $milk?.theme?.tagline;
	$: excerpt = excerpt || $milk?.theme?.excerpt;
	$: logo = logo || `/themes/${$milk?.theme?.slug}/logo_theme.svg`;
	/* ## Exports ## */
	export { title, tagline, excerpt, logo };
</script>

<style>
	.notices,
	.fonts {
		display: block;
		margin: 5px;
		border: var(--border-size) var(--border-style) var(--border-color);
		background: var(--background-color);
		color: var(--text-color);
		padding: 20px;
	}
	i {
		font-size: smaller;
	}
</style>
