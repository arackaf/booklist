<script>
  import Auth from "./auth.svelte";
  import Anon from "./anon.svelte";
  import UtilLinks from "./utilLinks.svelte";

  export let data;
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hi</h1>


{#if data.player}
  <Auth {data} />
{:else}
  <Anon {data} />
{/if}

<br />

<UtilLinks {data} />
