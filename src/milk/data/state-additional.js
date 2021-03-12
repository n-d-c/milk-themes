/* #### CREDITS #### */
const credits = {
	title: 'Milk.js - It does a website good.',
	tagline: 'SSR + SWR + PWA + SEO + Serverless + Web Components + Accessibility all in a gooey JAMStack you can host anywhere.',
	excerpt: "Have some Milk to go with that.  Milk sits lightly on top of the shoulders of GIANTS like: Svelte-kit, Snowpack, GraphQL, WorkBox, Wordpress, and many more.  Providing the quickest, cleantest, fastest, way to launch perfect headless websites.  We worry about all the tricky stuff so that you can just make amazing things.  We can't wait to see them.",
	url: 'https://milkjs.com',
	email: 'info@milkjs.com',
	keywords: 'Made with MILK: Snowpack, Skypack, Svelte, PWA, WordPress, GraphQL, REST, JAMStack, SSR, SWR, Web Components, CS-CSS, by DevLove (https://devlove.us) & RandomUser (https://random-user.com)',
	logo_mini: '/milk/img/logo_milk.svg',
	logo: '/milk/img/logo_milkjs.svg',
	svelte_logo: '/milk/img/logo_svelte.svg',
	svelte_title: 'Svelte',
	svelte_url: 'https://svelte.dev/',
	graphql_logo: '/milk/img/logo_graphql.svg',
	graphql_title: 'GraphQL',
	graphql_url: 'https://graphql.org/',
	snowpack_logo: '/milk/img/logo_snowpack.svg',
	snowpack_title: 'Snowpack',
	snowpack_url: 'https://www.snowpack.dev/',
	hello: 'Hello Milk!'
};
Object.freeze(credits);

/* #### ADDITIONAL STATE #### */
let browser = {
	online: false,
	darkmode: false
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

export { browser, user, credits };