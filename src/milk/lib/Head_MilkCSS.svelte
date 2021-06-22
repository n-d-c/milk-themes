<svelte:head>
	<style type="text/css" data-note="Reset CSS">
		@charset "UTF-8";
		*,
		::after,
		::before {
			box-sizing: border-box;
			scroll-behavior: smooth;
		}
		@media (prefers-reduced-motion: reduce) {
			*,
			::after,
			::before {
				-webkit-animation-delay: -1ms;
				animation-delay: -1ms;
				-webkit-animation-duration: 1ms;
				animation-duration: 1ms;
				-webkit-animation-iteration-count: 1;
				animation-iteration-count: 1;
				background-attachment: initial;
				scroll-behavior: auto;
				transition-delay: 0s;
				transition-duration: 0s;
			}
		}
		a,
		abbr,
		acronym,
		address,
		applet,
		article,
		aside,
		audio,
		b,
		big,
		blockquote,
		body,
		canvas,
		caption,
		center,
		cite,
		code,
		dd,
		del,
		details,
		dfn,
		div,
		dl,
		dt,
		em,
		embed,
		fieldset,
		figcaption,
		figure,
		footer,
		form,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		header,
		hgroup,
		html,
		i,
		iframe,
		img,
		ins,
		kbd,
		label,
		legend,
		li,
		mark,
		menu,
		nav,
		object,
		ol,
		output,
		p,
		pre,
		q,
		ruby,
		s,
		samp,
		section,
		small,
		span,
		strike,
		strong,
		sub,
		summary,
		sup,
		table,
		tbody,
		td,
		tfoot,
		th,
		thead,
		time,
		tr,
		tt,
		u,
		ul,
		var,
		video {
			cursor: default;
			-moz-tab-size: 4;
			-o-tab-size: 4;
			tab-size: 4;
			margin: 0;
			padding: 0;
			border: none;
			font: inherit;
			font-size: 100%;
			vertical-align: baseline;
		}
		html {
			font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu,
				Cantarell, 'Noto Sans', sans-serif, 'Apple Color Emoji',
				'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
			font-size: 1rem;
			font-weight: 400;
			line-height: 1.5;
			color: inherit;
			background-color: inherit;
			-webkit-text-size-adjust: 100%;
			-webkit-tap-highlight-color: transparent;
		}
		article,
		aside,
		details,
		figcaption,
		figure,
		footer,
		header,
		hgroup,
		menu,
		nav,
		section {
			display: block;
		}
		[tabindex='-1']:focus:not(:focus-visible) {
			outline: 0;
		}
		hr {
			margin: 1em 0;
			color: inherit;
			background-color: currentColor;
			border: 0;
			overflow: visible;
		}
		hr:not([size]) {
			height: 1px;
		}
		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			margin-top: 0;
			margin-bottom: 0.5em;
			font-weight: 500;
			line-height: 1.2;
		}
		h1 {
			font-size: calc(1.375em + 1.5vw);
		}
		@media (min-width: 1200px) {
			h1 {
				font-size: 2.5em;
			}
		}
		h2 {
			font-size: calc(1.325em + 0.9vw);
		}
		@media (min-width: 1200px) {
			h2 {
				font-size: 2em;
			}
		}
		h3 {
			font-size: calc(1.3em + 0.6vw);
		}
		@media (min-width: 1200px) {
			h3 {
				font-size: 1.75em;
			}
		}
		h4 {
			font-size: calc(1.275em + 0.3vw);
		}
		@media (min-width: 1200px) {
			h4 {
				font-size: 1.5em;
			}
		}
		h5 {
			font-size: 1.25em;
		}
		h6 {
			font-size: 1em;
		}
		p {
			margin-top: 0;
			margin-bottom: 1em;
		}
		abbr[data-bs-original-title],
		abbr[title] {
			-webkit-text-decoration: underline dotted;
			text-decoration: underline dotted;
			cursor: help;
			-webkit-text-decoration-skip-ink: none;
			text-decoration-skip-ink: none;
		}
		address {
			margin-bottom: 1em;
			font-style: normal;
			line-height: inherit;
		}
		ol,
		ul {
			padding-left: 2em;
		}
		dl,
		ol,
		ul {
			margin-top: 0;
			margin-bottom: 1em;
		}
		ol ol,
		ol ul,
		ul ol,
		ul ul {
			margin-bottom: 0;
		}
		nav li {
			list-style: none;
			padding: 0;
		}
		nav li::before {
			content: '​';
		}
		dt {
			font-weight: 700;
		}
		dd {
			margin-bottom: 0.5em;
			margin-left: 0;
		}
		blockquote {
			margin: 0 0 1em;
		}
		b,
		strong {
			font-weight: bolder;
		}
		small {
			font-size: 0.875em;
		}
		mark {
			padding: 0.2em;
			background-color: currentColor;
		}
		sub,
		sup {
			position: relative;
			font-size: 0.75em;
			line-height: 0;
			vertical-align: baseline;
		}
		sub {
			bottom: -0.25em;
		}
		sup {
			top: -0.5em;
		}
		a {
			cursor: pointer;
			color: #3333e1;
			background-color: transparent;
			text-decoration: none;
		}
		a:hover {
			color: #3434e0;
			text-decoration: underline;
		}
		a:focus {
			outline: thin dotted;
		}
		a:not([href]):not([class]):hover,
		a:not([href]):not(class) {
			cursor: default;
			color: inherit;
			text-decoration: none;
		}
		[tabindex],
		a,
		area,
		button,
		input,
		label,
		select,
		summary,
		textarea {
			touch-action: manipulation;
		}
		code,
		kbd,
		pre,
		samp {
			font-family: 'Fira Code', 'Cascadia Code', Consolas, Inconsolata,
				Monaco, Menlo, 'Noto Mono', 'Roboto Mono', 'Droid Sans Mono',
				'Ubuntu Mono', 'Ubuntu Monospace', 'Source Code Pro',
				'Oxygen Mono', 'Liberation Mono', 'DejaVu Sans Mono',
				'Bitstream Vera Sans Mono', monospace, 'Apple Color Emoji',
				'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
			font-size: 1em;
		}
		pre {
			display: block;
			margin-top: 0;
			margin-bottom: 1em;
			font-size: 0.875em;
			overflow: auto;
			-ms-overflow-style: scrollbar;
		}
		pre code {
			font-size: inherit;
			color: inherit;
			word-break: normal;
		}
		code {
			font-size: 0.875em;
			color: inherit;
			word-wrap: break-word;
		}
		a > * {
			color: inherit;
		}
		kbd {
			padding: 0.2em 0.4em;
			font-size: 0.875em;
			color: inherit;
			background-color: inherit;
			border-radius: 0.2em;
		}
		kbd kbd {
			padding: 0;
			font-size: 1em;
			font-weight: 700;
		}
		figure {
			margin: 0 0 1em;
		}
		iframe,
		img,
		input,
		select,
		textarea {
			height: auto;
			max-width: 100%;
		}
		audio,
		canvas,
		iframe,
		img,
		svg,
		video {
			vertical-align: middle;
		}
		svg:not([fill]) {
			fill: currentColor;
		}
		svg:not(:root) {
			overflow: hidden;
		}
		img {
			border: 0;
			-ms-interpolation-mode: bicubic;
		}
		table {
			caption-side: bottom;
			border-collapse: collapse;
			text-indent: 0;
		}
		caption {
			padding-top: 0.5em;
			padding-bottom: 0.5em;
			color: inherit;
			text-align: left;
		}
		th {
			text-align: inherit;
			text-align: -webkit-match-parent;
		}
		tbody,
		td,
		tfoot,
		th,
		thead,
		tr {
			border-color: inherit;
			border-style: solid;
			border-width: 0;
		}
		label {
			display: inline-block;
		}
		button {
			border-radius: 0;
			text-transform: none;
		}
		button:focus {
			outline: dotted 1px;
			outline: -webkit-focus-ring-color auto 5px;
		}
		button,
		input {
			overflow: visible;
		}
		button,
		input,
		optgroup,
		select,
		textarea {
			margin: 0;
			font-family: inherit;
			font-size: inherit;
			line-height: inherit;
		}
		button,
		input,
		select,
		textarea {
			background-color: transparent;
			border: 1px solid WindowFrame;
			color: inherit;
			font: inherit;
			letter-spacing: inherit;
			padding: 0.25em 0.375em;
		}
		button,
		select {
			text-transform: none;
		}
		[role='button'] {
			cursor: pointer;
		}
		select {
			/* -moz-appearance: none;
			-webkit-appearance: none; */
			text-transform: none;
			word-wrap: normal;
		}
		select:not([multiple]):not([size]) {
			background-image: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='4'%3E%3Cpath d='M4 0h6L7 4'/%3E%3C/svg%3E";
		}
		::-ms-expand {
			display: none;
		}
		[list]::-webkit-calendar-picker-indicator {
			display: none;
		}
		[type='button'],
		[type='reset'],
		[type='submit'],
		button {
			-webkit-appearance: button;
		}
		[type='button']:not(disabled),
		[type='reset']:not(disabled),
		[type='submit']:not(disabled),
		button:not(disabled) {
			cursor: pointer;
		}
		::-webkit-file-upload-button {
			font: inherit;
			-webkit-appearance: button;
		}
		textarea {
			overflow: auto;
			-ms-overflow-style: scrollbar;
			resize: vertical;
			vertical-align: top;
		}
		fieldset {
			min-width: 0;
			padding: 0.35em 0.75em 0.625em;
			margin: 0;
			border: 1px solid inherit;
		}
		legend {
			float: left;
			width: 100%;
			padding: 0;
			margin-bottom: 0.5em;
			font-size: calc(1.275em + 0.3vw);
			line-height: inherit;
			max-width: 100%;
			white-space: normal;
		}
		@media (max-width: 1200px) {
			legend {
				font-size: 1.5em;
			}
		}
		legend + * {
			clear: left;
		}
		dialog {
			background-color: inherit;
			border: solid;
			color: inherit;
			display: block;
			height: -webkit-fit-content;
			height: -moz-fit-content;
			height: fit-content;
			left: 0;
			margin: auto;
			padding: 1em;
			position: absolute;
			right: 0;
			width: -webkit-fit-content;
			width: -moz-fit-content;
			width: fit-content;
		}
		dialog:not([open]) {
			display: none;
		}
		::-webkit-datetime-edit-day-field,
		::-webkit-datetime-edit-fields-wrapper,
		::-webkit-datetime-edit-hour-field,
		::-webkit-datetime-edit-minute,
		::-webkit-datetime-edit-month-field,
		::-webkit-datetime-edit-text,
		::-webkit-datetime-edit-year-field {
			padding: 0;
		}
		::-webkit-inner-spin-button,
		::-webkit-outer-spin-button {
			height: auto;
		}
		::-webkit-input-placeholder {
			color: inherit;
			opacity: 0.54;
		}
		[type='email'],
		[type='number'],
		[type='tel'],
		[type='url'] {
			direction: ltr;
		}
		::-webkit-color-swatch-wrapper {
			padding: 0;
		}
		::-moz-focus-inner {
			padding: 0;
			border-style: none;
		}
		:-moz-ui-invalid {
			box-shadow: none;
		}
		:-moz-focusring {
			outline: 1px dotted ButtonText;
		}
		output {
			display: inline-block;
		}
		iframe {
			border: none;
		}
		audio,
		canvas,
		video {
			display: inline;
			display: inline-block;
			zoom: 1;
			max-width: 100%;
		}
		audio:not([controls]) {
			display: none;
			height: 0;
		}
		summary {
			display: list-item;
			cursor: pointer;
		}
		progress {
			display: inline-block;
			vertical-align: baseline;
		}
		template {
			display: none;
		}
		[hidden] {
			display: none;
		}
		[aria-busy='true'] {
			cursor: progress;
		}
		[aria-controls] {
			cursor: pointer;
		}
		[aria-disabled='true'],
		[disabled] {
			cursor: not-allowed;
		}
		[aria-hidden='false'][hidden='false'] {
			display: initial;
		}
		[aria-hidden='false'][hidden='false']:not(:focus) {
			clip: rect(0, 0, 0, 0);
			position: absolute;
		}
		a,
		button,
		select {
			cursor: pointer !important;
		}
		input[type='color'] {
			vertical-align: middle;
		}
		input[type='color']::-webkit-color-swatch-wrapper {
			padding: 0;
		}
		input[type='color']::-webkit-color-swatch {
			height: 1.4em;
			width: 3em;
		}
		input[type='color']::-moz-color-swatch {
			height: 1.5em;
			width: 1.6em;
		}
		input[type='color'] {
			width: 2.6em;
		}
		input[type='day'],
		input[type='number'] {
			width: 5em;
		}
		fieldset label {
			display: block;
			font-size: smaller;
		}
		fieldset .form-row {
			display: block;
		}
		fieldset .form-input {
			display: inline-block;
			vertical-align: top;
		}
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		p {
			color: currentColor;
		}
	</style>
	<style type="text/css" data-note="Accessibility CSS">
		/* #### ACCESSABILITY #### */
		/* Remove all animations and transitions for people that prefer not to see them */
		@media (prefers-reduced-motion: reduce) {
			* {
				animation-duration: 0.01ms !important;
				animation-iteration-count: 1 !important;
				transition-duration: 0.01ms !important;
				scroll-behavior: auto !important;
				animation-fill-mode: forwards;
			}
		}
		.do-not-speak,
		.do-not-read,
		.no-read,
		.no-screenreader {
			speak: none;
		}
	</style>
	<style type="text/css" data-note="Print CSS">
		/* #### PRINT #### */
		@media print {
			.no-print {
				display: none;
			}
			.print-bw,
			.print-monochrome {
				filter: grayscale(100%);
			}
		}
	</style>
	<link
		async
		href={`/themes/${$milk.theme.slug}/style.css`}
		rel="preload"
		as="style"
	/>
	<link
		async
		href={`/themes/${$milk.theme.slug}/style.css`}
		rel="stylesheet"
	/>
	<style type="text/css" data-note="Milk CSS">
		body {
			font-size: var(--base-fontsize, 16px);
		}
		.notice {
			border: 1px solid var(--color-black);
			background: var(--color-white);
			color: var(--color-black);
			padding: 5px 10px;
			margin: 10px 5px;
		}
		.notice {
			border-color: var(--color-notice);
			background: var(--background-notice);
			color: var(--color-notice);
		}
		.notice.error {
			border-color: var(--color-error);
			background: var(--background-error);
			color: var(--color-error);
		}
		.notice.warning {
			border-color: var(--color-warn);
			background: var(--background-warn);
			color: var(--color-warn);
		}
		.notice.success {
			border-color: var(--color-success);
			background: var(--background-success);
			color: var(--color-success);
		}
		.color-transparent {
			color: var(--color-transparent);
		}
		.color-white {
			color: var(--color-white);
		}
		.color-offwhite {
			color: var(--color-offwhite);
		}
		.color-grey-light {
			color: var(--color-grey-light);
		}
		.color-grey {
			color: var(--color-grey);
		}
		.color-grey-dark {
			color: var(--color-grey-dark);
		}
		.color-charcoal {
			color: var(--color-charcoal);
		}
		.color-black {
			color: var(--color-black);
		}
		.background-transparent {
			background-color: var(--color-transparent);
		}
		.background-white {
			background-color: var(--color-white);
		}
		.background-offwhite {
			background-color: var(--color-offwhite);
		}
		.background-grey-light {
			background-color: var(--color-grey-light);
		}
		.background-grey {
			background-color: var(--color-grey);
		}
		.background-grey-dark {
			background-color: var(--color-grey-dark);
		}
		.background-charcoal {
			background-color: var(--color-charcoal);
		}
		.background-black {
			background-color: var(--color-black);
		}
		.color-one {
			color: var(--color-one);
		}
		.color-two {
			color: var(--color-two);
		}
		.color-three {
			color: var(--color-three);
		}
		.color-four {
			color: var(--color-four);
		}
		.color-five {
			color: var(--color-five);
		}
		.color-six {
			color: var(--color-six);
		}
		.color-seven {
			color: var(--color-seven);
		}
		.color-eight {
			color: var(--color-eight);
		}
		.background-one {
			background-color: var(--color-one);
		}
		.background-two {
			background-color: var(--color-two);
		}
		.background-three {
			background-color: var(--color-three);
		}
		.background-four {
			background-color: var(--color-four);
		}
		.background-five {
			background-color: var(--color-five);
		}
		.background-six {
			background-color: var(--color-six);
		}
		.background-seven {
			background-color: var(--color-seven);
		}
		.background-eight {
			background-color: var(--color-eight);
		}
		.font-special {
			font-family: var(--font-special);
		}
		.font-main {
			font-family: var(--font-main);
		}
		.font-baseline,
		.font-resize {
			vertical-align: baseline;
		}
		[class*='font-resize'] {
			font-size: var(--resize-to, calc(1em * var(--resize-by, 1)));
		}
		body {
			background: var(--background);
			color: var(--text-color);
		}
		input,
		td,
		th,
		button,
		textarea,
		select {
			border: var(--border-size) var(--border-style) var(--border-color);
		}
		a {
			color: var(--link-color);
		}
		a:hover,
		a:active {
			color: var(--link-color-hover);
		}
		a:visited {
			color: var(--link-color-visited);
		}
		::selection {
			background: var(--highlight-background);
			color: var(--highlight-color);
			box-shadow: 0.04rem 0.07rem 0.15rem rgba(0, 0, 0, 0.4);
		}
		input,
		textarea,
		select,
		select optgroup,
		select option {
			background: var(--input-background);
			color: var(--input-color);
		}
		::placeholder {
			color: var(--input-placeholder);
		}
		button,
		a.button {
			transition: color ease 0.35s, background ease 0.35s;
			display: inline-block;
			vertical-align: middle;
			text-decoration: none;
			font-size: var(--button-fontsize);
			color: var(--button-color);
			background: var(--button-background);
			padding: var(--button-padding);
			border: var(--button-border-size) var(--button-border-style)
				var(--button-border-color);
			border-radius: var(--button-border-radius);
			transform-origin: center;
		}
		button:hover,
		a.button:hover,
		button:active,
		a.button:active {
			color: var(--button-color-hover);
			background: var(--button-background-hover);
			border-color: var(--button-border-color-hover);
		}
		hr {
			display: block;
			height: var(--border-size);
			background: transparent;
			border: 0px none;
			border-bottom: var(--border-size) var(--border-style)
				var(--border-color);
			max-width: calc(100% - var(--padding-large) - var(--padding-large));
			margin-left: var(--padding-large);
			margin-right: var(--padding-large);
		}
		input[type='checkbox'],
		input[type='radio'],
		input[type='range'] {
			filter: hue-rotate(var(--input-hue-rotate, 40deg))
				brightness(calc(10% + var(--input-brightness-adjust, 90%)));
		}
		progress {
			filter: hue-rotate(var(--input-hue-rotate, 40deg))
				brightness(calc(10% + var(--input-brightness-adjust, 90%)));
		}
		meter {
			filter: saturate(150%)
				hue-rotate(calc(100deg + var(--input-hue-rotate, 40deg)))
				brightness(calc(var(--input-brightness-adjust, 90%) + 20%));
		}
		@-moz-document url-prefix() {
			input[type='checkbox'],
			input[type='radio'],
			input[type='range'] {
				filter: hue-rotate(calc(var(--input-hue-rotate, 40deg) + 10deg))
					brightness(var(--input-brightness-adjust, 90%));
			}
			progress {
				filter: saturate(200%) brightness(250%)
					hue-rotate(calc(var(--input-hue-rotate, 40deg) + 126deg))
					brightness(var(--input-brightness-adjust, 90%));
			}
			meter {
				filter: brightness(
						calc(15% + var(--input-brightness-adjust, 90%))
					)
					saturate(90%)
					hue-rotate(calc(var(--input-hue-rotate, 40deg) + 140deg));
			}
		}
		* {
			--prepend: initial;
			--append: initial;
			--box-shadow: initial;
			box-shadow: var(--box-shadow);
		}
		::before {
			content: var(--prepend);
		}
		::after {
			content: var(--append);
		}
		/* # The Rotating Marker # */
		details summary::marker {
			display: none;
		}
		summary::before {
			font-family: 'Hiragino Mincho ProN', 'Open Sans', sans-serif;
			content: '▶';
			position: absolute;
			top: 1rem;
			left: 0.8rem;
			transform: rotate(0);
			transform-origin: center;
			transition: 0.2s transform ease;
		}
		details[open] > summary:before {
			transform: rotate(90deg);
			transition: 0.45s transform ease;
		}
		details {
			max-width: 500px;
			box-sizing: border-box;
			margin-top: 5px;
			background: var(--color-transparent);
		}
		summary {
			border: 4px solid transparent;
			outline: none;
			padding: 1rem;
			display: block;
			background: #666;
			color: white;
			padding-left: 2.2rem;
			position: relative;
			cursor: pointer;
		}
		details[open] summary,
		summary:hover {
			color: #ffca28;
			background: #444;
		}
		summary:hover strong,
		details[open] summary strong,
		summary:hover::before,
		details[open] summary::before {
			color: #ffa128;
		}
		details .content {
			padding: 10px;
			border: 2px solid #888;
			border-top: none;
			margin: 0;
		}

		/* # The Sliding Summary # */
		details {
			overflow: hidden;
		}
		details summary {
			position: relative;
			z-index: 10;
		}
		@keyframes details-show {
			from {
				margin-bottom: -80%;
				opacity: 0;
				transform: translateY(-100%);
			}
		}
		details > *:not(summary) {
			animation: details-show 500ms ease-in-out;
			position: relative;
			z-index: 1;
			transition: all 0.3s ease-in-out;
			color: transparent;
			overflow: hidden;
		}
		details[open] > *:not(summary) {
			color: inherit;
		}
		details summary :is(h1, h2, h3, h4, h5, h6) {
			margin: 0;
			padding: 0;
		}

		/* # Style 4 # */
		details.faq summary {
			padding-right: 2.2rem;
			padding-left: 1rem;
		}
		details.faq summary::before {
			content: '×';
			color: #fff;
			font-size: 2rem;
			line-height: 1rem;
			transform: rotate(-45deg);
			top: 1.2rem;
			left: unset;
			right: 0.6rem;
		}
		details[open].faq > summary:before {
			transform: rotate(90deg);
			color: #f00 !important;
			transition: color ease 2s, transform ease 1s;
		}

		.hide {
			position: absolute;
			max-width: 100vw;
			margin-left: -999vw;
			visibility: hidden;
		}
		.remove {
			display: none;
		}
		.dark-mode .light-only {
			position: absolute;
			margin-left: -9999vw;
		}
		.dark-mode .light-mode .light-only {
			position: inherit;
			margin-left: inherit;
		}
		.light-mode .dark-only {
			position: absolute;
			margin-left: -9999vw;
		}
		.light-mode .dark-mode .dark-only {
			position: inherit;
			margin-left: inherit;
		}
		.monochrome {
			filter: grayscale(100%);
		}
		capitalize,
		.capitalize {
			text-transform: capitalize;
		}
		uppercase,
		.uppercase {
			text-transform: uppercase;
		}
		lowercase,
		.lowercase {
			text-transform: lowercase;
		}
		.inline-block {
			display: inline-block;
		}
		.float-left {
			float: left;
		}
		.float-right {
			float: right;
		}
		.columns {
			column-width: var(--column-width);
			column-gap: var(--column-gap);
			columns: var(--column-count);
		}
		emphasize,
		em,
		b {
			font-weight: bold;
			color: inherit;
		}
		i,
		em {
			font-style: italic;
		}
		strike,
		bad {
			text-decoration: line-through;
		}
		u,
		underline,
		wavy,
		dotted,
		dashed,
		double,
		issue,
		warn,
		check {
			text-decoration-line: underline;
			text-decoration-style: solid;
			text-decoration-color: var(--text-decoration-color, currentColor);
		}
		cage,
		cage-wavy,
		cage-dotted,
		cage-dashed,
		cage-double {
			text-decoration: underline overline;
			text-decoration-style: solid;
		}
		wavy,
		issue,
		warn,
		check,
		cage-wavy {
			text-decoration-style: wavy;
		}
		dotted,
		cage-dotted {
			text-decoration-style: dotted;
		}
		dashed,
		cage-dashed {
			text-decoration-style: dashed;
		}
		double,
		cage-double {
			text-decoration-style: double;
		}
		outline,
		outline-dashed,
		outline-dotted,
		outline-double,
		outline-groove,
		outline-inset,
		outline-offset,
		outline-outset,
		outline-ridge {
			outline-color: var(--outline-color, currentColor);
			outline-width: var(--outline-size, 1px);
			outline-style: solid;
		}
		outline-dashed {
			outline-style: dashed;
		}
		outline-dotted {
			outline-style: dotted;
		}
		outline-double {
			outline-width: calc(var(--outline-size, 1px) * 3);
			outline-style: double;
		}
		outline-groove {
			outline-style: groove;
		}
		outline-inset {
			outline-style: inset;
		}
		outline-offset {
			outline-style: offset;
		}
		outline-outset {
			outline-style: outset;
		}
		outline-ridge {
			outline-style: ridge;
		}
		@keyframes blink {
			0% {
				visibility: hidden;
			}
			50% {
				visibility: hidden;
			}
			100% {
				visibility: visible;
			}
		}
		blink,
		.animate-blink {
			animation: 2s linear infinite blink;
		}
		@keyframes pulse {
			0%,
			100% {
				transform: scale(1.05);
			}
			50% {
				transform: scale(0.95);
			}
		}
		pulse,
		.animate-pulse {
			animation: 1s linear infinite pulse;
		}
		@keyframes flash {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0;
			}
		}
		@keyframes flashy {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.65;
			}
		}
		flash,
		.animate-flash {
			animation: 2s linear infinite flash;
		}
		flashy,
		.animate-flashy {
			animation: 2s linear infinite flashy;
		}
		bad {
			color: var(--color-error);
		}
		issue {
			text-decoration-color: var(--color-error);
		}
		warn {
			text-decoration-color: var(--color-warn);
		}
		check {
			text-decoration-color: var(--color-success);
		}
		highlight,
		.highlight,
		selected,
		.selected {
			background: var(--highlight-background);
			color: var(--highlight-color);
		}
		critical,
		.critical {
			background: var(--color-error);
			color: #fff;
		}
		emergency {
			animation: 2s linear infinite flashy;
			display: inline-block;
			color: var(--color-white);
			outline-width: var(--outline-size, 1px);
			outline-style: dashed;
			outline-color: var(--color-black);
			vertical-align: middle;
			padding: 0 10px 2px;
			background: var(--color-error);
			box-sizing: border-box;
		}
		table {
			border: var(--border-size) var(--border-style) var(--border-color);
			border-collapse: collapse;
		}
		table th {
			color: var(--table-head-color);
			background: var(--table-head-background);
		}
		table tr:nth-child(even) td {
			color: var(--table-row-even-color);
			background: var(--table-row-even-background);
		}
		table tr:nth-child(odd) td {
			color: var(--table-row-odd-color);
			background: var(--table-row-odd-background);
		}
		table th,
		table td {
			padding: var(--table-cell-padding);
		}
		.content {
			margin: var(--margin-large, 5vw);
		}
		.content-inner {
			margin: 0 auto;
			max-width: var(--content-constrain, 100%);
		}
		a,
		button,
		a *,
		button * {
			cursor: pointer !important;
		}
	</style>
	{#if $milk?.theme?.prismjs}
		<link
			async
			href={`/themes/${$milk.theme.slug}/prismjs.css`}
			rel="preload"
			as="style"
		/>
		<link
			async
			href={`/themes/${$milk.theme.slug}/prismjs.css`}
			rel="stylesheet"
		/>
	{/if}
</svelte:head>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
</script>
