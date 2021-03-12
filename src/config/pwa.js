import { config } from '$site_config/config.js';
/* #### PWA (Progressive Web App) #### */
const pwa = {
	/* ## Make Sure to Updte manifest.json to match. ## */
	app_color: '#3A0D2E',
	app_background: '#3A0D2E',
	app_name: 'DevLove - Milk'
};
if (config?.lock_config) { Object.freeze(pwa); };
export { pwa };