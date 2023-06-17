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

<h4 class="text-lg font-bold mr-1">{booksHeader}</h4>
