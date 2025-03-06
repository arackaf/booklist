<script lang="ts">
  import { enhance } from "$app/forms";

  import type { Book, Subject, Tag } from "$data/types";

  import * as Tabs from "$lib/components/ui/tabs";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import { cn } from "$lib/utils";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import EditBookCovers from "./EditBookCovers.svelte";
  import EditBookInfo from "./EditBookInfo.svelte";
  import DeleteBook from "./DeleteBook.svelte";
  import { CircleAlertIcon } from "lucide-svelte";

  type Props = {
    book: Book;
    subjects: Subject[];
    tags: Tag[];

    onCancel: () => void;
    syncUpdates: (id: number, updates: UpdatesTo<Book>) => void;

    afterDelete: (id: number) => void;
  };

  let { book, subjects, tags, onCancel, syncUpdates, afterDelete = () => {} }: Props = $props();

  let editingBook = $state<Book>();
  $effect(() => {
    editingBook = $state.snapshot(book);
  });

  let saving = $state(false);
  let tab = $state<string>("basic");
  let saveAttempted = $state(false);

  function executeSave({ cancel, formData: data }: any) {
    saveAttempted = true;
    if (!data.get("title").trim()) {
      return cancel();
    }

    const id = +data.get("id");

    saving = true;
    return async ({ result }: any) => {
      const updates: UpdatesTo<Book> = result.data.updates;

      saving = false;
      syncUpdates(id, updates);
      window.dispatchEvent(new CustomEvent("reload-user-summary"));
      saveAttempted = false;
    };
  }
</script>

<form method="post" action="/books?/saveBook" use:enhance={executeSave}>
  <input type="hidden" name="id" value={book?.id ?? null} />
  <Tabs.Root bind:value={tab}>
    <Tabs.List class={cn("w-full grid gap-2", book?.id ? "grid-cols-3" : "grid-cols-2")}>
      <Tabs.Trigger value="basic">Book info</Tabs.Trigger>
      <Tabs.Trigger value="covers">Covers</Tabs.Trigger>
      {#if book?.id}
        <Tabs.Trigger value="delete" class="flex items-center gap-2">Delete <CircleAlertIcon class="text-red-600" size="18" /></Tabs.Trigger>
      {/if}
    </Tabs.List>
    <Tabs.Content value="basic">
      {#if editingBook}
        <EditBookInfo {saveAttempted} {saving} book={editingBook} {subjects} {tags} />
      {/if}
    </Tabs.Content>
    <Tabs.Content value="covers">
      {#if book}
        <EditBookCovers {book} />
      {/if}
    </Tabs.Content>

    <Tabs.Content value="delete">
      {#if book?.id}
        <DeleteBook id={book?.id} {afterDelete} />
      {/if}
    </Tabs.Content>
  </Tabs.Root>

  <Separator class="my-4 h-[2px]" />

  <div class="flex flex-row">
    <Button disabled={tab === "delete" || saving} type="submit">Save</Button>
    <Button variant="outline" disabled={saving} class="ml-auto" type="button" onclick={onCancel}>Cancel</Button>
  </div>
</form>
