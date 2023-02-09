<script lang="ts">
  import { page } from "$app/stores";

  $: ({ publicUser } = $page.data);
  $: ({ publicName, publicBooksHeader } = publicUser || {});

  let booksHeader: string;
  $: {
    if (!publicName && !publicBooksHeader) {
      booksHeader = "";
    } else {
      booksHeader = publicBooksHeader || `${publicName}'s Books`;
    }
  }
</script>

<h4>{booksHeader}</h4>

<style>
  h4 {
    margin-right: 5px;
    margin-bottom: 0;
    align-self: center;
  }
</style>
