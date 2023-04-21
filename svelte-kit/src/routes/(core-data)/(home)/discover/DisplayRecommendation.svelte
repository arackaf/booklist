<script lang="ts">
  import type { Book } from "$data/types";
  import BookCover from "$lib/components/ui/BookCover.svelte";

  export let book: Book;
</script>

<tr>
  <td>
    <BookCover size="small" {book} />
  </td>
  <td>
    <span class="book-title">
      {book.title}
    </span>
    {#if book.authors && book.authors.length}
      <br />
      <span class="book-author">{book.authors.join(", ")}</span>
      <br />
      {#if book.isbn}
        <a target="_new" class="margin-right" href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}>
          <i class="fab fa-amazon" />
        </a>
      {/if}
    {/if}
  </td>
</tr>
