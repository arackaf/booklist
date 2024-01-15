<script lang="ts">
  import { quadIn, quadOut } from "svelte/easing";
  import { springIn } from "svelte-helpers/spring-transitions";
  import type { Book } from "$data/types";

  import BookCover from "$lib/components/BookCover.svelte";
  import BookTitle from "$lib/components/BookDisplay/BookTitle.svelte";
  import SubTitleText from "$lib/components/BookDisplay/SubTitleText.svelte";
  import Button from "$lib/components/Button/Button.svelte";

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
    <div class="flex flex-row">
      <div class="min-w-[60px]">
        <BookCover size="small" {book} />
      </div>
      <div class="flex-1 flex flex-col min-w-0">
        <BookTitle truncate={true}>{book.title}</BookTitle>
        {#if book.authors && book.authors.length}
          <SubTitleText>
            {book.authors.join(", ")}
          </SubTitleText>
        {/if}
        <Button class="mt-auto self-start" theme="danger" size="sm" on:click={() => unselectBook(book)}>Remove</Button>
      </div>
    </div>
    <hr class="my-2" />
  </div>
</div>
