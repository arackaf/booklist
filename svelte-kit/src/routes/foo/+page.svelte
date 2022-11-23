<script lang="ts">
  import { page } from "$app/stores";
	import { onMount } from "svelte";

  onMount(() => {
    console.log("Mount");
    console.log({ page: $page })
  })
</script>

<h1>Welcome to SvelteKit / foo</h1>

{$page.data.searchProps}

<a href="/?val=1">1</a>
<a href="/?val=2">2</a>
<a href="/foo?val=3">3</a>
<a href="/foo?val=4">4</a>
