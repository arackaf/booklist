<script lang="ts">
  import EditBookInfo from "./EditBookInfo.svelte";

  export let book: any;
</script>

{#if book}
  <EditBookInfo {book} />
{/if}
