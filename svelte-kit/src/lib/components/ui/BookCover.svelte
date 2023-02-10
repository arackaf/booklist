<script lang="ts">
  import type { BookImages, PreviewPacket } from "$data/types";

  type Sizes = "mobile" | "small" | "medium";

  export let style = "";
  export let url: string | null = null;
  export let size: Sizes;
  export let book: BookImages | null = null;

  export let preview: string | PreviewPacket | null = null;
  export let noCoverMessage: string = "No Cover";

  let previewToUse: string | PreviewPacket | null;
  $: {
    if (preview != null) {
      previewToUse = preview;
    } else if (book) {
      previewToUse = size === "medium" ? book.mediumImagePreview : size === "small" ? book.smallImagePreview : book.mobileImagePreview;
    }
  }

  $: previewString = previewToUse == null ? "" : typeof previewToUse === "string" ? previewToUse : previewToUse.b64;
  $: sizingStyle = previewToUse != null && typeof previewToUse === "object" ? `width:${previewToUse.w}px;height:${previewToUse.h}px` : "";

  $: urlToUse = getUrlToUse(book, size, url, sizingStyle);
  function getUrlToUse(book: BookImages | null, size: Sizes, url: string | null, sizingStyle: string) {
    if (!book) {
      return url;
    }
    // we know the exact size
    if (sizingStyle) {
      return book.mediumImage || book.smallImage || book.mobileImage;
    } else {
      return size === "medium" ? book.mediumImage : size === "small" ? book.smallImage : book.mobileImage;
    }
  }
</script>

<div {style}>
  {#if previewString}
    <span class="preview" style={`background: url('${previewString}') no-repeat; background-size: cover; ${sizingStyle}`} />
  {/if}
  {#if urlToUse}
    <img alt="Book cover" src={urlToUse} class="image" style={sizingStyle} />
  {:else}
    <div class="no-cover-{size}">
      <div>{noCoverMessage}</div>
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
