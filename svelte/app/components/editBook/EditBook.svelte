<script lang="ts">
  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/tabs/index";
  import EditBookCovers from "./EditBookCovers.svelte";

  import EditBookInfo from "./EditBookInfo.svelte";
  import ManageBookCover from "./ManageBookCover.svelte";

  export let book: any;
  export let saveBook: any;
  export let cancel: any;

  const updateBook = fn => (book = fn(book));
</script>

<Tabs defaultTab="basic">
  <TabHeaders>
    <TabHeader tabName="basic" text="Book info" />
    <TabHeader tabName="covers" text="Covers" />
  </TabHeaders>
  <TabContents>
    <TabContent tabName="basic">
      {#if book}
        <EditBookInfo {saveBook} {book} {cancel} />
      {/if}
    </TabContent>
    <TabContent tabName="covers">
      {#if book}
        <EditBookCovers />
      {/if}
    </TabContent>
    <TabContent tabName="c">C Content</TabContent>
  </TabContents>
</Tabs>
