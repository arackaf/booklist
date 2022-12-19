<script lang="ts">
  import type { PreviewPacket } from "$data/types";

  export let url: string | null = null;
  export let preview: string | PreviewPacket | null;

  $: previewString = preview == null ? "" : typeof preview === "string" ? preview : preview.b64;
  $: sizingStyle = preview != null && typeof preview === "object" ? `width:${preview.w}px;height:${preview.h}px` : "";
</script>

<div>
  <img alt="Book cover preview" src={previewString} style={sizingStyle} class="preview" />
  <img alt="Book cover" src={url} class="image" />
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
