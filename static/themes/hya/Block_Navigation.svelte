<div {id} class={blockclass}>
	<div class="navigation-inner">
		<div class="nav-logo">
			<a href="/" title="home">
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 64 58"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xml:space="preserve"
					xmlns:serif="http://www.serif.com/"
					style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
				>
					<g
						id="Path_6526"
						transform="matrix(1,0,0,1,-74.94,-72.328)"
					>
						<path
							fill="currentColor"
							d="M124.252,72.328L91.458,72.328L91.458,72.7C89.277,72.912 88.048,73.068 87.358,73.755C86.782,74.395 86.57,75.437 86.515,77.169C86.505,77.529 86.499,77.911 86.499,78.34L86.499,80.084C86.426,82.069 86.462,84.365 86.462,85.655L86.4,93.53C91.481,89.564 94.641,88.51 97.43,88.51C101.645,88.51 103.13,91.237 103.13,95.824L103.13,107.846C103.13,112.494 103.376,113.176 107.963,113.484C108.024,113.484 108.086,113.859 108.024,113.859C106.724,113.672 103.068,113.484 101.333,113.484C99.302,113.462 97.272,113.588 95.259,113.859C95.136,113.859 95.259,113.484 95.321,113.484C98.729,113.177 99.472,112.744 99.472,107.846L99.472,98.546C99.472,92.908 98.047,90.551 94.703,90.551C92.72,90.551 91.11,91.111 86.403,94.024L86.403,107.843C86.403,112.429 86.959,113.173 90.49,113.481C90.553,113.481 90.677,113.856 90.553,113.856C88.641,113.624 86.717,113.498 84.791,113.481C82.452,113.464 80.115,113.59 77.791,113.856C77.666,113.856 77.791,113.481 77.791,113.481C82.254,113.049 82.747,112.863 82.747,107.843L82.8,76.732C82.864,75.677 82.578,74.63 81.986,73.754C81.296,73.068 80.065,72.911 77.886,72.642L77.886,72.328L74.789,72.288L74.94,115.653C74.94,123.535 81.426,130.022 89.308,130.023L122.133,130.023L122.133,129.715C124.312,129.504 125.542,129.346 126.233,128.659C126.806,128.021 127.02,126.978 127.074,125.248C127.084,124.886 127.09,124.502 127.09,124.075L127.09,122.332C127.162,120.347 127.128,118.052 127.128,116.761L127.19,108.884C122.109,112.851 118.947,113.904 116.159,113.904C111.944,113.904 110.459,111.177 110.459,106.59L110.459,94.563C110.459,89.915 110.214,89.233 105.627,88.924C105.565,88.924 105.503,88.551 105.565,88.551C106.865,88.736 110.523,88.924 112.26,88.924C114.29,88.946 116.32,88.821 118.332,88.551C118.457,88.551 118.332,88.924 118.27,88.924C114.863,89.234 114.12,89.666 114.12,94.563L114.12,103.863C114.12,109.501 115.544,111.857 118.889,111.857C120.874,111.857 122.489,111.299 127.194,108.387L127.194,94.563C127.194,89.977 126.636,89.233 123.104,88.924C123.042,88.924 122.917,88.551 123.042,88.551C124.955,88.782 126.879,88.906 128.805,88.924C131.144,88.941 133.481,88.817 135.805,88.551C135.929,88.551 135.805,88.924 135.805,88.924C131.343,89.357 130.849,89.544 130.849,94.563L130.79,125.679C130.727,126.733 131.014,127.779 131.605,128.654C132.297,129.341 133.526,129.498 135.705,129.765L135.705,130.017L138.618,130.017L138.618,86.696C138.618,78.815 132.133,72.329 124.252,72.328Z"
							style="fill:white;fill-rule:nonzero;"
						/>
					</g>
				</svg>
			</a>
		</div>
		<div class="nav-extra">
			<a
				href={$milk.site.google_maps}
				target="_blank"
				rel="noreferrer"
				title="Directions"
				class="map"
			>
				<svg
					aria-hidden="true"
					focusable="false"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 384 512"
				>
					<path
						fill="currentColor"
						d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"
					/>
				</svg>
			</a>
			<a
				href={`tel:+${$milk.site.phone}`}
				on:click|preventDefault={() => {
					if (window?.callingCard?.show) {
						window?.callingCard?.show();
					}
				}}
				title="Phone"
				rel="noreferrer"
				class="call"
			>
				<svg
					aria-hidden="true"
					focusable="false"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
				>
					<path
						fill="currentColor"
						d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"
					/>
				</svg>
			</a>
			<a
				href="/immigration-law-blog"
				on:click|preventDefault={() => {
					if (window?.searchCard?.show) {
						window?.searchCard?.show();
					}
				}}
				title="search"
				rel="noreferrer"
				class="search"
			>
				<svg
					aria-hidden="true"
					focusable="false"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
				>
					<path
						fill="currentColor"
						d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
					/>
				</svg>
			</a>
			<Hamburger size="24px" padding="6px" />
		</div>
		<nav>
			<ul>
				<li>
					<a
						href="/immigration-attorneys"
						class:current={checkCurrent('/immigration-attorneys')}
					>
						<span>Attorneys</span>
					</a>
				</li>
				<li>
					<a
						href="/immigration-law-services"
						class:current={checkCurrent(
							'/immigration-law-services'
						)}
					>
						<span>Services</span>
					</a>
				</li>
				<li>
					<a
						href="/client-testimonials"
						class:current={checkCurrent('/client-testimonials')}
					>
						<span>Testimonials</span>
					</a>
				</li>
				<li>
					<a
						href="/immigration-law-blog"
						class:current={checkIfBlog('/immigration-law-blog')}
						class="blog-nav"
					>
						<span>Blog</span>
					</a>
				</li>
				<li>
					<a href="/espanol" class:current={checkCurrent('/espanol')}>
						<span>Español</span>
					</a>
				</li>
				<li>
					<a
						href="/immigration-resources"
						class:current={checkCurrent('/immigration-resources')}
					>
						<span>Resources</span>
					</a>
				</li>
			</ul>
		</nav>
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount } from 'svelte';
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	import { getAbsoluteUrl } from '$milk/util/helpers.js';
	/* ## Components ## */
	import Hamburger from '$milk/lib/Hamburger.svelte';
	/* ## Vairables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'navigation';
	$: blockclass = `navigation ${blockstyle}`;
	let espanol_url = `Shttps://translate.google.com/translate?sl=auto&tl=es&u=${$milk?.site?.url}`;
	let checkCurrent = (url) => {
		return false;
	};
	let checkIfBlog = (url) => {
		return false;
	};
	onMount(async () => {
		checkCurrent = (url) => {
			if (
				getAbsoluteUrl(url) ==
				window.location.href.replace(location.hash, '')
			) {
				return true;
			} else {
				return false;
			}
		};
		checkIfBlog = (url) => {
			if (window.location.href.startsWith(getAbsoluteUrl(url))) {
				return true;
			} else {
				return false;
			}
		};
		espanol_url = `https://translate.google.com/translate?sl=auto&tl=es&u=${getAbsoluteUrl(
			'/'
		)}`;
	});
	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.navigation {
		padding-bottom: 10px;
		min-height: 42px;
		z-index: 999;
	}
	.navigation-inner {
		margin: 0 auto;
		max-width: var(--content-constrain, 1200px);
		text-align: center;
		padding: 0 var(--padding);
	}
	.navigation-inner svg {
		max-width: 30px;
		max-height: 30px;
	}
	.navigation-inner a {
		color: var(--color-white);
	}
	.navigation-inner a:hover,
	.navigation-inner a:hover svg {
		color: var(--color-three);
	}
	.nav-extra {
		width: 40px;
		height: 30px;
		vertical-align: middle;
		line-height: 25px;
		float: right;
		margin-right: calc(var(--padding) + 10px);
		text-align: center;
	}
	.nav-extra svg {
		max-width: 20px;
		max-height: 20px;
	}
	.nav-extra .map,
	.nav-extra .call {
		display: none;
	}
	.nav-logo {
		display: none;
	}
	nav {
		display: block;
		position: relative;
		text-align: left;
		padding: 0 20px;
		width: calc(100% - 60px);
	}
	nav ul,
	nav li {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	nav > ul {
		display: flex;
		width: 100%;
	}
	nav > ul > li {
		flex: 1;
	}
	nav li a {
		display: block;
		padding: var(--padding-nav);
		text-transform: uppercase;
		font-size: var(--small-fontsize);
		transition: color var(--transition-speed);
	}
	nav li a:hover {
		text-decoration: none;
	}
	nav li::before {
		content: '';
		display: none;
	}
	nav > ul > li > a > span {
		display: inline-block;
		position: relative;
	}
	nav > ul > li > a > span::after {
		height: 2px;
		background-color: transparent;
		position: absolute;
		content: '';
		width: 0;
		margin: 0 50%;
		display: block;
		bottom: 0;
		left: 0;
		transition: margin 0.5s, width 0.5s, opacity 0.5s, color 0.5s,
			background-color 0.5s;
	}
	nav > ul > li:hover > a > span::after,
	nav > ul > li > a.current > span::after {
		margin: 0 -10%;
		width: 120%;
		opacity: 1;
		background-color: var(--color-one);
	}
	@media screen and (max-width: 700px) {
		.navigation-inner {
			width: 100%;
			padding-top: 10px;
			text-align: left;
		}
		.nav-logo {
			display: inline-block;
			vertical-align: middle;
			margin-top: -5px;
		}
		.nav-extra {
			width: auto;
			display: inline-block;
			float: right;
			vertical-align: top;
			margin-right: 0;
			margin-top: -10px;
		}
		.nav-extra .map,
		.nav-extra .call,
		.nav-extra .search {
			display: inline-block;
			vertical-align: middle;
			width: 30px;
			height: auto;
		}
		nav {
			display: grid;
			place-content: center;
			height: calc(100vh - 40px);
			width: 100vw !important;
			overflow: scroll;
			position: fixed;
			top: 40px;
			left: 0;
			text-align: center;
			background: var(--color-six);
			transition: all 1s;
		}
		nav:not(.open) {
			margin-left: 100vw !important;
			transition: all 0s;
		}
		nav:is(.open) {
			margin-left: 0vw !important;
			transition: all 1s;
		}
		nav > ul {
			display: block;
		}
		nav li a {
			font-size: var(--large-fontsize);
		}
	}
</style>
