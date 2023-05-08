<script lang="ts">
  import type { Book } from "$data/types";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import BookTitle from "$lib/components/ui/BookDisplay/BookTitle.svelte";
  import BookAuthor from "$lib/components/ui/BookDisplay/BookAuthor.svelte";

  export let book: Book;
</script>

<tr>
  <td>
    <BookCover size="small" {book} />
  </td>
  <td>
    <BookTitle>
      {book.title}
    </BookTitle>
    {#if book.authors && book.authors.length}
      <BookAuthor>{book.authors.join(", ")}</BookAuthor>

      {#if book.isbn}
        <a target="_new" class="margin-right" href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}>
          <i class="fab fa-amazon" />
        </a>
      {/if}
    {/if}
  </td>
</tr>
