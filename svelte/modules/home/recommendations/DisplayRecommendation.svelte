<script lang="ts">
  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";

  export let book;
</script>

<tr>
  <td>
    <CoverSmall url={book.smallImage} />
  </td>
  <td>
    {book.title}
    {#if book.authors && book.authors.length}
      <br />
      <span style="fontStyle: italic">{book.authors.join(', ')}</span>
      <br />
      {#if book.isbn}
        <a target="_new" className="margin-right" href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}>
          <i className="fab fa-amazon" />
        </a>
      {/if}
    {/if}
  </td>
</tr>
