const theme = require('./src/config/theme.cjs');
// Consult https://www.snowpack.dev to learn about these options
module.exports = {
	extends: '@sveltejs/snowpack-config',
	plugins: [
		[
			'@snowpack/plugin-build-script',
			{
				cmd: "postcss",
				input: [".css", ".pcss"],
				output: [".css"],
			}
		],
		[
			"@snowpack/plugin-svelte",
			{
				compilerOptions: {
					hydratable: true
				}
			}
		]
	],
	mount: {
		'src/milk': '/_milk',
		'src/milk/pwa': '/_milk/pwa',
		'src/milk/data': '/_milk/data',
		'src/milk/api': '/_milk/api',
		'src/milk/graphql': '/_milk/graphql',
		'src/milk/util': '/_milk/util',
		'src/milk/components': '/_milk/components',
		'src/themes': `/_themes/${theme.theme}`,
		'src/api': '/_api',
		'src/graphql': '/_graphql',
		'src/config': '/_config'
	},
	alias: {
		$milk: './src/milk',
		$milk_pwa: './src/milk/pwa',
		$milk_data: './src/milk/data',
		$milk_api: './src/milk/api',
		$milk_graphql: './src/milk/graphql',
		$milk_util: './src/milk/util',
		$milk_components: './src/milk/components',
		$site_theme: `./src/themes/${theme.theme}`,
		$site_api: './src/api',
		$site_graphql: './src/graphql',
		$site_config: './src/config'
	}
};
