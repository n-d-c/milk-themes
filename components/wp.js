import { writable } from 'svelte/store';
import { get as idbGet, set as idbSet } from 'idb-keyval';

/* #### CONFIGURATION #### */
let config = {
	graphql: 'https://admin.immigrationlawnj.com/index.php?graphql',
	rest: 'https://admin.immigrationlawnj.com/wp-json/wp/v2',
	cache_swr: true, // Stale Until Invalidates on Refresh
	cache: true, // Hard Caching Data on Client Side
	expires: 300,
	pwa: true,
	lang: 'en'
};
let site = {
	domain: 'svelte.immigrationlawnj.com',
	url: 'https://svelte.immigrationlawnj.com',
	photo: '/img/profile_1200x1200.jpg',
	photo_avif: '/img/profile_1200x1200.avif',
	photo_webp: '/img/profile_1200x1200.webp',
	logo: '/img/logo.svg',
	logo_width: '186',
	logo_height: '26',
	title: 'Harlan York and Associates',
	tagline: 'Immigration Attorneys',
	organization: 'Harlan York and Associates',
	first_name: 'Harlan',
	last_name: 'York',
	middle_name: '',
	prefix_name: '',
	suffix_name: '',
	nick_name: '',
	email_address: 'info@immigrationlawnj.com',
	phone: '1.973.642.1111',
	fax: '1.973.642.0022',
	address: '60 Park Pl',
	address2: 'Suite 1010',
	city: 'Newark',
	state: 'New Jersey',
	state_abbr: 'NJ',
	zip: '07102',
	country: 'United States',
	country_abbr: 'US',
	hours_of_operation: '9:00am – 5:00pm / Monday – Friday',
	hours_of_operation_dt: 'Mo,Tu,We,Th,Fr 09:00-17:00',
	price_range: '$$',
	category: 'Immigration Law',
	description: 'Harlan York and Associates are the best immigration lawyers for Green Cards, Deportation, Family Immigration, and Naturalization in New York, New Jersey, and surrounding areas.',
	keywords: 'Immigration Law, USA Immigration, Lawer, Attourney, Greencard, Visa',
	established: '',
	latitude: '40.7385726',
	longitude: '-74.1690402',
	google_maps: 'https://bit.ly/3aPm8HF',
	google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1511.533014259071!2d-74.1690402!3d40.7385726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25381b9bdf0fb%3A0x7681dbe37e1094d1!2sHarlan%20York%20%26%20Associates!5e0!3m2!1sen!2sca!4v1613362597071!5m2!1sen!2sca',
	google_maps_image: '/img/google_maps_1350x922.jpg',
	google_maps_image_webp: '/img/google_maps_1350x922.webp',
	google_maps_image_avif: '/img/google_maps_1350x922.avif',
	google_business: '',
	facebook: 'http://www.facebook.com/ImmigrationLawNJ',
	facebook_photo: 'https://svelte.immigrationlawnj.com/img/socialmedia_1200x630.jpg',
	facebook_type: 'website',
	twitter: 'http://twitter.com/hyorklaw',
	twitter_photo: 'https://svelte.immigrationlawnj.com/img/socialmedia_1200x630.jpg',
	instagram: '',
	linkedin: 'http://www.linkedin.com/in/harlanyork',
	youtube: 'http://www.youtube.com/user/HYORKLAW',
	vimeo: '',
	rss: 'https://immigrationlawnj.com/feed',
	blog: '',
	etsy: '',
	yelp: '',
	airbnb: '',
	tiktok: '',
	snapchat: '',
	pinterest: '',
	vcf_file: '/harlan_york.vcf',
	calendar: 'https://calendly.com/immigrationlawnj/30min-consultation/'
};
let pwa = {
	/* ## Make Sure to Updte manifest.json to match. ## */
	app_color: '#800E16',
	app_background: '#800E16',
	app_name: 'Harlan York and Associates – Immigration Attorneys'
}
/* #### ADDITIONAL STATE #### */
let browser = {
	online: false
};
let user = {
	loggedin: false,
	userid: '',
	username: '',
	firstname: '',
	lastname: '',
	email: '',
	phone: '',
	fax: ''
};

/* #### CACHING #### */
/* ## Stale While Invalidates Caching ## */
const cache_swr = new Map();

/* #### GET #### */
const get = (url, request_swr = config.cache_swr, request_cache = config.cache, expires = config.expires) => {
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
const post = (url, variables = {}) => {
	console.log(url);
	console.log(variables);
	// TODO
	return url;
};

/* #### GRAPHQL #### */
// todo: add variables object parameter
// todo: add offline state
const gql = (query, request_swr = config.cache_swr, request_cache = config.cache, expires = config.expires) => {
	const store = writable(new Promise(() => {}));
	const loadData = async () => {
		let cache_good = false;
		let request_hash = hash(query);
		if (config.cache_swr && request_swr) { if (cache_swr.has(request_hash)) { store.set(Promise.resolve(cache_swr.get(request_hash))); }; };
		if (config.cache) {
			const cached_data = await idbGet(request_hash);
			if (cached_data && cached_data.data && cached_data.timestamp) {
				let cached_for = parseInt(((new Date().getTime() - new Date(cached_data.timestamp).getTime())/1000));
				if (cached_for < config.expires) {
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
		if (!config.cache || !cache_good) {
			console.log('invalid cache');
			const response = await fetch(config.graphql, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query: query,
				}),
			});
			const data = await response.json();
			if (config.cache_swr) { cache_swr.set(request_hash, data.data); };
			if (config.cache) { idbSet(request_hash, { timestamp: new Date(), data: data.data }); };
			store.set(Promise.resolve(data.data));
		};
	};
	loadData();
	return store;
};

/* #### REST #### */
const rest = (url, method = 'GET') => {
	console.log(url);
	// TODO
	return url;
};

/* #### UTILITY #### */
const hash = (str = '') => { let hash = 0; for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }; return Math.abs(hash); };
// TODO: cleanup long expired data peridioically, also a cleanup all data function.

/* #### STATE OBJECT #### */
export const wp = writable({
	config: config,
	browser: browser,
	site: site,
	pwa: pwa,
	user: user,
	data: {
		get: get,
		post: post,
		rest: rest,
		gql: gql
	}
});