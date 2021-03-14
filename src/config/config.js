/* #### CONFIGURATION #### */
const config = {
	debug: true,
	lock_config: true, // Lock the configuration objects in production runtime otherwise dynamically reactive by default.
	cache_swr: true, // Stale Until Invalidates on Refresh
	cache: true, // Hard Caching Data on Client Side
	expires: 300, // Default Data Caching in Seconds Client Side before re-request
	pwa: true, // Is PWA
	lang: 'en', // Base Language 'en' by default
	darkmode: 'user', // Initial dark mode: user (os/brower prefs), dark, light (on reload last state set by user is remembered)
	credit: {
		milk: true,
		svelte: true,
		graphql: true,
		snowpack: true
	}
};
if (config?.lock_config) { Object.freeze(config); };
export { config };