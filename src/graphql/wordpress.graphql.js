const POST_TAGS = `tags {
	edges {
		node {
			contentNodes {
				edges {
					node {
					id
					}
				}
			}
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

const POST_CATEGORIES = `categories {
	edges {
		node {
			contentNodes {
				edges {
					node {
					id
					}
				}
			}
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

const POST_LISTING = `id
title(format: RENDERED)
slug
postId
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

const POST_CONTENT = `id
title(format: RENDERED)
slug
postId
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
${POST_CATEGORIES}
${POST_TAGS}`;

export const Q_LIST_ALL_POSTS = `query getPosts {
	posts {
		edges {
			node {
				cursor
				${POST_LISTING}
			}
		}
	}
}`;

export const Q_GET_ALL_POSTS = `query getPosts {
	posts {
		edges {
			node {
				cursor
				${POST_CONTENT}
			}
		}
	}
}`;

export const Q_LIST_POSTS_BYCAT = `query getPosts($category: String = "Uncategorized") {
	posts(where: {categoryName: $category}) {
		edges {
			node {
				cursor
				${POST_LISTING}
			}
		}
	}
}`;

export const Q_GET_POSTS_BYCAT = `query getPosts($category: String = "Uncategorized") {
	posts(where: {categoryName: $category}) {
		edges {
			node {
				cursor
				${POST_CONTENT}
			}
		}
	}
}`;

export const Q_GET_POSTS_BYCATID = `query getPosts($category: Int = 1) {
	posts(where: {categoryId: $category}) {
		edges {
			node {
				cursor
				${POST_CONTENT}
			}
		}
	}
}`;

export const Q_GET_POSTS_BYTAG = `query getPosts($tag: String = "test") {
	posts(where: {tag: $tag}) {
		edges {
			node {
				cursor
				${POST_CONTENT}
			}
		}
	}
}`;

export const Q_GET_POSTS_BYTAGID = `query getPosts($tag: Int = 1) {
	posts(where: {tagId: $tag}) {
		edges {
			node {
				cursor
				${POST_CONTENT}
			}
		}
	}
}`;

export const Q_GET_POSTS_BYAUTHORID = `query getPosts($author: Int = 1) {
	posts(where: {author: $author}) {
		edges {
			node {
				cursor
				${POST_CONTENT}
			}
		}
	}
}`;

export const Q_GET_POST_BYID = `query getPosts($id: Int = 1) {
	postBy(postId: $id) {
		edges {
			node {
				${POST_CONTENT}
			}
		}
	}
}`;

export const Q_GET_POST_BYSLUG = `query getPosts($slug: String = "hello-world") {
	postBy(slug: $slug) {
		edges {
			node {
				${POST_CONTENT}
			}
		}
	}
}`;

const PAGE_TAGS = `tags {
	edges {
		node {
			contentNodes {
				edges {
					node {
					id
					}
				}
			}
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

const PAGE_CATEGORIES = `categories {
	edges {
		node {
			contentNodes {
				edges {
					node {
					id
					}
				}
			}
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
	pages {
		edges {
			node {
				cursor
				${PAGE_LISTING}
			}
		}
	}
}`;

export const Q_GET_ALL_PAGES = `query getPages {
	pages {
		edges {
			node {
				cursor
				${PAGE_CONTENT}
			}
		}
	}
}`;

export const Q_LIST_PAGES_BYCAT = `query getPages($category: String = "Uncategorized") {
	pages(where: {categoryName: $category}) {
		edges {
			node {
				cursor
				${PAGE_LISTING}
			}
		}
	}
}`;

export const Q_GET_PAGES_BYCAT = `query getPages($category: String = "Uncategorized") {
	pages(where: {categoryName: $category}) {
		edges {
			node {
				cursor
				${PAGE_CONTENT}
			}
		}
	}
}`;

export const Q_GET_PAGES_BYCATID = `query getPages($category: Int = 1) {
	pages(where: {categoryId: $category}) {
		edges {
			node {
				cursor
				${PAGE_CONTENT}
			}
		}
	}
}`;

export const Q_GET_PAGES_BYTAG = `query getPages($tag: String = "test") {
	pages(where: {tag: $tag}) {
		edges {
			node {
				cursor
				${PAGE_CONTENT}
			}
		}
	}
}`;

export const Q_GET_PAGES_BYTAGID = `query getPages($tag: Int = 1) {
	pages(where: {tagId: $tag}) {
		edges {
			node {
				cursor
				${PAGE_CONTENT}
			}
		}
	}
}`;

export const Q_GET_PAGES_BYAUTHORID = `query getPages($author: Int = 1) {
	pages(where: {author: $author}) {
		edges {
			node {
				cursor
				${PAGE_CONTENT}
			}
		}
	}
}`;

export const Q_GET_PAGE_BYID = `query getPages($id: Int = 1) {
	pageBy(pageId: $id) {
		edges {
			node {
				${PAGE_CONTENT}
			}
		}
	}
}`;

export const Q_GET_PAGE_BYSLUG = `query getPages($slug: String = "hello-world") {
	pageBy(slug: $slug) {
		edges {
			node {
				${PAGE_CONTENT}
			}
		}
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
		edges {
			node {
				${MENU_ITEM}
				childItems {
					edges {
						node {
							${MENU_ITEM}
							childItems {
								edges {
									node {
										${MENU_ITEM}
										childItems {
											edges {
												node {
													${MENU_ITEM}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}`;