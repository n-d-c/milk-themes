import { writable } from 'svelte/store';
//import { get as idbGet, set as idbSet } from 'idb-keyval';
// import { get as idbGet, set as idbSet } from 'idb-keyval';
import { get as idbGet, set as idbSet } from '$milk/data/idb-keyval.js';
// import pkg from 'idb-keyval';
// const idbGet = pkg.get;
// const idbSet = pkg.set;


/* ## Config ## */
const MILK_CFG = JSON.parse(decodeURI('_MILK_CFG')); // Magic Loading
const { config } = MILK_CFG;

/* #### CACHING #### */
/* ## Stale While Invalidates Caching ## */
const cache_swr = new Map();


/* #### GET #### */
export const get = (url, request_swr = config.cache_swr, request_cache = config.cache, expires = config.expires) => {
	const store = writable(new Promise(() => {}));
	const loadData = async () => {
		let cache_good = false;
		let request_hash = hash(url);
		if (config.cache_swr && request_swr) { if (cache_swr.has(request_hash)) { store.set(Promise.resolve(cache_swr.get(request_hash))); }; };
		if (config.cache) {
			const cached_data = await idbGet(request_hash);
			if (cached_data && cached_data.data && cached_data.timestamp) {
				let cached_for = parseInt(((new Date().getTime() - new Date(cached_data.timestamp).getTime())/1000));
				if (cached_for < config.expires) {
					cache_good = true;
					console.log('good cache');
					store.set(Promise.resolve(cached_data));
				} else {
					cache_good = false;
				};
			} else  {
				cache_good = false;
			};
		};
		if (!config.cache || !cache_good) {
			console.log('invalid cache');
			const response = await fetch(url);
			const data = await response.json();
			if (config.cache_swr) { cache_swr.set(request_hash, data); };
			if (config.cache) { idbSet(request_hash, { timestamp: new Date(), data: data }); };
			store.set(Promise.resolve(data));
		};
	};
	loadData();
	return store;
};

/* #### POST #### */
export const post = (url, variables = {}) => {
	console.log(url);
	console.log(variables);
	// TODO
	return url;
};

/* #### GRAPHQL #### */
// todo: add variables object parameter
// todo: add offline state
export const gql = (query, source, variables = {}, request_swr = config.cache_swr, request_cache = config.cache, expires = config.expires) => {
	const store = writable(new Promise(() => {}));
	const loadData = async () => {
		let cache_good = false;
		let request_hash = hash(`${query}${variables}`);
		if (request_swr && request_swr) { if (cache_swr.has(request_hash)) { store.set(Promise.resolve(cache_swr.get(request_hash))); }; };
		if (request_cache) {
			const cached_data = await idbGet(request_hash);
			if (cached_data && cached_data.data && cached_data.timestamp) {
				let cached_for = parseInt(((new Date().getTime() - new Date(cached_data.timestamp).getTime())/1000));
				if (cached_for < expires) {
					cache_good = true;
					console.log('good cache');
					store.set(Promise.resolve(cached_data.data));
				} else {
					cache_good = false;
				};
			} else  {
				cache_good = false;
			};
		};
		if (!request_cache || !cache_good) {
			console.log('invalid cache');
			const response = await fetch(source, {
				method: 'POST',
				referrerPolicy: 'no-referrer',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query: query,
					variables: variables,
				}),
			});
			const data = await response.json();
			console.log(data);
			if (request_swr) { cache_swr.set(request_hash, data.data); };
			if (request_cache) { idbSet(request_hash, { timestamp: new Date(), data: data.data }); };
			store.set(Promise.resolve(data.data));
		};
	};
	loadData();
	return store;
};

/* #### REST #### */
export const rest = (url, method = 'GET') => {
	console.log(url);
	// TODO
	return url;
};

/* #### UTILITY #### */
export const hash = (str = '') => { let hash = 0; for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }; return Math.abs(hash); };
// TODO: cleanup long expired data peridioically, also a cleanup all data function.