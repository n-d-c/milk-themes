export const setupOnlineStatus = () => {
	/* #### Window Connection Status #### */

	window.connection = {}
	window.connection.online = false
	window.connection.status = () => { return (window.connection.online) ? 'online' : 'offline' }

	window.connection.getCheckServerUrl = () => {
		return window.connection.check_url || window.location.origin || 'http://google.com';
	}

	window.connection.canConnectTo = (url) => {
		return fetch(url, { method: 'HEAD', mode: 'no-cors' }).then(function(resp) {
			return resp && (resp.ok || resp.type === 'opaque');
		}).catch(function(err) {
			window.debug('💫Connection: 🚫Issue with Connection!')
			window.debug(err);
			return false
		});
	}

	window.connection.checkConnection = () => {
		const connection = window.connection;
		if (navigator.onLine) {
			connection.canConnectTo(connection.getCheckServerUrl()).then(function(online) {
				if (online) {
					window.connection.online = true
					window.debug('💫Connection: ✅Online')
					if (window.helpers.isFunction(window.welcome.dataReload)) {
						window.debug('🔃Reloader: ✅Found')
						window.welcome.dataReload()
					} else {
						window.debug('🔃Reloader: 🚫Not Found')
					}
					return true
				} else {
					window.connection.online = false
					window.debug('💫Connection: 🚫Offline')
					return false
				}
			});
		} else {
			window.debug('💫Connection: 🚫Offline')
			return false
		}
	}

	window.connection.connectionEventHandler = () => {
		window.connection.checkConnection()
	}

	window.addEventListener('online', window.connection.connectionEventHandler);
	window.addEventListener('offline', window.connection.connectionEventHandler);

}