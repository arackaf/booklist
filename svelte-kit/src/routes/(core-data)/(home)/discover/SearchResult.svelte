<script lang="ts">
  import { getContext } from "svelte";
  import { quadIn } from "svelte/easing";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import BookTitle from "$lib/components/ui/BookDisplay/BookTitle.svelte";
  import SubTitleText from "$lib/components/ui/BookDisplay/SubTitleText.svelte";

  import type { Book } from "$data/types";

  let numberAnimating = 0;
  const modalContext: any = getContext("svelte-helpers-modal");

  export let book: Book;
  export let selectBook: (book: Book) => void;
  let adding = false;

  const _selectBook = () => {
    adding = true;
    ++numberAnimating;
    selectBook(book);
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

<div on:outrostart={leaving} on:outroend={left} out:slideOut|local style="overflow: hidden">
  <div class="flex">
    <div class="min-w-[60px]">
      <BookCover size="small" {book} />
    </div>

    <div class="flex flex-col flex-1 min-w-0">
      <BookTitle truncate={true}>{book.title}</BookTitle>
      {#if book.authors && book.authors.length}
        <SubTitleText>{book.authors.join(", ")}</SubTitleText>
      {/if}

      <button
        disabled={adding}
        on:click={_selectBook}
        style="cursor: pointer; margin-top: auto; align-self: flex-start"
        class="btn btn-primary btn-xs"
      >
        Add to list&nbsp;
        <i class="fal fa-plus" />
      </button>
    </div>
  </div>
  <hr class="my-2" />
</div>
