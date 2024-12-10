<script lang="ts">
  import { page } from "$app/stores";

  let { publicUser } = $derived($page.data);
  let { publicName, publicBooksHeader } = $derived(publicUser || {});

  let booksHeader = $derived.by(() => {
    if (!publicName && !publicBooksHeader) {
      return "";
    }
    return publicBooksHeader || `${publicName}'s Books`;
  });
</script>

<h4 class="text-lg font-bold mr-1">{booksHeader}</h4>
