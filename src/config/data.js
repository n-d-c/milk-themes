import { config } from '$site_config/config.js';
/* #### DATA SOURCES #### */
const sources = {
	// sources go here;
};
if (config?.lock_config) { Object.freeze(sources); };
export { sources };