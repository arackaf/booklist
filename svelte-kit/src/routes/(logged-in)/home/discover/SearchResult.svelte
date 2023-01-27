<script lang="ts">
  import { getContext } from "svelte";
  import { quadIn } from "svelte/easing";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";
  import type { Book } from "$data/types";

  let numberAnimating = 0;
  const modalContext: any = getContext("svelte-helpers-modal");

  export let book: Book;
  let adding = false;

  const selectBook = () => {
    adding = true;
    ++numberAnimating;
    //dispatch(["selectBook", book]);
  };

  const slideOut: any = (node: HTMLElement) => {
    let height = node.offsetHeight;
    return {
      duration: 200,
      css: (t: number) => `opacity: ${quadIn(t)}; height: ${t * height}px; transform: translateX(${quadIn(1 - t) * 90}%)`
    };
  };

  const leaving = () => modalContext.isAnimatingResizing.set(!numberAnimating);
  const left = () => adding && setTimeout(() => modalContext.isAnimatingResizing.set(!--numberAnimating), 1);
</script>

<li on:outrostart={leaving} on:outroend={left} out:slideOut|local style="overflow: hidden">
  <div>
    <Stack>
      <FlowItems>
        <div style="min-width: 70px">
          <BookCover size="small" url={book.smallImage} preview={book.smallImagePreview} />
        </div>

        <Stack style="flex: 1; justify-content: space-between">
          <div>
            <div>{book.title}</div>
            {#if book.authors && book.authors.length}
              <div style="font-style: italic; font-size: 14px">{book.authors.join(", ")}</div>
            {/if}
          </div>
          <button
            disabled={adding}
            on:click={selectBook}
            style="cursor: pointer; margin-top: auto; align-self: flex-start"
            class="btn btn-primary btn-xs"
          >
            Add to list&nbsp;
            <i class="fal fa-plus" />
          </button>
        </Stack>
      </FlowItems>
      <hr />
    </Stack>
  </div>
</li>
