<script>
  import { getCrossOriginAttribute } from "util/corsHelpers";
  import NoCoverSmall from "./NoCoverSmall.svelte";

  export let url = "";
</script>

{#if url}
  <img alt="Book cover" style="display: block" {...getCrossOriginAttribute(url)} src={url} />
{:else}
  <NoCoverSmall />
{/if}
