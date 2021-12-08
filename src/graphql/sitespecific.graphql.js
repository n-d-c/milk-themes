/* ## Config ## */
const MILK_CFG = JSON.parse(decodeURI('_MILK_CFG')); // Magic Loading
const { config } = MILK_CFG;

/* ## Queries ## */

export const Q_GET_SERVICES = `query getServices($size: Int = ${config.pagination_size}) {
	services(first: $size) {
		nodes {
			slug
			title(format: RENDERED)
			Services {
				icon {
					sourceUrl
				}
				excerpt
				description
			}
		}
	}
}`;


export const Q_GET_SERVICE = `query getService($id: ID!){
	service(id:$id, idType: SLUG) {
	  id
	  slug
	  title
	  serviceId
	  content
	  date
	  Services {
		description
		excerpt
		serviceFaq {
      	  faqTitle
      	  faqContent
      	}
		relatedPosts {
		  ... on Post {
			id
			title
			slug
			featuredImage {
          	  node {
          	    sourceUrl
          	  }
          	}
		  }
		}
	  }
	  enqueuedScripts {
		nodes {
		  src
		}
	  }
	  enqueuedStylesheets {
		nodes {
		  src
		}
	  }
	  featuredImage {
		node {
		  sourceUrl
		}
	  }
	}
  }`


export const Q_GET_SERVICE_RELATED = `query getServiceRelated($id: ID!){
	service(idType: SLUG, id: $id) {
	  Services {
		relatedPosts {
		  ... on Post {
			id
			title
			slug
			featuredImage {
          	  node {
          	    sourceUrl
          	  }
          	}
		  }
		}
	  }
	}
  }`


export const Q_GET_FEATURED = `query getFeatured($size: Int = ${config.pagination_size}) {
	featuredOns(first: $size) {
		nodes {
			slug
			title(format: RENDERED)
			FeaturedOn {
				avifImage {
					sourceUrl
				}
				pngImage {
					sourceUrl
				}
				webpImage {
					sourceUrl
				}
				link
			}
		}
	}
}`;

export const Q_GET_RATINGS = `query getRatings($size: Int = ${config.pagination_size}) {
	ratings(first: $size) {
		nodes {
			Ratings {
				link
				rating
			}
			slug
			title
		}
	}
}`;

export const Q_GET_TESTIMONIALS = `query getTestimonials($size: Int = ${config.pagination_size}) {
	testimonials(first: $size) {
		nodes {
			Testimonial {
				avifImage {
					sourceUrl
				}
				jpgImage {
					sourceUrl
				}
				webpImage {
					sourceUrl
				}
				rating
				testimonial
				relationship
			}
			slug
			title
		}
	}
}`;

export const Q_GET_FAQS = `query getFAQs($size: Int = ${config.pagination_size}) {
	fAQs(first: $size) {
		nodes {
			slug
			title
			FAQ {
				answer
			}
		}
	}
}`;

export const Q_GET_TEAM = `query getTeam($size: Int = ${config.pagination_size}) {
	attorneys(first: $size) {
		nodes {
			title
			slug
			Attorney {
				additionalDescription
				email
				avifImage {
					sourceUrl
				}
				shortDescription
				jpegImage {
					sourceUrl
				}
				webpImage {
					sourceUrl
				}
			}
		}
	}
}`;

export const Q_GET_EBOOKBYID = `query getEBook($id: ID) {
	eBookBy(id: $id) {
		slug
		title(format: RENDERED)
		date
		eBook {
			avifImage {
				sourceUrl
			}
			jpegImage {
				sourceUrl
			}
			pdf {
				mediaItemUrl
			}
			webpImage {
				sourceUrl
			}
			shortDescription
		}
	}
}`;

export const Q_GET_EBOOKS = `query getEBooks($size: Int = ${config.pagination_size}) {
	eBooks(first: $size) {
		nodes {
			slug
			title(format: RENDERED)
			date
			eBook {
				avifImage {
					sourceUrl
				}
				jpegImage {
					sourceUrl
				}
				pdf {
					mediaItemUrl
				}
				webpImage {
					sourceUrl
				}
				shortDescription
			}
		}
	}
}`;

export const Q_GET_VIDEOBYSLUG = `query getVideo($slug: String) {
	videoBy(slug: $slug) {
		slug
		title(format: RENDERED)
		date
		Video {
			avifImage {
				sourceUrl
			}
			jpegImage {
				sourceUrl
			}
			webpImage {
				sourceUrl
			}
			video
		}
	}
}`;

export const Q_GET_VIDEOS = `query getVideos($size: Int = ${config.pagination_size}) {
	videos(first: $size) {
		nodes {
			slug
			title(format: RENDERED)
			date
			Video {
				avifImage {
					sourceUrl
				}
				jpegImage {
					sourceUrl
				}
				webpImage {
					sourceUrl
				}
				video
			}
		}
	}
}`;