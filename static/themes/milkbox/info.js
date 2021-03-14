import { config } from '$site_config/config.js';
/* #### THEME #### */
const theme = {
	name: 'MilkBox',
	slug: 'milkbox',
	version: '0.0.02',
	date: '2021-03-13',
	url: 'https://milkjs.com/themes/milkbox',
	author: 'Random-User (DevLove)',
	tagline: 'Example theme for Milk.js.',
	excerpt: 'Please feel free to take this theme and copy it to start your own if you desire.',
	darkmode: true
};
if (config?.lock_config) { Object.freeze(theme); };
export { theme };