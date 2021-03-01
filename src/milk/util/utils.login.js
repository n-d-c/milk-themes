// /* #### Login #### */
// import { setClient, getClient, query, mutate } from 'svelte-apollo';
// // import { connection as connection_grc } from '../graphql/connection_grc.js';
// // import { Q_USER_LOGIN } from '../graphql/grc_users.graphql';

// export const login = (app, creds) => {
// 	setClient(app.connection);
// 	const client = getClient();
// 	const doLogin = query(client, { query: app.query, variables: creds });
// 	doLogin.result().then((result) => { 
// 		window.debug('login');
// 	}).catch((error) => { window.debug(error); });
// 	window.debug(app);
// }


// // export const setupLoginFor = (loginAppSrc) => {
// // 	window.debugging = true;
// // 	// eslint-disable-next-line
// // 	window.debug = (debug_output) => { if (window.debugging) { console.log(debug_output); } }
// // }


// // window.addEventListener('storage', this.syncLogout);

// // syncLogout (event) {
// //   if (event.key === 'logout') {
// //     console.log('logged out from storage!')
// //     Router.push('/login')
// //   }
// // }

// let syncLogout = (event) => {
// 	if (event.key === 'logout') {
// 	  console.log('logged out!');
// 	  console.log(event);
// 	}
//   }

//   let event = new Event('storage');
//   event.key = 'logout';
//   window.dispatchEvent(event)

//   window.localStorage.setItem('logout', Date.now())

export const doLogoutEvent = (appKey) => {
	localStorage.setItem(`${appKey}_login`, Date.now());
	localStorage.setItem(`${appKey}_logout`, Date.now());
	localStorage.setItem(`${appKey}_expires`, Date.now());
	localStorage.removeItem(`${appKey}_token`, Date.now());
	let event = new Event('storage');
	event.key = `${appKey}_logout`;
	window.dispatchEvent(event);
	window.debug(`🔐 Logout Successful For App: ${appKey}`);
}

export const checkExpired = (appKey) => {
	let currentTime = new Date();
	let expireTime = new Date(localStorage.getItem(`${appKey}_expires`));
	if (expireTime < currentTime) { doLogout(); } else { 
		// check and do refresh token if needed
	}
}


export const listenLogoutEventAndDo = (appKey, callback) => {
	window.addEventListener('storage', (event) => { if (event.key === `${appKey}_logout`) { console.log('worked'); callback(); };});
}

export const listenLogoutEvent = (event) => {
	if (event.key === 'logout') {
	  console.log('logged out!');
	  console.log(event);
	}
  }

// function checkExp() {
// 	let currentTime = new Date();
// 	let expireTime = new Date(localStorage.getItem('grc_exp'));
// 	if (expireTime < currentTime) { doLogout(); encToken = 'expired login'; } else { encToken = `valid login: ${expireTime} | ${currentTime}`; }
// 	let grc_exp = new Date(); grc_exp.setMinutes(grc_exp.getMinutes() + 15);
// 	localStorage.setItem('grc_exp', grc_exp);
// }