/* #### Debugging #### */

// eslint-disable-next-line
if (typeof window == "undefined") { var window = {}; };

// eslint-disable-next-line
export const debug = function() { if (window?.debugging) { console.log.apply(this, arguments); }; };

// eslint-disable-next-line
export const alwaysDebug = function() { console.log.apply(this, arguments); };

export const setupDebug = (enabled = true) => {

	// eslint-disable-next-line
	window.debugging = enabled;

	// eslint-disable-next-line
	window.debug = debug;

};
