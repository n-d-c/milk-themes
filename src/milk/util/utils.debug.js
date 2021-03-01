/* #### Debugging #### */
export const setupDebugging = () => { 
	window.debugging = true;
	// eslint-disable-next-line
	window.debug = (debug_output) => { if (window.debugging) { console.log(debug_output); } }
	// eslint-disable-next-line
	window.debugError = (debug_output) => { if (window.debugging) { console.log(`%c ${debug_output}`, 'color: #900'); } }
}