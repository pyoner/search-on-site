<script lang="ts">
	import { parseBang, fingBangItem, getBangURL, findBangItemsStartsWith } from '$lib/bangs';

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

	function onInput(value: string) {
		const r = parseBang(value);
		if (r) {
			const [bang, q] = r;
			const items = findBangItemsStartsWith(bang);
			console.table(items);
		}
	}

	let query = '';
	$: if (query.length) {
		console.log(query);
		onInput(query);
	}
</script>

<h1>Search On Site</h1>
<form on:submit|preventDefault={handleSearch}>
	<input type="search" use:focus bind:value={query} />
</form>
