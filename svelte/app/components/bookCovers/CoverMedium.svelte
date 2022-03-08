<script>
  import { getCrossOriginAttribute } from "util/corsHelpers";
  import NoCoverMedium from "./NoCoverMedium.svelte";
  export let url = "";
</script>

{#if url}
  <img alt="Book cover" style="display: block" {...getCrossOriginAttribute(url)} src={url} />
{:else}
  <NoCoverMedium />
{/if}
