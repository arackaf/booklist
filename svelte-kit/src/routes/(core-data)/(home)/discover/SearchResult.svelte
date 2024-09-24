<script lang="ts">
  import { quadIn } from "svelte/easing";

  import BookCover from "$lib/components/BookCover.svelte";
  import BookTitle from "$lib/components/BookDisplay/BookTitle.svelte";
  import SubTitleText from "$lib/components/BookDisplay/SubTitleText.svelte";
  import Button from "$lib/components/Button/Button.svelte";

  import type { Book } from "$data/types";

  type Props = {
    book: Book;
    selectBook: (book: Book) => void;
  };

  let { book, selectBook }: Props = $props();

  let numberAnimating = $state(0);
  let adding = $state(false);

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
</script>

<div out:slideOut|local style="overflow: hidden">
  <div class="flex">
    <div class="min-w-[60px]">
      <BookCover size="small" {book} />
    </div>

    <div class="flex flex-col flex-1 min-w-0">
      <BookTitle truncate={true}>{book.title}</BookTitle>
      {#if book.authors && book.authors.length}
        <SubTitleText>{book.authors.join(", ")}</SubTitleText>
      {/if}

      <Button theme="primary" size="sm" class="mt-auto self-start gap-2" disabled={adding} onclick={_selectBook}>
        Add to list
        <i class="fal fa-plus"></i>
      </Button>
    </div>
  </div>
  <hr class="my-2" />
</div>
