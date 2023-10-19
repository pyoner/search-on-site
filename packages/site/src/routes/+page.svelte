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
<h1>Search On Site</h1>
<form on:submit|preventDefault={handleSearch}>
  <input type="text" use:focus bind:value={query} >
  <button type="submit" on:click={handleSearch}>search</button>
</form>