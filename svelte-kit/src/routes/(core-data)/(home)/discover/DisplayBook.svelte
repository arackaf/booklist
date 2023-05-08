<script lang="ts">
  import { quadIn, quadOut } from "svelte/easing";
  import { springIn } from "svelte-helpers/spring-transitions";
  import type { Book } from "$data/types";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import BookTitle from "$lib/components/ui/BookDisplay/BookTitle.svelte";
  import BookAuthor from "$lib/components/ui/BookDisplay/BookAuthor.svelte";

  export let book: Book;
  export let unselectBook: (book: Book) => void;

  const SLIDE_IN_SPRING = { stiffness: 0.1, damping: 0.4 };

  const slideIn: any = () => {
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
</script>

<div style="overflow: hidden">
  <div in:slideIn|local out:slideOut|local>
    <FlowItems>
      <div><button on:click={() => unselectBook(book)} style="cursor: pointer" class="btn btn-xs btn-danger"> Remove </button></div>
      <div style="min-width: 70px">
        <BookCover size="small" {book} />
      </div>
      <div style="flex: 1">
        <BookTitle>{book.title}</BookTitle>
        {#if book.authors && book.authors.length}
          <BookAuthor>
            {book.authors.join(", ")}
          </BookAuthor>
        {/if}
      </div>
    </FlowItems>
    <hr class="my-2" />
  </div>
</div>
