
var debugging = true;
/* eslint-disable no-console */
var debug = function() { if (debugging) { console.log.apply(this, arguments); }; };

/* eslint-disable no-console */
debug(`🤖MILK ServiceWorker: 🎉Loaded!`)

// eslint-disable-next-line
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
// eslint-disable-next-line
if (workbox) { debug(`📦MILK Workbox: 🎉Loaded!`) } else { debug(`📦MILK Workbox: 🚫Workbox Didn't Load.`) }

/* #### Workbox Debugging #### */
// eslint-disable-next-line
workbox.setConfig({
	debug: debugging,
})
debug(`📦MILK Workbox: 🐞Debugging Turned On.`)

/* #### Enable Precaching And Routing #### */
// eslint-disable-next-line
workbox.precaching.precacheAndRoute([]);

/* #### Api #### */
// eslint-disable-next-line
workbox.routing.registerRoute(
	new RegExp('https://admin.immigrationlawnj.com'),
	// eslint-disable-next-line
	new workbox.strategies.NetworkFirst({
		cacheName: 'api',
	}),
)
debug(`📦MILK Workbox: (🛸Api) Caching Turned On Selectivly...`)

/* #### Images #### */
// eslint-disable-next-line
workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|svg|ico|webp|avif|heic|bmp|tiff)$/,
	// eslint-disable-next-line
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'images',
		plugins: [
			// eslint-disable-next-line
			new workbox.expiration.Plugin({
				maxEntries: 512,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			}),
		],
	}),
)
debug(`📦MILK Workbox: (🖼Image) Caching Turned On.`)

/* #### Webfonts #### */
if (!(/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor))) {
	// eslint-disable-next-line
	workbox.routing.registerRoute(
		/\.(?:ttf|woff|woff2|eot|otf)$/,
		// eslint-disable-next-line
		new workbox.strategies.StaleWhileRevalidate({
			cacheName: 'fonts',
			plugins: [
				// eslint-disable-next-line
				new workbox.expiration.Plugin({
					maxEntries: 30,
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
				}),
			],
		}),
	)
	debug(`📦MILK Workbox: (🔤WebFont) Caching Turned On.`)
};

/* #### Google Fonts #### */
// eslint-disable-next-line
workbox.routing.registerRoute(
	new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
	// eslint-disable-next-line
	new workbox.strategies.CacheFirst({
		cacheName: 'googleapis',
		plugins: [
			// eslint-disable-next-line
			new workbox.expiration.Plugin({
				maxEntries: 30,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			}),
		],
	}),
)
debug(`📦MILK Workbox: (🕸GoogleFonts) Caching Turned On.`)

/* #### Favicon #### */
// eslint-disable-next-line
workbox.routing.registerRoute(
	new RegExp('https://svelte.immigrationlawnj.com/favicon.ico'),
	// eslint-disable-next-line
	new workbox.strategies.CacheFirst({
		cacheName: 'favicon',
		plugins: [
			// eslint-disable-next-line
			new workbox.expiration.Plugin({
				maxEntries: 30,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			}),
		],
	}),
)
debug(`📦MILK Workbox: (⭐ Favicon) Caching Turned On.`)

/* #### WebApp #### */
// eslint-disable-next-line
workbox.routing.registerRoute(
	/\.(?:js|css|html|htm|json|map)$/,
	// eslint-disable-next-line
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'webapp',
		plugins: [
			// eslint-disable-next-line
			new workbox.expiration.Plugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			}),
		],
	}),
)
debug(`📦MILK Workbox: (🎨stylesheet) Caching Turned On.`)
debug(`📦MILK Workbox: (🛠javascript) Caching Turned On.`)
debug(`📦MILK Workbox: (📝html) Caching Turned On.`)
debug(`📦MILK Workbox: (🔗json) Caching Turned On.`)

/* #### Main App #### */
// eslint-disable-next-line
workbox.routing.registerRoute(
	new RegExp('https://milkjs.com/'),
	// eslint-disable-next-line
	new workbox.strategies.CacheFirst({
		cacheName: 'mainapp',
		plugins: [
			// eslint-disable-next-line
			new workbox.expiration.Plugin({
				maxEntries: 30,
				//maxAgeSeconds: 1 * 24 * 60 * 60, // 1 Days
			}),
		],
	}),
)
workbox.routing.registerRoute(
	new RegExp('/'),
	// eslint-disable-next-line
	new workbox.strategies.CacheFirst({
		cacheName: 'mainapp-noroute',
		plugins: [
			// eslint-disable-next-line
			new workbox.expiration.Plugin({
				maxEntries: 30,
				//maxAgeSeconds: 1 * 24 * 60 * 60, // 1 Days
			}),
		],
	}),
)
debug(`📦MILK Workbox: (🏆 Main App) Caching Turned On.`)
debug(`🤖MILK ServiceWorker: Workbox Caching Success 🎉!`)