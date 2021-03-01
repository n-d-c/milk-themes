export const Q_GET_POSTS = `query getPosts {
	posts {
		edges {
			node {
				id
				title
				slug
				postId
				uri
				link
				excerpt
				featuredImage {
					node {
						uri
						title
						srcSet
						link
						altText
						caption
					}
				}
			}
		}
	}
}`;