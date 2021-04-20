module.exports = {
	extensions: [".svelte.md", ".svx", ".md"],
	smartypants: {
		dashes: "oldschool",
	},
	remarkPlugins: [
		[require("remark-github"), {
			// Use your own repository
			repository: "https://github.com/svelte-add/mdsvex.git",
		}],
		require("remark-abbr"),
	],
	rehypePlugins: [
		require("rehype-slug"),
		[require("rehype-autolink-headings"), {
			behavior: "wrap",
		}],
	],
	layout: {
		default: "./src/milk/lib/Layout_MDDefault.svelte",
		themedoc: "./src/milk/lib/Layout_MDThemeDocumentation.svelte",
		milkdoc: "./src/milk/lib/Layout_MDMilkDocumentation.svelte",
		blank: "./src/milk/lib/Layout_MDBlank.svelte",
		_: "./src/milk/lib/Layout_MDDefault.svelte"
	}
};
