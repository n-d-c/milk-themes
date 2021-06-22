<div class="content">
	<div class="content-inner">
		<div class="languages-we-speak">
			<h2>SE HABLA ESPAÑOL</h2>
			<h2>NÓS FALAMOS PORTUGUÊS</h2>
			<h2 class="rtl">نحن نتكلم اللغة العربية</h2>
		</div>
	</div>
</div>

<style>
	.content-inner {
		margin: 0 auto;
		max-width: var(--content-width-max, 1020px);
	}
	.languages-we-speak {
		padding: calc(var(--padding) * 3) var(--padding-large)
			calc(var(--padding) * 2);
		text-align: left;
		margin: auto;
		background: var(--color-grey-light);
	}
	h2 {
		text-align: left;
	}
	h2.rtl {
		text-align: right;
	}
	@media screen and (min-width: 650px) {
		.languages-we-speak {
			position: relative;
			z-index: 200;
			max-width: 700px;
			text-align: center; /* transition: margin ease 1s; */
		}
	}
</style>
