<script lang="ts">
  import { page } from "$app/stores";
	import { onMount } from "svelte";

  onMount(() => {
    //console.log("Mount");
    //console.log({ page: $page })
  })

  //$: console.log({ page: $page });

  function go() { 
    window.history.pushState({}, "/?val=1", "/?val=11")
  }
</script>

<h1>Welcome to SvelteKit</h1>
<h2>
  {$page.data.searchProps}
</h2>

<a href="/?val=1">1</a>
<a href="/?val=2">2</a>
<a href="/?val=3">3</a>

<a href="/foo?val=4">foo</a>

<form method="GET" action="?/search">
  <input name="val"  />

  <button type="submit">Go maybe?</button>
</form>