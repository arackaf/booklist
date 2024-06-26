<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";

  import type { Book, Subject, Tag } from "$data/types";

  import Button from "$lib/components/Button/Button.svelte";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import EditBookCovers from "./EditBookCovers.svelte";
  import EditBookInfo from "./EditBookInfo.svelte";

  import ActionButton from "$lib/components/Button/ActionButton.svelte";

  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/tabs/index";
  import DeleteBook from "./DeleteBook.svelte";

  export let book: Book;
  export let subjects: Subject[];
  export let tags: Tag[];

  export let onCancel: () => void;
  export let syncUpdates: (id: number, updates: UpdatesTo<Book>) => void;

  export let afterDelete: (id: number) => void = () => {};

  let basicInfoValid: () => boolean;

  let saving = false;
  function executeSave({ cancel, formData: data }: any) {
    if (!basicInfoValid()) {
      return cancel();
    }

    const id = +data.get("id");

    saving = true;
    return async ({ result }: any) => {
      const updates: UpdatesTo<Book> = result.data.updates;

      saving = false;
      syncUpdates(id, updates);
      window.dispatchEvent(new CustomEvent("reload-user-summary"));
    };
  }

  let tab;
</script>

<form method="post" action="/books?/saveBook" use:enhance={executeSave}>
  <input type="hidden" name="id" value={book?.id ?? null} />
  <Tabs bind:currentTab={tab} defaultTab="basic">
    <TabHeaders>
      <TabHeader tabName="basic">Book info</TabHeader>
      <TabHeader tabName="covers">Covers</TabHeader>
      {#if book?.id}
        <TabHeader tabName="delete" class="text-red-600">Delete</TabHeader>
      {/if}
    </TabHeaders>
    <TabContents>
      <TabContent tabName="basic">
        {#if book}
          <EditBookInfo bind:validate={basicInfoValid} {saving} {book} {subjects} {tags} />
        {/if}
      </TabContent>
      <TabContent tabName="covers">
        {#if book}
          <EditBookCovers {book} />
        {/if}
      </TabContent>
      <TabContent tabName="delete">
        {#if book?.id}
          <DeleteBook id={book?.id} {afterDelete} />
        {/if}
      </TabContent>
    </TabContents>
  </Tabs>

  <hr class="my-3" />
  <div class="flex flex-row">
    <ActionButton disabled={tab === "delete"} theme="primary" type="submit" running={saving}>Save</ActionButton>
    <Button disabled={saving} class="ml-auto" type="button" on:click={onCancel}>Cancel</Button>
  </div>
</form>
