<script lang="ts">
  import type { PreviewPacket } from "$data/types";

  export let url: string | null = null;
  export let preview: string | PreviewPacket | null | undefined = null;
  export let size: "mobile" | "small" | "medium";

  $: previewString = preview == null ? "" : typeof preview === "string" ? preview : preview.b64;
  $: sizingStyle = preview != null && typeof preview === "object" ? `width:${preview.w}px;height:${preview.h}px` : "";
</script>

<div>
  {#if previewString}
    <img alt="Book cover preview" src={previewString} style={sizingStyle} class="preview" />
  {/if}
  {#if url}
    <img alt="Book cover" src={url} class="image" />
  {:else}
    <div class="no-cover-{size}">
      <div>No Cover</div>
    </div>
  {/if}
</div>

<style>
  div {
    display: inline-grid;
    grid-template-areas: "content";
    overflow: hidden;
  }
  div > * {
    grid-area: content;
  }

  .preview {
    z-index: 1;
    filter: blur(5px);
  }
  .image {
    z-index: 2;
  }
</style>
