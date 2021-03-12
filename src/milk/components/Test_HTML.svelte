<div
	class="style-test"
	class:light-mode={mode != 'dark'}
	class:dark-mode={mode == 'dark'}
>
	<div class="background-white">
		<h4>HTML Testsheet (<span class="capitalize">{mode} mode)</span></h4>
		<hr />
		<div class="cols">
			<div>
				<h1>Heading 1</h1>
				<h2>Heading 2</h2>
				<h3>Heading 3</h3>
				<h4>Heading 4</h4>
				<h5>Heading 5</h5>
				<h6>Heading 6</h6>
				<table>
					<thead>
						<tr>
							<th>Table Head</th>
							<th>Table Head</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Table Cell</td>
							<td>Table Cell</td>
						</tr>
						<tr>
							<td>Table Cell</td>
							<td>Table Cell</td>
						</tr>
						<tr>
							<td>Table Cell</td>
							<td>Table Cell</td>
						</tr>
						<tr>
							<td>Table Cell</td>
							<td>Table Cell</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div>
				<dl>
					<dt>DataList Term</dt>
					<dd>DataList Term Description</dd>
					<dt>DataList Term2</dt>
					<dd>DataList Term2 Description</dd>
				</dl>
				<ol>
					<li>
						List Item One
						<ol>
							<li>
								SubList Item One
								<ol>
									<li>SubSubList Item One</li>
								</ol>
							</li>
							<li>SubList Item Two</li>
						</ol>
					</li>
					<li>List Item Two</li>
				</ol>
				<ul>
					<li>
						Unordered List Item One
						<ul>
							<li>
								SubList Item One
								<ul>
									<li>SubSubList Item One</li>
								</ul>
							</li>
							<li>SubList Item Two</li>
						</ul>
					</li>
					<li>Unordered List Item Two</li>
				</ul>
			</div>
			<div>
				<p>
					Paragraph test with
					<i>italic</i>,
					<b>bold</b>,
					<a href="#">internal link</a>,
					<a href="https://gogle.ca/" target="_blank" rel="noopener">
						external link
					</a>,
					<em>emphasized</em>,
					<strong>strong</strong>,
					<u>underline</u>,
					<strike>strike</strike>,
					<sup>sup</sup>, and <sub>sub</sub> tags.
				</p>
				<p>
					Even extras like
					<capitalize>capitalize</capitalize>,
					<uppercase>uppercase</uppercase>,
					<lowercase>LOWERCASE</lowercase>,
					<blink>blink</blink>,
					<dotted>dotted</dotted>,
					<dashed>dashed</dashed>,
					<double>double</double>,
					<highlight>highlight</highlight>,
					<selected>selected</selected>, and
					<critical>critical</critical>.
				</p>
				<p>
					As well as
					<wavy>wavy</wavy>,
					<issue>issue</issue>,
					<warn>warn</warn>,
					<check>check</check>, and <bad>bad</bad>, and
					<emergency>emergency</emergency>.
				</p>
				<p>
					Fancy stuff like
					<cage>cage</cage>,
					<cage-wavy>cage-wavy</cage-wavy>,
					<cage-dotted>cage-dotted</cage-dotted>,
					<cage-dashed>cage-dashed</cage-dashed>, and
					<cage-double>cage-double</cage-double>.
				</p>
				<p>
					Outlines
					<outline>outline</outline>,
					<outline-dotted>outline-dotted</outline-dotted>,
					<outline-dashed>outline-dashed</outline-dashed>,
					<outline-double>outline-double</outline-double>,
					<outline-groove>outline-groove</outline-groove>,
					<outline-ridge>outline-ridge</outline-ridge>,
				</p>
				<p>
					as well as
					<outline-inset>outline-inset</outline-inset>, and
					<outline-outset>outline-outset</outline-outset> or use them
					<highlight>
						<outline-double>
							<uppercase>
								<em>&nbsp; combined &nbsp;</em>
							</uppercase>
						</outline-double>
					</highlight>
					or
					<critical>
						<outline-dashed>
							<uppercase>
								<em>&nbsp; alert &nbsp;</em>
							</uppercase>
						</outline-dashed>
					</critical>
				</p>
			</div>
			<div>
				<form>
					<fieldset>
						<legend>Inputs</legend>
						<div class="form-row">
							<div class="form-input">
								<label for="test-text">Text</label>
								<input
									name="test-text"
									type="text"
									value=""
									placeholder="Text Placeholder"
								/>
							</div>
							<div class="form-input">
								<label for="test-email">Email</label>
								<input
									name="text-email"
									type="email"
									value=""
									placeholder="test@placeholder.com"
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-phone">Phone</label>
								<input
									name="test-phone"
									type="tel"
									value=""
									placeholder="1.800.555.1212"
								/>
							</div>
							<div class="form-input">
								<label for="test-url">Url</label>
								<input
									name="text-url"
									type="url"
									value=""
									placeholder="https://example.com"
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-search">Search</label>
								<input
									name="test-search"
									type="search"
									value=""
									placeholder="search for..."
								/>
							</div>
							<div class="form-input">
								<label for="test-number">Number</label>
								<input
									name="text-number"
									type="number"
									min="0"
									value="7"
									max="10000"
								/>
							</div>
							<div class="form-input">
								<label for="test-color">Color</label>
								<input
									name="text-color"
									type="color"
									value="#CE1C4F"
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-textarea">Textarea</label>
								<textarea name="textarea">Test text.</textarea>
							</div>
							<div class="form-input">
								<label for="test-color">Password</label>
								<input
									name="text-color"
									type="password"
									value="secret"
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-file">File</label>
								<input name="text-file" type="file" />
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-range">Range</label>
								<input
									name="text-range"
									type="range"
									min="0"
									max="100"
									value="65"
									step="1"
								/>
								<input
									name="text-rangeticks"
									type="range"
									list="tickmarks"
								/>
								<datalist id="tickmarks">
									<option value="0">0</option>
									<option value="10" />
									<option value="20" />
									<option value="30" />
									<option value="40" />
									<option value="50">50</option>
									<option value="60" />
									<option value="70" />
									<option value="80" />
									<option value="90" />
									<option value="100">100</option>
								</datalist>
							</div>
							<div class="form-input">
								<label for="test-progress"
									>Progress & Meter</label
								>
								<progress
									name="text-progress"
									min="0"
									max="100"
									value="65"
								/><br />
								<meter
									name="text-progress"
									min="0"
									max="100"
									value="65"
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-datetime">DateTime</label>
								<input
									name="test-datetime"
									type="datetime-local"
									value=""
								/>
							</div>
							<div class="form-input">
								<label for="test-date">Date</label>
								<input
									name="text-date"
									type="date"
									value="#CE1C4F"
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-time">Time</label>
								<input name="test-time" type="time" value="" />
							</div>
							<div class="form-input">
								<label for="test-month">Month</label>
								<input
									name="test-month"
									type="month"
									value=""
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-week">Week</label>
								<input name="test-week" type="week" value="" />
							</div>
							<div class="form-input">
								<label for="test-day">Day</label>
								<input
									name="test-day"
									type="number"
									value="12"
								/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-select">Select</label>
								<select name="test-select">
									<optgroup label="Regular Options">
										<option value="1">Option 1</option>
										<option value="2">Option 2</option>
										<option value="3">Option 2</option>
									</optgroup>
									<optgroup label="Premium Options">
										<option value="A">Option A</option>
										<option value="B">Option B</option>
										<option value="C">Option C</option>
									</optgroup>
								</select>
							</div>
							<div class="form-input">
								<label for="test-datalist">DataList</label>
								<input
									name="test-datalist"
									list="ice-cream-flavors"
								/>
								<datalist id="ice-cream-flavors">
									<option value="Chocolate" /><option
										value="Coconut"
									/><option value="Mint" /><option
										value="Strawberry"
									/><option value="Vanilla" /></datalist
								>
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-radio">Radio</label>
								<input
									name="test-radio"
									type="radio"
									value="radio-01"
								/>
								Option 01
								<input
									name="test-radio"
									type="radio"
									value="radio-02"
									checked
								/>
								Option 02
								<input
									name="test-radio"
									type="radio"
									value="radio-03"
								/> Option 03
							</div>
						</div>
						<div class="form-row">
							<div class="form-input">
								<label for="test-check">Checkbox</label>
								<input name="test-check" type="checkbox" />
								Option 01
								<input
									name="test-check"
									type="checkbox"
									checked
								/>
								Option 02
								<input name="test-check" type="checkbox" /> Option
								03
							</div>
						</div>

						<button>Test Button</button>
						<a href="#" class="button">Button Link</a>
						ICON
					</fieldset>
				</form>
			</div>
			<div>
				<blockquote>this is a blockquote</blockquote>
				<pre>preformatted text block.</pre>
				<code>/* code */ let myNum = 0; myNum = 7;</code>
				<div>
					<figure>
						<img src="" alt="Elephant at sunset" />
						<figcaption>An elephant at sunset</figcaption>
					</figure>
					<div class="image-test">
						<img
							src="/milk/img/imagetest_200x200_jpg.jpg"
							width="200"
							height="200"
							alt="JPG"
						/>
						<img
							src="/milk/img/imagetest_200x200_mozjpg.jpg"
							width="200"
							height="200"
							alt="MOZJPG"
						/>
						<img
							src="/milk/img/imagetest_200x200_gif.gif"
							width="200"
							height="200"
							alt="GIF"
						/>
						<img
							src="/milk/img/imagetest_200x200_png8.png"
							width="200"
							height="200"
							alt="PNG8"
						/>
						<img
							src="/milk/img/imagetest_200x200_png24.png"
							width="200"
							height="200"
							alt="PNG24"
						/>
						<img
							src="/milk/img/imagetest_200x200_webp.webp"
							width="200"
							height="200"
							alt="WEBP"
						/>
						<img
							src="/milk/img/imagetest_200x200_avif.avif"
							width="200"
							height="200"
							alt="AVIF"
						/>
						<img
							src="/milk/img/imagetest_200x200_svg.svg"
							width="200"
							height="200"
							alt="SVG"
						/>
					</div>
				</div>
				<div>
					<details>
						<summary>Summary & Details</summary>
						<div class="content">
							<p>
								Lorem, ipsum dolor sit amet consectetur
								adipisicing elit. Modi unde, ex rem voluptates
								autem aliquid veniam quis temporibus repudiandae
								illo, nostrum, pariatur quae! At animi modi
								dignissimos corrupti placeat voluptatum!
							</p>
							<img src="https://placebear.com/400/200" alt="" />
							<p>
								Facilis ducimus iure officia quos possimus
								quaerat iusto, quas, laboriosam sapiente autem
								ab assumenda eligendi voluptatum nisi eius
								cumque, tempore reprehenderit optio placeat
								praesentium non sint repellendus consequuntur?
								Nihil, soluta.
							</p>
						</div>
					</details>
				</div>
			</div>
		</div>
	</div>
	<slot />
</div>

<script>
	export let mode;
</script>

<style>
	@media (min-width: 800px) {
		.cols > div {
			display: inline-block;
			vertical-align: top;
			min-width: 200px;
			max-width: 500px;
			margin: 25px;
		}
	}
	.image-test {
		width: 100px;
		height: 100px;
	}
	.image-test img {
		width: 100px;
		height: 100px;
		position: absolute;
	}
</style>
