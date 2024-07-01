<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import EditBookInfo from "./EditBookInfo.svelte";

  export let book: Book;
  export let subjects: Subject[];
  export let tags: Tag[];

  let basicInfoValid: () => boolean;

  let saving = false;
</script>

{#if book}
  <EditBookInfo bind:validate={basicInfoValid} {saving} {book} {subjects} {tags} />
{/if}
