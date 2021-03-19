const sveltePreprocess = require('svelte-preprocess');
/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	preprocess: [
		sveltePreprocess({
			babel: {
				presets: [
					[
					"@babel/preset-env",
					{
						loose: true,
						// No need for babel to resolve modules
						modules: false,
						targets: {
						// ! Very important. Target es6+
						esmodules: true,
						},
					},
					],
				],
			},
			defaults: {
				style: 'postcss'
			},
			postcss: true
		}),
	],
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		// adapter: '@sveltejs/adapter-node',
		adapter: '@sveltejs/adapter-static',

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#milk'
	}
};
