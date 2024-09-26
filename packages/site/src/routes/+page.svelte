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

<h1 class="text-3xl font-bold">Search On Site</h1>
<form on:submit|preventDefault={handleSearch}>
	<fieldset role="group">
		<input
			class="input w-full max-w-xs join-item form-control"
			placeholder="Quick search..."
			type="text"
			use:focus
			bind:value={query}
		/>
		<button type="submit">search</button>
	</fieldset>
</form>
