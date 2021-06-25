/* ## Config ## */
const MILK_CFG = JSON.parse(decodeURI('_MILK_CFG')); // Magic Loading
const { config } = MILK_CFG;

/* ## Queries ## */

const PAGINATION = `pageInfo {
	offsetPagination {
		hasMore
		hasPrevious
		total
	}
}`;

const SCRIPTS = `enqueuedScripts(first: 999) {
	nodes {
		id
		args
		extra
		handle
		src
		version
	}
}`;

const STYLESHEETS = `enqueuedStylesheets(first: 999) {
	nodes {
		id
		args
		extra
		handle
		src
		version
	}
}`;

const POST_TAGS = `tags {
	nodes {
		count
		id
		link
		name
		slug
		tagId
		taxonomy {
			node {
				description
				id
				label
				name
			}
		}
	}
}`;

const POST_CATEGORIES = `categories {
	nodes {
		count
		id
		link
		name
		slug
		categoryId
		taxonomy {
			node {
				description
				id
				label
				name
			}
		}
	}
}`;

const POST_FEATURED_IMAGE = `featuredImage {
	node {
		title(format: RENDERED)
		srcSet
		sourceUrl
		altText
		caption
	}
}`;

const POST_AUTHOR = `author {
	node {
		avatar {
			url
		}
		email
		description
		firstName
		lastName
		name
		nicename
		nickname
	}
}`;

const POST_SCRIPTS = `enqueuedScripts(first: 999) {
	nodes {
		id
		args
		extra
		handle
		src
		version
	}
}`;


const POST_CSS = `enqueuedStylesheets(first: 999) {
	nodes {
		id
		src
		version
		extra
		handle
		args
	}
}`;

const POST_LISTING = `id
title(format: RENDERED)
slug
postId
uri
link
excerpt(format: RENDERED)
${POST_FEATURED_IMAGE}
date
modified
${POST_AUTHOR}`;

const POST_CONTENT = `id
title(format: RENDERED)
slug
postId
uri
link
excerpt(format: RENDERED)
${POST_FEATURED_IMAGE}
content(format: RENDERED)
date
modified
${POST_AUTHOR}
${POST_CATEGORIES}
${POST_TAGS}
${POST_SCRIPTS}
${POST_CSS}`;

export const Q_LIST_ALL_POSTS = `query getPosts {
	posts(where: {offsetPagination: {offset: 0, size: 9999}}) {
		${PAGINATION},
		nodes {
			${POST_LISTING}
		}
	}
}`;

export const Q_GET_ALL_POSTS = `query getPosts {
	posts(where: {offsetPagination: {offset: 0, size: 9999}}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;

export const Q_LIST_POSTS = `query getPosts($offset: Int = 0, $size: Int = ${config.pagination_size}, $search: String = "") {
	posts(where: {search: $search, offsetPagination: {offset: $offset, size: $size}}) {
		${PAGINATION},
		nodes {
			${POST_LISTING}
		}
	}
}`;

export const Q_GET_POSTS = `query getPosts($offset: Int = 0, $size: Int = ${config.pagination_size}, $search: String = "") {
	posts(where: {search: $search, offsetPagination: {offset: $offset, size: $size}}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;

export const Q_LIST_POSTS_BYCAT = `query getPosts($category: String = "Uncategorized", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, categoryName: $category}) {
		${PAGINATION},
		nodes {
			${POST_LISTING}
		}
	}
}`;

export const Q_GET_POSTS_BYCAT = `query getPosts($category: String = "Uncategorized", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, categoryName: $category}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;

export const Q_GET_POSTS_BYCATID = `query getPosts($category: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, categoryId: $category}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;

export const Q_GET_POSTS_BYTAG = `query getPosts($tag: String = "test", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, tag: $tag}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;

export const Q_GET_POSTS_BYTAGID = `query getPosts($tag: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, tagId: $tag}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;

export const Q_GET_POSTS_BYAUTHORID = `query getPosts($author: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, author: $author}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;

export const Q_GET_POST_BYID = `query getPost($id: Int = 1) {
	postBy(postId: $id) {
		${POST_CONTENT}
	}
}`;

export const Q_GET_POST_BYSLUG = `query getPost($slug: String = "hello-world") {
	postBy(slug: $slug) {
		${POST_CONTENT}
	}
}`;

export const Q_GET_POST_HELLOWORLD = `query MyQuery {
	posts(first: 1) {
		nodes {
			title
		}
	}
}`;

export const Q_GET_POST_CATEGORIES = `query getPostCategories($size: Int = ${config.pagination_size}) {
	categories(first: $size) {
		nodes {
			count
			id
			link
			name
			slug
			categoryId
			taxonomy {
				node {
					description
					id
					label
					name
				}
			}
		}
	}
}`;

export const Q_GET_POST_TAGS = `query getPostTags($size: Int = ${config.pagination_size}) {
	tags(first: $size) {
		nodes {
			count
			id
			link
			name
			slug
			tagId
			taxonomy {
				node {
					description
					id
					label
					name
				}
			}
		}
	}
}`;

const PAGE_TAGS = `tags {
	nodes {
		count
		id
		link
		name
		slug
		tagId
		taxonomy {
			node {
				description
				id
				label
				name
			}
		}
	}
}`;

const PAGE_CATEGORIES = `categories {
	nodes {
		count
		id
		link
		name
		slug
		categoryId
		taxonomy {
			node {
				description
				id
				label
				name
			}
		}
	}
}`;

const PAGE_LISTING = `id
title(format: RENDERED)
slug
pageId
uri
link
excerpt(format: RENDERED)
featuredImage {
	node {
		uri
		title(format: RENDERED)
		srcSet
		link
		altText
		caption
	}
}
date
modified
author {
	node {
		avatar {
			url
		}
		email
		description
		firstName
		lastName
		name
		nicename
		nickname
	}
}`;

const PAGE_CONTENT = `id
title(format: RENDERED)
slug
pageId
uri
link
excerpt(format: RENDERED)
featuredImage {
	node {
		uri
		title(format: RENDERED)
		srcSet
		link
		altText
		caption
	}
}
content(format: RENDERED)
date
modified
author {
	node {
		avatar {
			url
		}
		email
		description
		firstName
		lastName
		name
		nicename
		nickname
	}
}
${PAGE_CATEGORIES}
${PAGE_TAGS}`;

export const Q_LIST_ALL_PAGES = `query getPages {
	pages(where: {offsetPagination: {offset: 0, size: 9999}}) {
		${PAGINATION},
		nodes {
			${PAGE_LISTING}
		}
	}
}`;

export const Q_GET_ALL_PAGES = `query getPages {
	pages(where: {offsetPagination: {offset: 0, size: 9999}}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;

export const Q_LIST_PAGES = `query getPages($offset: Int = 0, $size: Int = ${config.pagination_size}, $search: String = "") {
	pages(where: {search: $search, offsetPagination: {offset: $offset, size: $size}}) {
		${PAGINATION},
		nodes {
			${PAGE_LISTING}
		}
	}
}`;

export const Q_GET_PAGES = `query getPages($offset: Int = 0, $size: Int = ${config.pagination_size}, $search: String = "") {
	pages(where: {search: $search, offsetPagination: {offset: $offset, size: $size}}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;

export const Q_LIST_PAGES_BYCAT = `query getPages($category: String = "Uncategorized", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, categoryName: $category}) {
		${PAGINATION},
		nodes {
			${PAGE_LISTING}
		}
	}
}`;

export const Q_GET_PAGES_BYCAT = `query getPages($category: String = "Uncategorized", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, categoryName: $category}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;

export const Q_GET_PAGES_BYCATID = `query getPages($category: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, categoryId: $category}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;

export const Q_GET_PAGES_BYTAG = `query getPages($tag: String = "test", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, tag: $tag}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;

export const Q_GET_PAGES_BYTAGID = `query getPages($tag: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, tagId: $tag}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;

export const Q_GET_PAGES_BYAUTHORID = `query getPages($author: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, author: $author}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;

export const Q_GET_PAGE_BYID = `query getPages($id: Int = 1) {
	pageBy(pageId: $id) {
		${PAGE_CONTENT}
	}
}`;

export const Q_GET_PAGE_BYSLUG = `query getPages($slug: String = "hello-world") {
	pageBy(slug: $slug) {
		${PAGE_CONTENT}
	}
}`;

const MENU_ITEM = `id
label
order
url
title
target
path
cssClasses`;

export const Q_GET_MENU_BYLOCATION = `query getMenu($location: String = "MENU_MAIN") {
	menuItems(where: {location: $location) {
		nodes {
			${MENU_ITEM}
			childItems {
				nodes {
					${MENU_ITEM}
					childItems {
						nodes {
							${MENU_ITEM}
							childItems {
								nodes {
									${MENU_ITEM}
								}
							}
						}
					}
				}
			}
		}
	}
}`;

