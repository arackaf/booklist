<script lang="ts">
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button/Button.svelte";

  import BookDisplay from "./BookDisplay.svelte";
  import SimilarBooks from "./SimilarBooks.svelte";

  export let data;

  let currentlyChecked = !!$page.url.searchParams.get("my-books");

  $: ({ books } = data);
</script>

<section>
  <form action="/admin/similar-books">
    <label class="checkbox">
      <input type="checkbox" name="my-books" value="true" checked={currentlyChecked} />
      Only show my books
    </label>
    <Button theme="primary">Search</Button>
  </form>
  <div class="list">
    {#each books as book}
      <div class="flex flex-col lg:flex-row gap-3 mb-3 p-4 rounded border border-neutral-400">
        <BookDisplay {book} />
        <div class="flex-1 flex flex-col overflow-hidden">
          <SimilarBooks {book} />
        </div>
      </div>
    {/each}
  </div>
</section>
