const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/documentation/index.svelte"),
	() => import("../../../src/routes/documentation/browser.svelte"),
	() => import("../../../src/routes/documentation/theme.svelte.md"),
	() => import("../../../src/routes/documentation/milk.svelte.md"),
	() => import("../../../src/routes/test.svelte.md")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/documentation/index.svelte
	[/^\/documentation\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/documentation/browser.svelte
	[/^\/documentation\/browser\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/documentation/theme.svelte.md
	[/^\/documentation\/theme\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/documentation/milk.svelte.md
	[/^\/documentation\/milk\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/test.svelte.md
	[/^\/test\/?$/, [c[0], c[7]], [c[1]]]
];

export const fallback = [c[0](), c[1]()];