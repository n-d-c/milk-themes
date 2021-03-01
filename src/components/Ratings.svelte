<div class="our-ratings">
	<div class="bg-grey-pin-stripes" />
	<div class="ratings-inner">
		<h2>View Our Ratings</h2>
		<div class="blurb">
			<h3>Exceptional Service Has Earned Us Exceptional Recognition.</h3>
			<div class="block-content">
				<p>
					Our immigration law firm has earned the highest ratings in
					Best Lawyers in America, Super Lawyers, US News and World
					Report, Avvo, as well as Martindale-Hubbell.
				</p>
			</div>
		</div>
		<div class="listing-grid ratings-listing">
			{#each ratings as rating}
				<div class="rating">
					<a
						href={rating.link}
						title={`${rating.title} - ${rating.rating}`}
						target="_blank"
						rel="noopener"
					>
						<h4>{rating.title}</h4>
						<h5>{rating.rating}</h5>
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>

<script>
	let ratings = [
		{
			title: 'Avvo Rating',
			rating: '10.0 Superb',
			link:
				'http://www.avvo.com/attorneys/07102-nj-harlan-york-1473871.html',
		},
		{
			title: 'US News',
			rating: 'Best Law Firms',
			link:
				'http://bestlawfirms.usnews.com/firms/harlan-york-and-associates/overview/31749/',
		},
		{
			title: 'Best Lawyers',
			rating: 'Firm Profile',
			link:
				'http://www.bestlawyers.com/firms/harlan-york-and-associates/31749/US',
		},
		{
			title: 'Best Lawyers',
			rating: 'Lawyer of the Year',
			link:
				'http://www.bestlawyers.com/logos/showprofile.aspx?lawyer_id=37694',
		},
		{
			title: 'Super Lawyers',
			rating: 'Attorney Profile',
			link:
				'http://www.superlawyers.com/new-jersey/lawyer/Harlan-G-York/597208c4-5b6b-4c29-9c17-0442fe8a3e9f.html',
		},
		{
			title: 'Martindale Rating',
			rating: 'AV Preeminent',
			link: 'http://www.martindale.com/Harlan-G-York/1106229-lawyer.htm',
		},
	];
	export { ratings };
</script>

<style>
	.our-ratings {
		display: block;
		padding: 0 var(--padding-outer, 5vw) var(--padding-outer, 5vw);
		color: var(--color-black, #000);
		text-align: center;
		background: var(--background-white, #fff);
	}
	.ratings-inner {
		padding: 100px var(--padding-inner, 20px);
		margin: 0 auto;
		max-width: var(--content-width-max, 1020px);
		background: var(--background-offwhite, #f4f4f4);
	}
	h2,
	h3,
	p {
		color: var(--color-black, #000);
	}
	.bg-grey-pin-stripes {
		height: var(--padding-outer, 5vw);
		margin: 0 auto;
		width: 70%;
		border-radius: 0 0 0 var(--padding-outer, 5vw);
		background: none;
	}

	.rating {
		display: inline-block;
		vertical-align: middle;
		position: relative;
		border: 4px solid var(--color-yellow-vibrant, #f4ba38);
		width: 150px;
		height: 150px;
		margin: clamp(20px, 4vw, 40px);
		border-radius: 75px;
		background: var(--background-white, #fff);
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
		/* filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0)); */
	}
	.rating:hover {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
		/* filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		); */
	}
	.rating a {
		display: grid;
		place-content: center;
		height: calc(100% - 12px);
		width: calc(100% - 12px);
		border: 2px solid var(--color-yellow-vibrant, #f4ba38);
		border-radius: 75px;
		margin: 6px;
		text-decoration: none;
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
	}
	.rating:hover a {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
	}
	.rating a h4 {
		font-size: calc(var(--font-size-small, 15px) - 2px);
		text-transform: uppercase;
	}
	.rating a h5 {
		font-size: calc(var(--font-size-small, 15px) - 3px);
	}
</style>
