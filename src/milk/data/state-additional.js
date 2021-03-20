/* #### CREDITS #### */
const credits = {
	name: 'Milk.js',
	title: 'Milk.js - It does a website good.',
	tagline: 'Best Developer Experience ❤ Best Finished Results',
	excerpt: 'Svelte-Kit + Vite + SSR + SWR + PWA + CS-CSS + PostCSS + Rollup + JSON-LD + Markdown + SVX + Microformats & Microdata + Serverless + Web Components + GraphQL + REST + Accessibility + Animations + SEO + So much more, all packed in a gooey JAMStack you can host anywhere with Zero Dependency Deploys.  We handle it all so you can focus on creating amazing things, we look forward to seeing what you make. Have some Milk.',
	details: "Have some Milk to go with that.  Milk sits lightly on top of the shoulders of GIANTS like: Svelte-kit, Vite. Rollup, PostCSS, GraphQL, WorkBox, Wordpress, and many more.  Providing the quickest, cleantest, fastest, way to launch perfect headless websites.  We worry about all the tricky stuff so that you can just make amazing things.  We can't wait to see them.",
	url: 'https://milkjs.com',
	email: 'info@milkjs.com',
	keywords: 'Made with MILK: Snowpack, Skypack, Svelte, PWA, WordPress, GraphQL, REST, JAMStack, SSR, SWR, Web Components, CS-CSS, by DevLove (https://devlove.us) & RandomUser (https://random-user.com)',
	logo_mini: '/milk/img/logo_milk.svg',
	logo: '/milk/img/logo_milkjs.svg',
	logo_width: '200',
	logo_height: '200',
	social: '/milk/img/socialmedia_1200x630.jpg',
	svelte_logo: '/milk/img/logo_svelte.svg',
	svelte_title: 'Svelte',
	svelte_url: 'https://svelte.dev/',
	graphql_logo: '/milk/img/logo_graphql.svg',
	graphql_title: 'GraphQL',
	graphql_url: 'https://graphql.org/',
	vite_logo: '/milk/img/logo_vite.svg',
	Vite_title: 'Vite',
	vite_url: 'https://vitejs.dev/',
	rollup_logo: '/milk/img/logo_rollup.svg',
	rollup_title: 'Rollup',
	rollup_url: 'https://postcss.org/',
	postcss_logo: '/milk/img/logo_postcss.svg',
	postcss_title: 'PostCSS',
	postcss_url: 'https://postcss.org/',
	markdown_logo: '/milk/img/logo_markdown.svg',
	markdown_title: 'Markdown',
	markdown_url: 'https://daringfireball.net/projects/markdown/syntax',
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