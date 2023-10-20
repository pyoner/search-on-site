<script lang="ts">
    
  function focus (node: HTMLInputElement) {
    node.focus();
  }

  function search(query: string){
    parent.postMessage({search: {
      query
    }}, "*")
  }

  function handleSearch() {
    search(query)
  }

  let query = ''
</script>

<div class="container mx-auto px-4 prose">
  <h3>Search On Site</h3>
  <form on:submit|preventDefault={handleSearch}>
    <input class="input input-bordered w-full max-w-xs" type="text" use:focus bind:value={query} >
    <button class="btn" type="submit" on:click={handleSearch}>search</button>
  </form>
</div>