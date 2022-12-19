<script lang="ts">
  import type { PreviewPacket } from "$data/types";

  export let url: string | null = null;
  export let preview: string | PreviewPacket | null;

  $: previewString = preview == null ? "" : typeof preview === "string" ? preview : preview.b64;

  $: style = preview != null && typeof preview === "object" ? `width:${preview.w}px;height:${preview.h}px` : "";
</script>

<div>
  <img alt="Book cover preview" src={previewString} data-slot="preview" style={"border-radius:2px;" + style} class="preview" />
  <img alt="Book cover" src={url} data-slot="image" class="image" />
</div>

<style>
  div {
    display: grid;
    grid-template-areas: "content";
  }
  div > * {
    grid-area: content;
  }

  .preview {
    z-index: 1;
  }
  .image {
    z-index: 2;
  }
</style>
