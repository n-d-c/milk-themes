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
				<input name="text-color" type="color" value="#CE1C4F" />
			</div>
		</div>
		<div class="form-row">
			<div class="form-input">
				<label for="test-textarea">Textarea</label>
				<textarea name="textarea">Test text.</textarea>
			</div>
			<div class="form-input">
				<label for="test-color">Password</label>
				<input name="text-color" type="password" value="secret" />
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
				<input name="text-rangeticks" type="range" list="tickmarks" />
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
				<label for="test-progress">Progress & Meter</label>
				<progress
					name="text-progress"
					min="0"
					max="100"
					value="65"
				/><br />
				<meter name="text-progress" min="0" max="100" value="65" />
			</div>
		</div>
		<div class="form-row">
			<div class="form-input">
				<label for="test-datetime">DateTime</label>
				<input name="test-datetime" type="datetime-local" value="" />
			</div>
			<div class="form-input">
				<label for="test-date">Date</label>
				<input name="text-date" type="date" value="#CE1C4F" />
			</div>
		</div>
		<div class="form-row">
			<div class="form-input">
				<label for="test-time">Time</label>
				<input name="test-time" type="time" value="" />
			</div>
			<div class="form-input">
				<label for="test-month">Month</label>
				<input name="test-month" type="month" value="" />
			</div>
		</div>
		<div class="form-row">
			<div class="form-input">
				<label for="test-week">Week</label>
				<input name="test-week" type="week" value="" />
			</div>
			<div class="form-input">
				<label for="test-day">Day</label>
				<input name="test-day" type="number" value="12" />
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
				<input name="test-datalist" list="ice-cream-flavors" />
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
				<input name="test-radio" type="radio" value="radio-01" />
				Option 01
				<input
					name="test-radio"
					type="radio"
					value="radio-02"
					checked
				/>
				Option 02
				<input name="test-radio" type="radio" value="radio-03" /> Option
				03
			</div>
		</div>
		<div class="form-row">
			<div class="form-input">
				<label for="test-check">Checkbox</label>
				<input name="test-check" type="checkbox" />
				Option 01
				<input name="test-check" type="checkbox" checked />
				Option 02
				<input name="test-check" type="checkbox" /> Option 03
			</div>
		</div>

		<button>Test Button</button>
		<a href="#" class="button">Button Link</a>
		ICON
	</fieldset>
</form>
