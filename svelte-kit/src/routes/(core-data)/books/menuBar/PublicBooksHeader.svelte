<script lang="ts">
  import { page } from "$app/stores";

  $: ({ publicName, publicBooksHeader } = $page.data);

  $: booksHeader = publicBooksHeader || `${publicName}'s Books`;
</script>

<h4>{booksHeader}</h4>

<style>
  h4 {
    margin-right: 5px;
    margin-bottom: 0;
    align-self: center;
  }
</style>
