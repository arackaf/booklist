<script lang="ts">
	import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
	import { onMount } from "svelte";

</script>

<h1>Welcome to SvelteKit</h1>
<h2>
  {$page.data.searchProps}
</h2>

<a href="/?val=1">1</a>
<a href="/?val=2">2</a>
<a href="/?val=3">3</a>

<button on:click={() => invalidate("search:main")}>Invalidate</button>


