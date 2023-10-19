<script lang="ts">
  function search(query: string){
    parent.postMessage({search: {
      query
    }}, "*")
  }
  let query = ''
</script>
<h1>Search On Site</h1>
<p><input autofocus type="text" bind:value={query}><button on:click={()=>search(query)}>search</button></p>