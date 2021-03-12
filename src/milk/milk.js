/* #### MILK #### */
import { writable } from 'svelte/store';
import { config } from '$site_config/config.js';
import { site } from '$site_config/site.js';
import { pwa } from '$site_config/pwa.js';
import { sources } from '$site_config/data.js';
import { get, gql, post, rest } from '$milk_data/data-adaptors.js';
import { browser, user, credits } from '$milk_data/state-additional.js'
import { theme } from '$site_theme/info.js';
import { setupDebug, debug } from '$milk_util/debug.js'

const MILK_VERSION = '0.0.02';

if (config?.debug) { setupDebug(config?.debug); };
debug(`%c🥛MILK: Pouring you a glass of Milk.js v${MILK_VERSION}...`, 'font-weight: bold;')

/* #### STATE OBJECT #### */
export const milk = writable({
	version: MILK_VERSION,
	hello: config?.hello,
	credits,
	config,
	theme,
	site,
	pwa,
	browser,
	user,
	data: {
		sources,
		get,
		post,
		rest,
		gql
	}
});

debug('%c    🥛 Milk.js     ', "font-size: 8rem;background: linear-gradient(320deg, #3A0D2E 0%, #60154C 50%, #B32A51 100%); text-shadow: 0.5rem 0.5rem 0.25rem rgba(0,0,0,0.4); line-height: 30rem; vertical-align: top; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';");
debug(`%c🥛MILK: %cPoured Milk.js v${MILK_VERSION}, Enjoy!.`, 'font-weight: bold;', 'font-weight: normal;')
debug(`%c🪅MILKTHEME: %c${theme?.name} / ${theme?.slug} v${theme?.version}.`, 'font-weight: bold;', 'font-weight: normal;');