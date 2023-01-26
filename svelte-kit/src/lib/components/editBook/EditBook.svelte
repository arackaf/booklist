<script lang="ts">
  import type { Book, BookCoversEdits, Subject, Tag } from "$data/types";

  import type { UpdatesTo } from "$lib/state/dataUpdates";
  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/tabs/index";
  import EditBookCovers from "./EditBookCovers.svelte";

  import EditBookInfo from "./EditBookInfo.svelte";

  export let book: Book;
  export let cancel: any;
  export let subjects: Subject[];
  export let tags: Tag[];

  export let onBookUpdated: (_id: string, updates: UpdatesTo<Book>) => void;

  let localBookCovers: BookCoversEdits = {};
  const updateLocalBookCovers = (updates: BookCoversEdits) => {
    localBookCovers = { ...localBookCovers, ...updates };
  };

  $: {
    console.log("BOOK CHANGE INNER", book);
  }

  const updateLocalBook = (updates: UpdatesTo<Book>) => {
    book = { ...book, ...updates.fieldsSet };
  };

  $: updateFunction = (_id: string, updates: UpdatesTo<Book>) => {
    onBookUpdated(_id, updates);
    updateLocalBook(updates);
  };

  let resetCovers: () => void;

  let tabsInst: any;
  export const reset = () => {
    tabsInst?.setTab("basic");
    resetCovers?.();
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
        <EditBookInfo {book} {cancel} {subjects} {tags} onSave={updateFunction} fieldAdditions={book?._id ? {} : localBookCovers} />
      {/if}
    </TabContent>
    <TabContent tabName="covers">
      {#if book}
        <EditBookCovers {book} bind:reset={resetCovers} updateUnsavedBook={updateLocalBookCovers} onSave={updateFunction} />
      {/if}
    </TabContent>
    <TabContent tabName="c">C Content</TabContent>
  </TabContents>
</Tabs>
