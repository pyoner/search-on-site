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
					class="input w-full max-w-xs join-item form-control"
					placeholder="Quick search..."
					type="text"
					use:focus
					bind:value={query}
				/>
				<button class="btn btn-primary join-item" type="submit" on:click={handleSearch}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
						/>
					</svg>
				</button>
			</form>
		</div>
	</div>
</div>
