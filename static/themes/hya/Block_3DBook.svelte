<div {id} class={blockclass}>
	<div class="books-inner">
		<div class="books-list">
			<div class="book block-style02">
				<div class="book-img">
					<a
						href="https://3degreesoflaw.com/"
						target="_blank"
						rel="noreferrer"
						title="Purchase the Book"
					>
						<picture>
							<source
								type="image/avif"
								srcset="/img/harlans-3degree-book.avif"
							/>
							<source
								type="image/webp"
								srcset="/img/harlans-3degree-book.webp"
							/>
							<img
								src="/img/harlans-3degree-book.jpg"
								alt="Three Dregrees of Law"
								loading="lazy"
								width="359"
								height="595"
							/>
						</picture>
					</a>
				</div>
				<div class="book-content">
					<h2>
						<a
							href="https://3degreesoflaw.com/"
							target="_blank"
							rel="noreferrer"
							title="Purchase the Book"
						>
							Three Degrees of Law
						</a>
					</h2>
					<div class="book-description">
						<h3>
							UNLOCKING THE SECRETS TO HAPPINESS IN THE LEGAL
							UNIVERSE
						</h3>
						<p>
							“To be happy and successful as a lawyer, find a path
							that you love, practice the best way you can, and
							work with compassion.” Harlan York.
						</p>
						<p>
							Not just for law students or attorneys, Three
							Degrees of Law is for anyone who has ever questioned
							what they do, and wondered how they could improve
							not only their output but also their own sense of
							satisfaction.
						</p>
					</div>
					<div>
						<a
							href="https://3degreesoflaw.com/"
							target="_blank"
							rel="noreferrer"
							class="fancy-link"
							title="Purchase the Book"
						>
							<span>Learn More </span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
	/* ## Variables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'books';
	$: blockclass = `books ${blockstyle}`;
	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.books {
		display: block;
		padding: 0;
		text-align: center;
	}
	@media screen and (min-width: 650px) {
		.books {
			padding: 50px var(--padding-inner, 20px);
		}
	}
	.books-inner {
		margin: 0 auto;
		max-width: var(--content-constrain);
	}
	.book {
		text-align: center;
		padding: 25px;
		margin-bottom: 2em;
	}
	@media screen and (min-width: 450px) {
		.book {
			text-align: left;
			display: grid;
			column-gap: 2em;
			grid-template-columns: 30% 60%;
		}
	}
	.book-img {
		position: relative;
	}
	.book-img img {
		width: 100%;
		height: auto;
		max-width: 200px;
		margin-bottom: 20px;
	}
	.book-description {
		font-size: var(--small-fontsize);
		font-style: italic;
	}
	h2 a:hover {
		text-decoration: none;
	}

	.books-list {
		margin: auto;
	}
	@media screen and (min-width: 650px) {
		.books-list {
			position: relative;
			z-index: 200;
			max-width: 700px;
			text-align: center; /* transition: margin ease 1s; */
		}
	}
</style>
