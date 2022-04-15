<script lang="ts">
  import CoverPreviewCanvas from "./CoverPreviewCanvas.svelte";

  export let loaded: boolean;
  export let preview: string | { blurhash: string; w: number; h: number };
</script>

{#if !loaded}
  {#if typeof preview === "string"}
    <img alt="Book cover preview" src={preview} style="display: block" />
  {:else if preview && typeof preview === "object"}
    <CoverPreviewCanvas {preview} />
  {/if}
{/if}
