<script lang="ts">
  import type { BookImages, PreviewPacket } from "$data/types";

  type Sizes = "mobile" | "small" | "medium";
  type BookImagesPassed = Partial<BookImages>;

  type Props = {
    style?: string;
    url?: string | null;
    size: Sizes;
    book?: BookImagesPassed | null;
    preview?: string | PreviewPacket | null;
    noCoverMessage?: string;
    imgClasses?: string;
  };

  let { style = "", url = null, size, book = null, preview = null, noCoverMessage = "No Cover", imgClasses = "" }: Props = $props();

  function getPreview() {
    if (preview != null) {
      return preview;
    } else if (book) {
      if (size === "medium") {
        return book.mediumImagePreview!;
      } else if (size === "small") {
        return book.smallImagePreview!;
      } else {
        return book.mobileImagePreview!;
      }
    } else {
      return null;
    }
  }

  const previewToUse = $derived<string | PreviewPacket | null>(getPreview());

  let previewString = $derived(previewToUse == null ? "" : typeof previewToUse === "string" ? previewToUse : previewToUse.b64);
  let sizingStyle = $derived(previewToUse != null && typeof previewToUse === "object" ? `width:${previewToUse.w}px;height:${previewToUse.h}px` : "");
  let urlToUse = $derived(getUrlToUse(book, size, url));

  function getUrlToUse(book: BookImagesPassed | null, size: Sizes, url: string | null) {
    if (!book) {
      return url;
    }

    if (size === "medium") {
      return book.mediumImage;
    } else if (size === "small") {
      return book.smallImage;
    } else {
      return book.mobileImage;
    }
  }

  const noCoverCommonClasses = "bg-secondary border text-muted-foreground text-center";
  function getNoCoverClasses() {
    let result = noCoverCommonClasses + " ";
    if (size === "mobile") {
      result += "w-[35px] h-[53px] pt-2 text-[10px] leading-normal";
    } else if (size === "small") {
      result += "w-[50px] h-[65px] pt-2 text-sm";
    } else {
      result += "w-[106px] h-[131px] pt-5 text-lg";
    }

    return result;
  }
  const noCoverClasses = getNoCoverClasses();
</script>

<div class="overlay-holder overflow-hidden" style={style + sizingStyle}>
  {#if previewString}
    <span class="z-1 blur-sm" style={`background: url('${previewString}') no-repeat; background-size: cover; ${sizingStyle}`}></span>
  {/if}
  {#if urlToUse}
    <img class="z-2 {imgClasses}" alt="Book cover" src={urlToUse} style={sizingStyle} />
  {:else}
    <div class={noCoverClasses}>
      <div>{noCoverMessage}</div>
    </div>
  {/if}
</div>
