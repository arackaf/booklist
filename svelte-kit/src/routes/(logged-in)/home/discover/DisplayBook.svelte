<script lang="ts">
  import { onMount } from "svelte";
  import { quadIn, quadOut } from "svelte/easing";
  // @ts-ignore
  import { springIn } from "svelte-helpers/spring-transitions";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import type { Book } from "$data/types";

  export let book: Book;

  const SLIDE_IN_SPRING = { stiffness: 0.1, damping: 0.4 };

  const slideIn: any = (node: HTMLElement) => {
    const { duration, tickToValue } = springIn(-25, 0, SLIDE_IN_SPRING);
    return {
      duration: duration,
      css: (t: number) => `opacity: ${quadOut(t)}; transform: translateX(${tickToValue(t)}%)`
    };
  };
  const slideOut: any = (node: HTMLElement) => {
    let height = node.offsetHeight;
    return {
      duration: 200,
      css: (t: number) => `opacity: ${quadIn(t)}; height: ${t * height}px; transform: translateX(${quadIn(1 - t) * 90}%)`
    };
  };

  let ref;
</script>

<div style="overflow: hidden">
  <div bind:this={ref} in:slideIn|local out:slideOut|local>
    <FlowItems>
      <div><button on:click={() => {}} style="cursor: pointer" class="btn btn-xs btn-danger"> Remove </button></div>
      <div style="min-width: 70px">
        <BookCover size="small" preview={book.smallImagePreview} url={book.smallImage} />
      </div>
      <div style="flex: 1">
        <div>{book.title}</div>
        {#if book.authors && book.authors.length}<span style="font-style: italic">{book.authors.join(", ")}</span>{/if}
      </div>
    </FlowItems>
    <hr />
  </div>
</div>
