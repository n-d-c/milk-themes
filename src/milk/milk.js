/* #### MILK #### */


import { writable } from 'svelte/store';
import { theme } from '../config/theme.js';
import { config } from '../config/config.js';
import { site } from '../config/site.js';
import { pwa } from '../config/pwa.js';
import { sources } from '../config/data.js';
import { get, gql, post, rest } from  './data/data-adaptors.js';

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

/* #### STATE OBJECT #### */
export const milk = writable({
	version: '0.0.01',
	hello: 'Hello Milk!',
	credits: {
		title: 'Milk',
		tagline: 'It does a website good.',
		url: 'https://milkjs.com',
		email: 'info@milkjs.com',
		keywords: 'Made with MILK: Snowpack, Skypack, Svelte, PWA, WordPress, GraphQL, REST, JAMStack, SSR, SWR, Web Components by DevLove (https://devlove.us) & RandomUser (https://random-user.com)',
		logo: '/milk/img/logo_milk.svg',
		svelte_logo: '/milk/img/logo_svelte.svg',
		svelte_title: 'Svelte',
		svelte_url: 'https://svelte.dev/',
		graphql_logo: '/milk/img/logo_graphql.svg',
		graphql_title: 'GraphQL',
		graphql_url: 'https://graphql.org/',
		snowpack_logo: '/milk/img/logo_snowpack.svg',
		snowpack_title: 'Snowpack',
		snowpack_url: 'https://www.snowpack.dev/'
	},
	theme: theme,
	config: config,
	site: site,
	pwa: pwa,
	browser: browser,
	user: user,
	data: {
		sources: sources,
		get: get,
		post: post,
		rest: rest,
		gql: gql
	}
});
