<div {id} class={blockclass}>
	<div class="languages-inner">
		<h2>Languages</h2>
		<p>
			If you are looking to translate our site, please choose a language
			from the options below and Google will automatically translate the
			page for you.
		</p>
		<hr />
		<h3>Convert Language With Google</h3>
		<div>
			<button on:click={translate('es')} title="Traducir al español">
				Español
			</button>
			<button on:click={translate('fr')} title="Traduire en Français">
				Français
			</button>
			<button on:click={translate('fr')} title="Traduz para o português">
				Português
			</button>
			<button on:click={translate('zh-CN')} title="翻译成中文">
				中国人
			</button>
			<button on:click={translate('ja')} title="日本語に翻訳">
				日本語
			</button>
			<button on:click={translate('ko')} title="한국어로 번역">
				한국어
			</button>
			<button on:click={translate('hi')} title="हिंदी में अनुवाद करें">
				हिंदी
			</button>
			<button on:click={translate('ar')} title="ترجمة الى اللغة العربية">
				عربى
			</button>
		</div>
	</div>
</div>

<script>
	/* ## Svelte ## */
	import { onMount, onDestroy } from 'svelte';
	/* ## Variables ## */
	let id;
	let blockstyle = '';
	let blockclass = 'languages';
	$: blockclass = `languages ${blockstyle}`;
	let translate = (lang) => {};
	onMount(async () => {
		translate = (lang) => {
			window.location.href = `https://translate.google.com/translate?sl=auto&tl=${lang}&u=${window.location.href}`;
		};
	});
	/* ## Exports ## */
	export { id, blockstyle };
</script>

<style>
	.languages {
		display: block;
		padding: var(--padding);
		text-align: center;
	}
	.languages-inner {
		padding: 50px var(--padding-inner, 20px) 100px;
		margin: 0 auto;
		max-width: var(--content-constrain);
	}
	h2 {
		font-size: var(--extralarge-fontsize);
	}
	hr {
		border-bottom: solid var(--color-white) 2px;
	}
</style>
