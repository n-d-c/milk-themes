function registerServiceWorkers() {
	//if ('serviceWorker' in navigator && 'https:' === location.protocol && !location.host.match(/(localhost|127.0.0.1|scanner.local)/)) {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/service-worker.js')
		})
	}
}
(function () {
	registerServiceWorkers()
})();