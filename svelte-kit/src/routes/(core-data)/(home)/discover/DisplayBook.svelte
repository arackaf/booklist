<script lang="ts">
  import { quadIn, quadOut, quintIn, circIn } from "svelte/easing";
  import type { Book } from "$data/types";

  import BookCover from "$lib/components/BookCover.svelte";
  import BookTitle from "$lib/components/BookDisplay/BookTitle.svelte";
  import SubTitleText from "$lib/components/BookDisplay/SubTitleText.svelte";
  import Button from "$lib/components/Button/Button.svelte";

  type Props = {
    book: Book;
    unselectBook: (book: Book) => void;
  };

  let { book, unselectBook }: Props = $props();

  const slideIn: any = () => {
    return {
      duration: 200,
      css: (t: number) => {
        return `opacity: ${quadOut(t)}; transform: translateX(${-25 * quintIn(1 - t)}%)`;
      }
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
  <div in:slideIn out:slideOut>
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
        <Button class="mt-auto self-start" theme="danger" size="sm" onclick={() => unselectBook(book)}>Remove</Button>
      </div>
    </div>
    <hr class="my-2" />
  </div>
</div>
