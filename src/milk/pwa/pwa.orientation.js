export const lockOrientation = () => {
	/* #### Web App Screen Orientation #### */
	screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
	if (window.helpers.isFunction(screen.lockOrientationUniversal) && screen.lockOrientationUniversal("landscape-primary")) {
		// eslint-disable-next-line
		console.log(`🔄Orientation: 🔒Locked.`);
	} else {
		// eslint-disable-next-line
		console.log(`🔄Orientation: 🔓Unlocked.`);
	};
}
