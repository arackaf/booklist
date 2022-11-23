<script lang="ts">
	import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
	import { onMount } from "svelte";

  import "./styles.scss"
</script>

<h1>Welcome to SvelteKit</h1>
<h2>
  {$page.data.searchProps}
</h2>

<a href="/?val=A">1</a>
<a href="/?val=B">2</a>
<a href="/?val=C">3</a>

<button on:click={() => history.pushState({}, "", "/?val=X")}>Client side 1</button>
<button on:click={() => history.pushState({}, "", "/?val=Y")}>Client side 2</button>
<button on:click={() => history.pushState({}, "", "/?val=Z")}>Client side 3</button>

<div class="x">
  Hi there
  <span>Hello world</span>
</div>

<form method="POST">
  <button>Run mutation</button>
</form>
