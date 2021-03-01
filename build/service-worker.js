/* eslint-disable no-console */
console.log(`🤖ServiceWorker: 🎉Loaded!`)

// eslint-disable-next-line
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
// eslint-disable-next-line
if (workbox) {
	console.log(`📦Workbox: 🎉Loaded!`)
} else {
	console.log(`📦Workbox: 🚫Workbox Didn't Load.`)
}

/* #### Workbox Debugging #### */
// eslint-disable-next-line
workbox.setConfig({
	debug: true,
})
console.log(`📦Workbox: 🐞Debugging Turned On.`)

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
console.log(`📦Workbox: (🛸Api) Caching Turned On Selectivly...`)

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
console.log(`📦Workbox: (🖼Image) Caching Turned On.`)

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
	console.log(`📦Workbox: (🔤WebFont) Caching Turned On.`)
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
console.log(`📦Workbox: (🕸GoogleFonts) Caching Turned On.`)

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
console.log(`📦Workbox: (⭐ Favicon) Caching Turned On.`)

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
console.log(`📦Workbox: (🎨stylesheet) Caching Turned On.`)
console.log(`📦Workbox: (🛠javascript) Caching Turned On.`)
console.log(`📦Workbox: (📝html) Caching Turned On.`)
console.log(`📦Workbox: (🔗json) Caching Turned On.`)

/* #### Main App #### */
// eslint-disable-next-line
workbox.routing.registerRoute(
	new RegExp('https://svelte.immigrationlawnj.com/'),
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
console.log(`📦Workbox: (🏆 Main App) Caching Turned On.`)