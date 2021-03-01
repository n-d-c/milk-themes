export const setupCrossDomainTransport = () => {
	/* #### Cross Domain Data Transfer Utility #### */
	window.cddt = {}
	/* ## Cross Domain Data Receivership ## */
	window.cddt.receiveCrossDomainData = () => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('crossDomainReceiver')) {
			window.cddt.data = urlParams.get('crossDomainReceiver').unPackageCrossDomain().decode().encode();
			window.cddt.received = (window.cddt.data != '');
		} else { window.cddt.data = '' }
	}
	/* ## Cross Domain Data Handler ## */
	window.cddt.receiveData = () => {
		window.cddt.receiveCrossDomainData()
		if (window.cddt.received) {
			window.debug('🚕CrossDomain: 🎉Cross Domain Data Loaded!');
			localStorage.setItem('user', window.cddt.data);
			window.location = '/'
		}
	}
}