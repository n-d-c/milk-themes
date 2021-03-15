<Documentation {title} {tagline} {excerpt} {logo}>
	<div slot="hero">
		<h4>
			<a href={$milk?.credits?.url} title="Milk.js">
				{$milk?.credits?.url}
			</a>
		</h4>
	</div>
	<h2>Milk.js</h2>
	<pre><strong>Milk Version:</strong> {$milk?.version} on {$milk?.date}</pre>
	<p>
		<a href={$milk?.credits?.url} title="Milk.js">
			{$milk?.credits?.url}
		</a>
	</p>
	<hr />
	<div>
		<h3>Installing</h3>
		<p>In order to updte your theme, please run:</p>
		<code>
			mkdir &lt;your_project&gt; && $_; npx degit
			https://github.com/rndm-user/devlove-milk.git .; npm install;
		</code>
		<p>
			Update domains in service-worker.js and edit the mainfest.js and
			/src/config/* files.
		</p>
	</div>
	<div>
		<h3>Add to Your Source Control</h3>
		<code>
			git init; git add .; git remote add origin &lt;your_git_repo&gt;;
			git commit; git push origin master;
		</code>
	</div>
	<div>
		<h3>Easy Updates</h3>
		<p>In order to update the version of milk on your site, please run:</p>
		<code>./update.sh</code>
		or
		<code>npm run update</code>
		from the project root.
	</div>
	<div>
		<h3>Running</h3>
		<p>In order to run:</p>
		<code> npm run dev -- --open; </code>
	</div>
	<div>
		<h3>Export for Production</h3>
		<p>In order to export your site, please run:</p>
		<code>npm run export;</code>
	</div>
	<div>
		<h3>Auto Deploy</h3>
		<p>
			Hook a webhook up to your Git repo and set the root to the
			distribution directory.
		</p>
	</div>
</Documentation>

<script>
	/* ## MILK ## */
	import { milk } from '$milk/milk.js';
	/* ## Components ## */
	import Documentation from '$milk_components/Documentation.svelte';
	// import Hero from '$milk_components/Hero.svelte';
	/* ## Variables ## */
	let title;
	let tagline;
	let excerpt;
	let logo;
	$: title ||= $milk?.credits?.title || '';
	$: tagline ||= $milk?.credits?.tagline || '';
	$: excerpt ||= $milk?.credits?.excerpt || '';
	$: logo ||= $milk?.credits?.logo || '';
	/* ## Exports ## */
	export { title, tagline, excerpt, logo };
</script>

<style>
	h4 a,
	.dark-mode h4 a {
		color: var(--color-black);
	}
</style>
