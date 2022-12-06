<script lang="ts">
  import type { Tag } from "$data/types";
  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/tabs/index";
  //import EditBookCovers from "./EditBookCovers.svelte";

  import EditBookInfo from "./EditBookInfo.svelte";
  //import ManageBookCover from "./ManageBookCover.svelte";

  export let book: any;
  export let cancel: any;
  export let tags: Tag[];

  const updateBook = (fn: any) => (book = fn(book));
</script>

<Tabs defaultTab="basic">
  <TabHeaders>
    <TabHeader tabName="basic" text="Book info" />
    <TabHeader tabName="covers" text="Covers" />
  </TabHeaders>
  <TabContents>
    <TabContent tabName="basic">
      {#if book}
        <EditBookInfo {book} {cancel} {tags} />
      {/if}
    </TabContent>
    <TabContent tabName="covers">
      <!-- {#if book}
        <EditBookCovers {book} {updateBook} />
      {/if} -->
    </TabContent>
    <TabContent tabName="c">C Content</TabContent>
  </TabContents>
</Tabs>
