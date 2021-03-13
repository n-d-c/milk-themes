import { config } from '$site_config/config.js';
/* #### THEME #### */
const theme = {
	name: 'Blank',
	slug: 'blank',
	version: '0.0.01',
	url: 'https://milkjs.com/themes/blank',
	author: 'Random-User (DevLove)',
	tagline: 'Example theme for Milk.js.',
	excerpt: 'Please feel free to take this theme and copy it to start your own if you desire.',
	darkmode: true
};
if (config?.lock_config) { Object.freeze(theme); };
export { theme };