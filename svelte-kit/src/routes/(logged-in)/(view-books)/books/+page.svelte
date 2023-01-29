<script lang="ts">
  import type { PageData } from "./$types";
  import RenderBooksPage from "./RenderBooksPage.svelte";

  export let data: PageData;
</script>

<RenderBooksPage {data} />
