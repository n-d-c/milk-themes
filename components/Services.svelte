<div class="services">
	<div class="services-inner">
		<h2>Immigration Law Is All We Do</h2>
		<div class="blurb">
			<h3>
				When Your Freedom Is On The Line Why Hire Lawyers Who Only
				Dabble In Immigration?
			</h3>
			<div class="block-content">
				<p>
					Harlan York & Associates is one of the most successful firms
					in the country.
				</p>
				<p>
					Using our extensive experience on thousands of immigration
					cases and daily reviews of new developments in the
					constantly changing field of immigration law we offer you
					the best legal counsel available. Best Lawyers, the most
					respected publication in the legal profession.
				</p>
				<p>
					Harlan York & Associates are the best immigration lawyers
					for Green Cards, Deportation, Family Immigration, and
					Naturalization in New York, New Jersey, and area. Harlan
					York is the first attorney in the state of New Jersey to be
					named Immigration Lawyer of the Year by Best Lawyers, the
					most respected publication in the legal profession.
				</p>
			</div>
		</div>
		<div class="listing-grid services-listing">
			{#each services as service}
				<div class="service">
					<a
						href={service?.link}
						title={service?.title}
						target="_blank"
						rel="noopener"
					>
						<div>
							<img
								class="icon"
								src={service?.icon}
								alt={service?.title}
								width="40"
								height="40"
							/>
						</div>
						<h4>{service?.title}</h4>
						<p>{service?.description}</p>
					</a>
				</div>
			{/each}
		</div>
		<div>
			<button>View All Services</button>
		</div>
	</div>
</div>

<script>
	let services = [
		{
			title: 'Marriage and Family Based Immigration',
			description:
				'Whether your husband or wife is outside the United States or already stateside, we are here to help.',
			icon: '/img/icon-rating-star.svg',
			link: '/',
		},
		{
			title: 'Appellate Litigation',
			description:
				'Harlan York and Associates regularly files and wins appeals in federal courts throughout the US on a host of immigration issues.',
			icon: '/img/icon-rating-star.svg',
			link: '/',
		},
		{
			title: 'Citizenship',
			description:
				'Our firm successfully represents applicants for naturalization and derivative citizenship.',
			icon: '/img/icon-rating-star.svg',
			link: '/',
		},
		{
			title: 'Deportation and Criminal Defense',
			description:
				'It is your Constitutionally guaranteed Sixth Amendment right to have your criminal counsel work with us on ensuring the best way to avoid deportation at all times.',
			icon: '/img/icon-rating-star.svg',
			link: '/',
		},
		{
			title: 'Business Immigration',
			description:
				'We give daily guidance to companies with immigrant employees in areas ranging from restaurants to construction to agriculture, to academic institutions and research labs.',
			icon: '/img/icon-rating-star.svg',
			link: '/',
		},
		{
			title: 'Employment Immigration and Work Visas',
			description:
				'We offer creative solutions for many entities seeking visas in categories such as H-1B, L-1, O-1, TN, E-1, E-2, J-1, and many other nonimmigrant work visas.',
			icon: '/img/icon-rating-star.svg',
			link: '/',
		},
	];
</script>

<style>
	.services {
		display: block;
		padding: var(--padding-outer, 5vw);
		color: var(--color-black, #000);
		text-align: center;
		background: var(--background-white, #fff);
	}
	.services-inner {
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
	h3 {
		color: var(--color-red-deep, #620b13);
	}
	.service {
		display: inline-block;
		vertical-align: top;
		position: relative;
		/* border: 4px solid var(--color-yellow-vibrant, #f4ba38); */
		width: 275px;
		max-width: 80%;
		height: auto;
		margin: clamp(10px, 4vw, 30px);
		/* border-radius: 75px; */
		/* background: var(--background-white, #fff); */
		transition: all 0.3s ease;
		transform-origin: center;
		-webkit-transform: scale(1);
		-ms-transform: scale(1);
		transform: scale(1);
		/* filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0)); */
		padding: 20px 15px;
		border: 3px solid transparent;
		border-radius: 45px;
	}
	.service:hover {
		-webkit-transform: scale(1.1);
		-ms-transform: scale(1.1);
		transform: scale(1.1);
		background: rgba(0, 0, 0, 0.05);
		/* filter: drop-shadow(
			var(--drop-shadow-hover, 2px 2px 1px rgba(0, 0, 0, 0.4))
		);
		border: 3px solid #000; */
		/* background: var(--background-offwhite, #f4f4f4) !important; */
	}
	.service h4 {
		font-weight: normal;
		text-transform: uppercase;
		margin-bottom: 10px;
	}
	.service p {
		font-size: calc(var(--font-size-small, 15px) - 1px);
	}
	.service a {
		text-decoration: none;
	}
	.icon {
		width: 40px;
		height: auto;
		margin-bottom: 10px;
	}
	@media screen and (max-width: 850px) {
		.services-inner {
			padding: var(--padding-outer, 2vw) 10px;
		}
		.service {
			margin: clamp(10px, 4vw, 30px) 5px;
			width: 265px;
		}
	}
	@media screen and (max-width: 500px) {
		.services {
			padding: var(--padding-outer, 5vw) 20px;
		}
		.services-inner {
			padding: var(--padding-outer, 5vw) 10px;
		}
		.service {
			width: 250px;
			margin-left: -15px;
			margin-right: -15px;
			max-width: 100%;
		}
		.service h4 {
			font-size: calc(var(--font-size-h4, 22px) - 3px);
		}
	}
	@media screen and (max-width: 350px) {
		.services {
			padding: var(--padding-outer, 5vw) 15px;
		}
		.services-inner {
			padding: var(--padding-outer, 5vw) 0px;
		}
		.service {
			width: 220px;
		}
	}
</style>
