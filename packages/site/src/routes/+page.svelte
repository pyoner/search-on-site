<script lang="ts">
	function focus(node: HTMLInputElement) {
		node.focus();
	}

	function search(query: string) {
		parent.postMessage(
			{
				search: {
					query
				}
			},
			'*'
		);
	}

	function handleSearch() {
		search(query);
	}

	let query = '';
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-3xl font-bold">Search On Site</h1>
			<form on:submit|preventDefault={handleSearch} class="join py-6">
				<input
					class="input input-bordered w-full max-w-xs join-item form-control"
					placeholder="Enter your query"
					type="text"
					use:focus
					bind:value={query}
				/>
				<button class="btn btn-primary join-item" type="submit" on:click={handleSearch}
					>search</button
				>
			</form>
		</div>
	</div>
</div>
