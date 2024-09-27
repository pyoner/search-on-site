<script lang="ts">
	import { type Bang, parseBang, fingBangItem, getBangURL, getRankedBangs } from '$lib/bangs';

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
