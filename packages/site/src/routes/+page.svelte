<script lang="ts">
	import { type Bang, parseBang, fingBangItem, getBangURL, getRankedBangs } from 'bangs';

	let query = '';

	function focus(node: HTMLInputElement) {
		node.focus();
	}

	function search(query: string) {
		const r = parseBang(query);
		if (r) {
			const [bang, s] = r;
			const item = fingBangItem(bang);
			if (item) {
				const url = getBangURL(item, s);
				window.open(url);
			}
		} else if (parent) {
			parent.postMessage(
				{
					search: {
						query
					}
				},
				'*'
			);
		}
	}

	function handleSearch() {
		search(query);
	}
</script>

<div class="center">
	<h1>Search On Site</h1>
	<form role="search" on:submit|preventDefault={handleSearch}>
		<input
			type="search"
			placeholder="Enter search query..."
			aria-label="Search"
			list="bangs"
			use:focus
			bind:value={query}
		/>

		<datalist id="bangs">
			{#each getRankedBangs() as bang}
				{@const label = `${bang.s} - ${bang.sc} / ${bang.c}`}
				<option {label} value={'!' + bang.t}>{label}</option>
			{/each}
		</datalist>

		<input type="submit" value="Search" />
	</form>
	<div>
		<p>
			This site utilizes <a href="https://duckduckgo.com/bangs" target="_blank">DuckDuckGo bangs</a
			>, which are shortcuts that enable you to search directly on specific websites. By starting
			your search query with an exclamation mark followed by a site code (for example,
			<b>!w for Wikipedia</b>), you can skip DuckDuckGo and be taken straight to the search results
			page of the desired site. This functionality improves search efficiency and provides a fast
			method to access site-specific information.
		</p>

		<p>
			If you use the <a
				href="https://chromewebstore.google.com/detail/search-on-site/ialmbfdolfbfddhhbpcpfajahojgbglh"
				target="_blank"
			>
				Search On Site
			</a>
			browser extension, you can type any query to search on the specific website using your default
			browser search engine.
		</p>
	</div>
</div>

<style>
	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
</style>
