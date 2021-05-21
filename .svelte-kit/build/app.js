import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\" xmlns:og=\"http://opengraphprotocol.org/schema/\" xmlns:fb=\"http://www.facebook.com/2008/fbml\">\n\n<head>" + head + "</head>\n\n<body>\n\t<div id=\"milk\">" + body + "</div>\n</body>\n\n</html>";

let options = null;

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: "/./_app/start-00108e30.js",
			css: ["/./_app/assets/start-b97461fb.css"],
			js: ["/./_app/start-00108e30.js","/./_app/chunks/vendor-b2fe4cce.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => "/./_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: error => {
			console.error(error.stack);
			error.stack = options.get_stack(error);
		},
		hooks: get_hooks(user_hooks),
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		read: settings.read,
		root,
		router: true,
		ssr: true,
		target: "#milk",
		template,
		trailing_slash: "never"
	};
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [{"file":".htaccess","size":7117,"type":null},{"file":"documentation/code_analysis.html","size":106050,"type":"text/html"},{"file":"favicon.ico","size":1150,"type":"image/vnd.microsoft.icon"},{"file":"ico/apple-touch-icon-114x114.png","size":2144,"type":"image/png"},{"file":"ico/apple-touch-icon-120x120.png","size":2223,"type":"image/png"},{"file":"ico/apple-touch-icon-144x144.png","size":2666,"type":"image/png"},{"file":"ico/apple-touch-icon-152x152.png","size":2825,"type":"image/png"},{"file":"ico/apple-touch-icon-57x57.png","size":1221,"type":"image/png"},{"file":"ico/apple-touch-icon-60x60.png","size":1286,"type":"image/png"},{"file":"ico/apple-touch-icon-72x72.png","size":1498,"type":"image/png"},{"file":"ico/apple-touch-icon-76x76.png","size":1616,"type":"image/png"},{"file":"ico/favicon-1024x1024.png","size":16982,"type":"image/png"},{"file":"ico/favicon-128x128.png","size":2070,"type":"image/png"},{"file":"ico/favicon-16x16.png","size":135,"type":"image/png"},{"file":"ico/favicon-256x256.png","size":3738,"type":"image/png"},{"file":"ico/favicon-32x32.png","size":718,"type":"image/png"},{"file":"ico/favicon-512x512.png","size":7498,"type":"image/png"},{"file":"ico/favicon-64x64.png","size":1209,"type":"image/png"},{"file":"ico/favicon-96x96.png","size":1689,"type":"image/png"},{"file":"ico/favicon.ico","size":1150,"type":"image/vnd.microsoft.icon"},{"file":"ico/favicon.png","size":135,"type":"image/png"},{"file":"ico/favicon.svg","size":10432,"type":"image/svg+xml"},{"file":"ico/mstile-144x144.png","size":6100,"type":"image/png"},{"file":"ico/mstile-150x150.png","size":6250,"type":"image/png"},{"file":"ico/mstile-310x150.png","size":7165,"type":"image/png"},{"file":"ico/mstile-310x310.png","size":12350,"type":"image/png"},{"file":"ico/mstile-70x70.png","size":3375,"type":"image/png"},{"file":"ico/splash-1024x1024.png","size":34493,"type":"image/png"},{"file":"img/icon-browser.svg","size":908,"type":"image/svg+xml"},{"file":"img/icon-cancel.svg","size":645,"type":"image/svg+xml"},{"file":"img/icon-close.svg","size":645,"type":"image/svg+xml"},{"file":"img/icon-contactcard.svg","size":857,"type":"image/svg+xml"},{"file":"img/icon-email.svg","size":672,"type":"image/svg+xml"},{"file":"img/icon-invoice.svg","size":1008,"type":"image/svg+xml"},{"file":"img/icon-pen.svg","size":857,"type":"image/svg+xml"},{"file":"img/icon-phone-yellow.svg","size":552,"type":"image/svg+xml"},{"file":"img/icon-phone.svg","size":502,"type":"image/svg+xml"},{"file":"img/icon-rating-star.svg","size":526,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-airbnb.svg","size":1001,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-blog.svg","size":847,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-calendar.svg","size":1099,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-etsy.svg","size":810,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-facebook.svg","size":412,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-google_business.svg","size":479,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-google_maps.svg","size":893,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-instagram.svg","size":1160,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-linkedin.svg","size":542,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-pinterest.svg","size":737,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-rss.svg","size":869,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-snapchat.svg","size":1650,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-tiktok.svg","size":451,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-twitter.svg","size":1025,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-vcard.svg","size":857,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-vimeo.svg","size":615,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-yelp.svg","size":985,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-youtube-alt.svg","size":339,"type":"image/svg+xml"},{"file":"img/icon-socialmedia-youtube.svg","size":704,"type":"image/svg+xml"},{"file":"img/icon-triangle-up.svg","size":396,"type":"image/svg+xml"},{"file":"img/logo.svg","size":7198,"type":"image/svg+xml"},{"file":"img/profile_1200x1200.avif","size":7480,"type":"image/avif"},{"file":"img/profile_1200x1200.jpg","size":25917,"type":"image/jpeg"},{"file":"img/profile_1200x1200.webp","size":15258,"type":"image/webp"},{"file":"img/socialmedia_1200x630.jpg","size":12642,"type":"image/jpeg"},{"file":"img/user_nophoto.svg","size":603,"type":"image/svg+xml"},{"file":"manifest.json","size":2723,"type":"application/json"},{"file":"milk/README.md","size":75,"type":"text/markdown"},{"file":"milk/do_not_delete.txt","size":75,"type":"text/plain"},{"file":"milk/img/icon-browser.svg","size":908,"type":"image/svg+xml"},{"file":"milk/img/imagetest_200x200_avif.avif","size":1054,"type":"image/avif"},{"file":"milk/img/imagetest_200x200_gif.gif","size":1922,"type":"image/gif"},{"file":"milk/img/imagetest_200x200_jpg.jpg","size":32387,"type":"image/jpeg"},{"file":"milk/img/imagetest_200x200_mozjpg.jpg","size":8838,"type":"image/jpeg"},{"file":"milk/img/imagetest_200x200_png24.png","size":1617,"type":"image/png"},{"file":"milk/img/imagetest_200x200_png8.png","size":1276,"type":"image/png"},{"file":"milk/img/imagetest_200x200_svg.svg","size":3216,"type":"image/svg+xml"},{"file":"milk/img/imagetest_200x200_webp.webp","size":838,"type":"image/webp"},{"file":"milk/img/logo_browser.svg","size":4376,"type":"image/svg+xml"},{"file":"milk/img/logo_devlove.svg","size":670,"type":"image/svg+xml"},{"file":"milk/img/logo_graphql.svg","size":1357,"type":"image/svg+xml"},{"file":"milk/img/logo_markdown.svg","size":521,"type":"image/svg+xml"},{"file":"milk/img/logo_milk.svg","size":5852,"type":"image/svg+xml"},{"file":"milk/img/logo_milkjs.svg","size":7031,"type":"image/svg+xml"},{"file":"milk/img/logo_postcss.svg","size":17556,"type":"image/svg+xml"},{"file":"milk/img/logo_rollup.svg","size":3470,"type":"image/svg+xml"},{"file":"milk/img/logo_snowpack.svg","size":279,"type":"image/svg+xml"},{"file":"milk/img/logo_svelte.svg","size":1158,"type":"image/svg+xml"},{"file":"milk/img/logo_vite.svg","size":1114,"type":"image/svg+xml"},{"file":"milk/img/onload_then_do_map.gif","size":43,"type":"image/gif"},{"file":"milk/img/onload_then_do_video.gif","size":43,"type":"image/gif"},{"file":"milk/img/x.gif","size":43,"type":"image/gif"},{"file":"milk/index.html","size":163,"type":"text/html"},{"file":"register-service-workers.js","size":365,"type":"application/javascript"},{"file":"robots.txt","size":67,"type":"text/plain"},{"file":"service-worker.js","size":4551,"type":"application/javascript"},{"file":"themes/blank/Documentation.svelte.md","size":769,"type":"text/markdown"},{"file":"themes/blank/Layout_Blank.svelte","size":198,"type":null},{"file":"themes/blank/Layout_Main.svelte","size":690,"type":null},{"file":"themes/blank/info.js","size":372,"type":"application/javascript"},{"file":"themes/blank/logo_theme.svg","size":7576,"type":"image/svg+xml"},{"file":"themes/blank/style.css","size":3454,"type":"text/css"},{"file":"themes/milkbox/Documentation.svelte.md","size":769,"type":"text/markdown"},{"file":"themes/milkbox/Layout_Blank.svelte","size":198,"type":null},{"file":"themes/milkbox/Layout_Main.svelte","size":690,"type":null},{"file":"themes/milkbox/info.js","size":378,"type":"application/javascript"},{"file":"themes/milkbox/logo_theme.svg","size":16376,"type":"image/svg+xml"},{"file":"themes/milkbox/prismjs.css","size":6484,"type":"text/css"},{"file":"themes/milkbox/style.css","size":11006,"type":"text/css"}],
	layout: "src/routes/__layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/documentation\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/documentation/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/documentation\/browser\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/documentation/browser.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/documentation\/theme\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/documentation/theme.svelte.md"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/documentation\/milk\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/documentation/milk.svelte.md"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/test\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/test.svelte.md"],
						b: [".svelte-kit/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, render }) => render(request))
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("../../src/routes/__layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components/error.svelte"),"src/routes/index.svelte": () => import("../../src/routes/index.svelte"),"src/routes/documentation/index.svelte": () => import("../../src/routes/documentation/index.svelte"),"src/routes/documentation/browser.svelte": () => import("../../src/routes/documentation/browser.svelte"),"src/routes/documentation/theme.svelte.md": () => import("../../src/routes/documentation/theme.svelte.md"),"src/routes/documentation/milk.svelte.md": () => import("../../src/routes/documentation/milk.svelte.md"),"src/routes/test.svelte.md": () => import("../../src/routes/test.svelte.md")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"/./_app/pages/__layout.svelte-8cabc534.js","css":["/./_app/assets/pages/__layout.svelte-37914fe6.css"],"js":["/./_app/pages/__layout.svelte-8cabc534.js","/./_app/chunks/vendor-b2fe4cce.js","/./_app/chunks/milk-76ffb0bc.js"],"styles":null},".svelte-kit/build/components/error.svelte":{"entry":"/./_app/error.svelte-5a53862f.js","css":[],"js":["/./_app/error.svelte-5a53862f.js","/./_app/chunks/vendor-b2fe4cce.js"],"styles":null},"src/routes/index.svelte":{"entry":"/./_app/pages/index.svelte-2bc145a7.js","css":["/./_app/assets/Layout_Main-d10c9e9b.css","/./_app/assets/Hero-a78ecdf8.css"],"js":["/./_app/pages/index.svelte-2bc145a7.js","/./_app/chunks/vendor-b2fe4cce.js","/./_app/chunks/milk-76ffb0bc.js","/./_app/chunks/Head_HTML-915ec569.js","/./_app/chunks/Head_Facebook-0d4948d1.js","/./_app/chunks/Layout_Main-2981c7bb.js","/./_app/chunks/Hero-e8f6dac3.js"],"styles":null},"src/routes/documentation/index.svelte":{"entry":"/./_app/pages/documentation/index.svelte-c9a5cc31.js","css":["/./_app/assets/Layout_Main-d10c9e9b.css","/./_app/assets/Hero-a78ecdf8.css"],"js":["/./_app/pages/documentation/index.svelte-c9a5cc31.js","/./_app/chunks/vendor-b2fe4cce.js","/./_app/chunks/milk-76ffb0bc.js","/./_app/chunks/Head_HTML-915ec569.js","/./_app/chunks/Head_Facebook-0d4948d1.js","/./_app/chunks/Layout_Main-2981c7bb.js","/./_app/chunks/Hero-e8f6dac3.js"],"styles":null},"src/routes/documentation/browser.svelte":{"entry":"/./_app/pages/documentation/browser.svelte-d59927e8.js","css":["/./_app/assets/pages/documentation/browser.svelte-8b2a6155.css","/./_app/assets/Documentation-988102da.css","/./_app/assets/Hero-a78ecdf8.css"],"js":["/./_app/pages/documentation/browser.svelte-d59927e8.js","/./_app/chunks/vendor-b2fe4cce.js","/./_app/chunks/Head_HTML-915ec569.js","/./_app/chunks/milk-76ffb0bc.js","/./_app/chunks/Documentation-3921c7a8.js","/./_app/chunks/Hero-e8f6dac3.js"],"styles":null},"src/routes/documentation/theme.svelte.md":{"entry":"/./_app/pages/documentation/theme.svelte.md-e520b99b.js","css":["/./_app/assets/pages/documentation/theme.svelte.md-0b60224d.css","/./_app/assets/Documentation-988102da.css","/./_app/assets/Hero-a78ecdf8.css"],"js":["/./_app/pages/documentation/theme.svelte.md-e520b99b.js","/./_app/chunks/vendor-b2fe4cce.js","/./_app/chunks/milk-76ffb0bc.js","/./_app/chunks/Documentation-3921c7a8.js","/./_app/chunks/Hero-e8f6dac3.js"],"styles":null},"src/routes/documentation/milk.svelte.md":{"entry":"/./_app/pages/documentation/milk.svelte.md-0c95d5cb.js","css":["/./_app/assets/Documentation-988102da.css","/./_app/assets/Hero-a78ecdf8.css"],"js":["/./_app/pages/documentation/milk.svelte.md-0c95d5cb.js","/./_app/chunks/vendor-b2fe4cce.js","/./_app/chunks/milk-76ffb0bc.js","/./_app/chunks/Documentation-3921c7a8.js","/./_app/chunks/Hero-e8f6dac3.js"],"styles":null},"src/routes/test.svelte.md":{"entry":"/./_app/pages/test.svelte.md-e0729785.js","css":["/./_app/assets/Layout_Main-d10c9e9b.css"],"js":["/./_app/pages/test.svelte.md-e0729785.js","/./_app/chunks/vendor-b2fe4cce.js","/./_app/chunks/Layout_Main-2981c7bb.js","/./_app/chunks/milk-76ffb0bc.js"],"styles":null}};

async function load_component(file) {
	return {
		module: await module_lookup[file](),
		...metadata_lookup[file]
	};
}

init({ paths: {"base":"","assets":"/."} });

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}