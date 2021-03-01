export const forceWindowSize = (width, height) => {
	/* #### Web App Window Size #### */
	if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
		window.addEventListener('resize', () => {
			window.resizeTo(width, height);
			console.log(`💢Resize: 🔒App Size Locked to ${width} ⨉ ${height}.`);
		});
	};
	window.resizeTo(width, height);
}

export const forceWindowWidth = (width) => {
	/* #### Web App Window Size #### */
	if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
		window.addEventListener('resize', () => {
			window.resizeTo(width, window.innerHeight);
			console.log(`💢Resize: 🔒App Size Locked to Width ${width}.`);
		});
	};
}

export const forceWindowHeight = (height) => {
	/* #### Web App Window Size #### */
	if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
		window.addEventListener('resize', () => {
			window.resizeTo(window.innerWidth, height);
			console.log(`💢Resize: 🔒App Size Locked to Height ${height}.`);
		});
	};
}