const sveltePreprocess = require('svelte-preprocess');
const path = require('path');
const fs = require('fs');
const process = require('process');
const hjson = require('hjson');
const replace = require('@rollup/plugin-replace');
const graphql = require('@rollup/plugin-graphql');
const { mdsvex } = require("mdsvex");
const mdsvexConfig = require("./mdsvex.config.cjs");
const visualizer = require('rollup-plugin-visualizer');

// const pkg = JSON.parse(fs.readFileSync(join(process.cwd(), 'package.json')));
const pkg = require('./package.json');
const cfg = hjson.parse(String(fs.readFileSync(path.join(process.cwd(), './src/config/config.hjson'))));

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	extensions: [".svelte", ...mdsvexConfig.extensions],
	preprocess: [
		mdsvex(mdsvexConfig),
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
		target: '#milk',
		vite: {
			plugins: [
				replace({
					_MILK_CWD: process.cwd(),
					_MILK_URL: `${cfg?.site?.url}`,
					_MILK_CFG: encodeURI(String(JSON.stringify(cfg)))
				}),
				graphql(),
				visualizer({
					filename: path.resolve('static/documentation/code_analysis.html'),
					template: 'sunburst'
				})
			],
			resolve: {
				alias: {
					$milk: path.resolve('src/milk'),
					$theme: path.resolve(`static/themes/${cfg?.config?.theme}`),
					$lib: path.resolve('src/lib'),
					$static: path.resolve('static')
				}
			},
			ssr: {
				noExternal: Object.keys(pkg.dependencies || {})
			}
		}
	}
};
