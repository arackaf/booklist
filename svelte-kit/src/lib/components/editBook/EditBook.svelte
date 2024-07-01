<script lang="ts">
  import type { Book } from "$data/types";

  import EditBookInfo from "./EditBookInfo.svelte";

  export let book: Book;

  let basicInfoValid: () => boolean;

  let saving = false;
</script>

{#if book}
  <EditBookInfo {saving} {book} />
{/if}
