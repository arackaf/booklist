<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import type { UpdatesTo } from "$lib/state/dataUpdates";
  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/tabs/index";
  import EditBookCovers from "./EditBookCovers.svelte";

  import EditBookInfo from "./EditBookInfo.svelte";
  //import ManageBookCover from "./ManageBookCover.svelte";

  export let book: any;
  export let cancel: any;
  export let subjects: Subject[];
  export let tags: Tag[];

  export let onBookUpdated: (_id: string, updates: UpdatesTo<Book>) => void;
  const updateBook = (fn: any) => (book = fn(book));

  let tabsInst: any;
  export const reset = () => {
    tabsInst?.setTab("basic");
  };
</script>

<Tabs bind:this={tabsInst} defaultTab="basic">
  <TabHeaders>
    <TabHeader tabName="basic" text="Book info" />
    <TabHeader tabName="covers" text="Covers" />
  </TabHeaders>
  <TabContents>
    <TabContent tabName="basic">
      {#if book}
        <EditBookInfo {book} {cancel} {subjects} {tags} {onBookUpdated} />
      {/if}
    </TabContent>
    <TabContent tabName="covers">
      {#if book}
        <EditBookCovers {book} {onBookUpdated} />
      {/if}
    </TabContent>
    <TabContent tabName="c">C Content</TabContent>
  </TabContents>
</Tabs>
