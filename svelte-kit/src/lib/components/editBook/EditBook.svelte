<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import EditBookInfo from "./EditBookInfo.svelte";

  export let book: Book;

  let basicInfoValid: () => boolean;

  let saving = false;
</script>

{#if book}
  <EditBookInfo bind:validate={basicInfoValid} {saving} {book} />
{/if}
