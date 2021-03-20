// Consult https://vitejs.dev/config/ to learn about these options
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import { cwd } from 'process';
import Hjson from 'hjson';
import replace from '@rollup/plugin-replace';
import graphql from '@rollup/plugin-graphql';

const pkg = JSON.parse(readFileSync(join(cwd(), 'package.json')));
const cfg = Hjson.parse(String(readFileSync(join(cwd(), './src/config/config.hjson'))));

/** @type {import('vite').UserConfig} */
export default {
	plugins: [
		replace({
			_MILK_CWD: cwd(),
			_MILK_URL: `${cfg?.site?.url}`,
			_MILK_CFG: encodeURI(String(JSON.stringify(cfg)))
		}),
		graphql()
	],
	resolve: {
		alias: {
			$milk: resolve('src/milk'),
			$theme: resolve(`static/themes/${cfg?.config?.theme}`),
			$lib: resolve('src/lib'),
			$static: resolve('static')
		}
	},
	ssr: {
		noExternal: Object.keys(pkg.dependencies || {})
	}
};
