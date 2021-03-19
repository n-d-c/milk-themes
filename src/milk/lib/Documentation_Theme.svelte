<Documentation {title} {tagline} {excerpt} {logo}>
	<div slot="hero">
		<Toggle_DarkMode />
	</div>
	<h2>
		Documentation for {$milk?.theme?.name} ({$milk?.theme?.slug}) theme.
	</h2>
	<p>
		<a href={$milk?.theme?.url} title={$milk?.theme?.name}>
			{$milk?.theme?.url}
		</a>
	</p>
	<pre><strong>Version:</strong> {$milk?.theme?.version} on {$milk?.theme?.date}</pre>
	<pre><strong>Author:</strong> {$milk?.theme?.author}</pre>

	<details class="theme-documentation">
		<summary><h3>Fonts</h3></summary>
		<div class="content">
			<div class="cols">
				<div class="theme-font">
					<details class="theme-documentation">
						<summary>
							<h4 class="special-font">Special Font</h4>
						</summary>
						<div class="content">
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
							<hr />
							<h5>Additional Information</h5>
							--font-special
							<i>(.font-special)</i>
						</div>
					</details>
				</div>
				<div class="theme-font">
					<details class="theme-documentation">
						<summary>
							<h4 class="main-font">Main Font</h4>
						</summary>
						<div class="content">
							<h1 class="font-main">
								This is the main font. (ABC123!@#)
							</h1>
							<h2 class="font-main">
								This is the main font. (ABC123!@#)
							</h2>
							<h3 class="font-main">
								This is the main font. (ABC123!@#)
							</h3>
							<h4 class="font-main">
								This is the main font. (ABC123!@#)
							</h4>
							<h5 class="font-main">
								This is the main font. (ABC123!@#)
							</h5>
							<h6 class="font-main">
								This is the main font. (ABC123!@#)
							</h6>
							<p class="font-main">
								This is the main font. (ABC123!@#)
							</p>
							<hr />
							<h5>Additional Information</h5>
							--font-main
							<i>(.font-main)</i>
						</div>
					</details>
				</div>
			</div>
		</div>
	</details>

	<details class="theme-documentation">
		<summary><h3>Color Scheme</h3></summary>
		<div class="content">
			<div class="cols">
				<div>
					<details class="theme-documentation">
						<summary>
							<h4 class="main-font">Monochrome</h4>
						</summary>
						<div class="content">
							<ColorPallet
								title=""
								swatches={[
									{
										name: 'Transparent',
										color: '--color-transparent',
										class: '.color-transparent',
										background_class:
											'.background-transparent',
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
										background_class:
											'.background-offwhite',
									},
									{
										name: 'Grey Light',
										color: '--color-grey-light',
										class: '.color-grey-light',
										background_class:
											'.background-grey-light',
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
										background_class:
											'.background-grey-dark',
									},
									{
										name: 'Charcoal',
										color: '--color-charcoal',
										class: '.color-charcoal',
										background_class:
											'.background-charcoal',
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
								<div>
									.monochrome <i>
										(turn all contents into black and white)
									</i>
								</div>
								<div>
									.print-monochrome
									<i>
										(turn all contents into black and white
										when printing)
									</i>
								</div>
								<div>
									.no-print <i> (hide for printing) </i>
								</div>
								<div>
									.hide <i>
										(hide visually, still accessable to
										screen readers and digital voice
										searches)
									</i>
								</div>
								<div>
									.remove <i>
										(hide for everyone including seo and
										screen readers)
									</i>
								</div>
								<div>
									.do-not-speak <i>
										(hide for screen readers and digital
										voice searches only, still visible)
									</i>
								</div>
								{#if $milk?.theme?.darkmode}
									<div>
										.light-mode <i>
											(force <span
												class="light-mode inline-block"
												><span
													style="background: var(--color-white);"
													>light mode</span
												></span
											> for a block or element)
										</i>
									</div>
									<div>
										.dark-mode <i>
											(force <span
												class="dark-mode inline-block"
												><span
													style="background: var(--color-white);"
													>dark mode</span
												></span
											> for a block or element)
										</i>
									</div>
								{/if}
							</ColorPallet>
						</div>
					</details>
				</div>

				<div>
					<details class="theme-documentation">
						<summary>
							<h4 class="main-font">Color</h4>
						</summary>
						<div class="content">
							<ColorPallet
								title=""
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
										(set the color to <span
											class="color-three">Color 3</span
										>, use any of these numbers:
										<span class="color-one">one</span>,
										<span class="color-two">two</span>,
										<span class="color-three">three</span>,
										<span class="color-four">four</span>,
										<span class="color-five">five</span>,
										<span class="color-six">six</span>,
										<span class="color-seven">seven</span>,
										or
										<span class="color-eight">eight</span>)
									</i>
								</div>
								<div>
									.background-seven
									<i>
										(set the background color to
										<span
											class="background-seven inline-block"
											>Color 7</span
										>, use any numbers:
										<span
											class="background-one inline-block"
											>one</span
										>,
										<span
											class="background-two inline-block"
											>two</span
										>,
										<span
											class="background-three inline-block"
											>three</span
										>,
										<span
											class="background-four inline-block"
											>four</span
										>,
										<span
											class="background-five inline-block"
											>five</span
										>,
										<span
											class="background-six inline-block"
											>six</span
										>,
										<span
											class="background-seven inline-block"
											>seven</span
										>, or
										<span
											class="background-eight inline-block"
											>eight</span
										>)
									</i>
								</div>
							</ColorPallet>
						</div>
					</details>
				</div>
			</div>
		</div>
	</details>

	<details class="theme-documentation for-notices">
		<summary><h3>Notices</h3></summary>
		<div class="content">
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
	</details>

	<details class="theme-documentation for-html">
		<summary><h3>HTML Test</h3></summary>
		<div class="content">
			<div class="cols">
				<div>
					<details class="theme-documentation">
						<summary>
							<h4 class="main-font">Headings</h4>
						</summary>
						<div class="content">
							<Test_HTML_Headings />
						</div>
					</details>
				</div>
				<div>
					<details class="theme-documentation">
						<summary>
							<h4 class="main-font">Lists</h4>
						</summary>
						<div class="content">
							<Test_HTML_Lists />
						</div>
					</details>
				</div>
				<div>
					<details class="theme-documentation">
						<summary>
							<h4 class="main-font">Tables</h4>
						</summary>
						<div class="content">
							<Test_HTML_Tables />
						</div>
					</details>
				</div>
				<div>
					<details class="theme-documentation">
						<summary>
							<h4 class="main-font">Content</h4>
						</summary>
						<div class="content">
							<Test_HTML_Content />
						</div>
					</details>
				</div>
				<div>
					<details class="theme-documentation">
						<summary>
							<h4 class="main-font">Additional Content</h4>
						</summary>
						<div class="content">
							<Test_HTML_AdditionalContent />
						</div>
					</details>
				</div>
				<div>
					<details class="theme-documentation">
						<summary>
							<h4 class="main-font">Forms</h4>
						</summary>
						<div class="content">
							<Test_HTML_Forms />
						</div>
					</details>
				</div>
			</div>
		</div>
	</details>
	<!--
	<div class="style-test">
		<Test_HTML mode="light" />
		<Test_HTML mode="dark" />
	</div> -->

	<hr />
	<slot />
</Documentation>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Documentation from '$milk/lib/Documentation.svelte';
	import Toggle_DarkMode from '$milk/lib/Toggle_DarkMode.svelte';
	// import ColorSwatch from '$milk/lib/ColorSwatch.svelte';
	import ColorPallet from '$milk/lib/ColorPallet.svelte';
	import Test_HTML_Headings from '$milk/lib/Test_HTML_Headings.svelte';
	import Test_HTML_Lists from '$milk/lib/Test_HTML_Lists.svelte';
	import Test_HTML_Tables from '$milk/lib/Test_HTML_Tables.svelte';
	import Test_HTML_Content from '$milk/lib/Test_HTML_Content.svelte';
	import Test_HTML_AdditionalContent from '$milk/lib/Test_HTML_AdditionalContent.svelte';
	import Test_HTML_Forms from '$milk/lib/Test_HTML_Forms.svelte';
	/* ## Variables ## */
	let title;
	let tagline;
	let excerpt;
	let logo;
	// let size = '45px';
	// let size_small = '20px';
	$: title ||= $milk?.theme?.name || '';
	$: tagline ||= $milk?.theme?.tagline || '';
	$: excerpt ||= $milk?.theme?.excerpt || '';
	$: logo ||=
		`/themes/${$milk?.theme?.slug}/logo_theme.svg` ||
		$milk?.credits?.logo ||
		'';
	/* ## Exports ## */
	export { title, tagline, excerpt, logo };
</script>

<style>
	.notices {
		display: block;
		border: var(--border-size) var(--border-style) var(--border-color);
		background: var(--background-color);
		color: var(--text-color);
		padding: var(--padding);
		margin: var(--gutter);
	}
	i {
		font-size: smaller;
	}
	details.theme-documentation {
		max-width: 100%;
		border: var(--border-size) var(--border-style) var(--border-color);
		box-shadow: var(--box-shadow);
		margin: var(--gutter);
	}
	details.theme-documentation summary {
		padding-right: 2.2rem;
		padding-left: 1rem;
		background: var(--background);
		color: var(--text-color);
		border: 0px none;
	}
	details[open].theme-documentation > summary {
		border-bottom: var(--border-size) var(--border-style)
			var(--border-color);
	}
	details.theme-documentation summary :is(h1, h2, h3, h4, h5, h6) {
		margin: 0;
		padding: 0;
	}
	details.theme-documentation summary::before {
		content: '×';
		color: var(--text-color);
		font-size: 2rem;
		line-height: 1rem;
		transform: rotate(-45deg);
		top: 1.2rem;
		left: unset;
		right: 0.6rem;
	}
	details[open].theme-documentation > summary:before {
		transform: rotate(90deg);
		color: #f00 !important;
		transition: color ease 2s, transform ease 1s;
	}
	details.theme-documentation .content {
		border: 0 none;
		padding: var(--padding);
	}
	.cols {
		display: grid;
		grid-template-columns: repeat(2, minmax(200px, 50%));
		margin: 0 auto;
		/* min-width: 200px;
			max-width: 500px; */
	}
	@media (max-width: 800px) {
		.cols {
			display: block;
		}
	}
</style>
