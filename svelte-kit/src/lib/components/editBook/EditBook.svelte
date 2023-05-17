<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Book, Subject, Tag } from "$data/types";

  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import EditBookCovers from "./EditBookCovers.svelte";
  import EditBookInfo from "./EditBookInfo.svelte";

  import ActionButton from "../buttons/ActionButton.svelte";
  import Button from "../buttons/Button.svelte";
  import FlowItems from "../layout/FlowItems.svelte";
  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/tabs/index";

  export let book: Book;
  export let subjects: Subject[];
  export let tags: Tag[];

  export let onCancel: () => void;
  export let syncUpdates: (id: number, updates: UpdatesTo<Book>) => void;

  let basicInfoValid: () => boolean;

  let saving = false;
  function executeSave({ cancel, data }: any) {
    if (!basicInfoValid()) {
      return cancel();
    }

    const id = +data.get("id");

    saving = true;
    return async ({ result }: any) => {
      const updates: UpdatesTo<Book> = result.data.updates;

      saving = false;
      syncUpdates(id, updates);
    };
  }

  let init: () => void;
  let setTab: (tab: string) => void;
  let resetCovers: () => void;

  export const reset = () => {
    setTab("basic");
    resetCovers();
    init();
  };
</script>

<form method="post" action="/books?/saveBook" use:enhance={executeSave}>
  <input type="hidden" name="id" value={book?.id ?? null} />
  <Tabs bind:setTab defaultTab="basic">
    <TabHeaders>
      <TabHeader tabName="basic">Book info</TabHeader>
      <TabHeader tabName="covers">Covers</TabHeader>
    </TabHeaders>
    <TabContents>
      <TabContent tabName="basic">
        {#if book}
          <EditBookInfo bind:validate={basicInfoValid} bind:init {saving} {book} {subjects} {tags} />
        {/if}
      </TabContent>
      <TabContent tabName="covers">
        {#if book}
          <EditBookCovers {book} bind:reset={resetCovers} />
        {/if}
      </TabContent>
    </TabContents>
  </Tabs>

  <hr class="my-3" />
  <div class="flex flex-row">
    <ActionButton type="submit" style="min-width: 10ch" isRunning={saving} finishedText="Saved" text="Save" preset="primary" runningText="Saving" />
    <Button disabled={saving} class="ml-auto" type="button" onClick={onCancel}>Cancel</Button>
  </div>
</form>
