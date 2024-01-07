<script lang="ts">
  import { ajaxUtil } from "$lib/util/ajaxUtil";
  import ActionButton from "../ui/Button/ActionButton.svelte";
  import Button from "../ui/Button/Button.svelte";

  export let id: number;
  export let afterDelete: (id: number) => void = () => {};

  let pendingDelete = false;
  let deleting = false;

  const deleteBook = async () => {
    deleting = true;

    const result = await ajaxUtil.post("/api/book-delete", { id });

    if (result.success) {
      afterDelete(id);
    }
  };
</script>

<div class="mt-2 leading-none">
  {#if !pendingDelete}
    <Button type="button" size="med" class="flex gap-1" theme="danger" on:click={() => (pendingDelete = true)}>
      Delete <i class={`fal fa-trash-alt fa-fw`} />
    </Button>
  {:else}
    <div class="flex gap-3">
      <ActionButton type="button" on:click={deleteBook} running={deleting} theme="danger" size="med">Confirm Delete</ActionButton>

      <Button type="button" size="sm" disabled={deleting} on:click={() => (pendingDelete = false)}>Cancel</Button>
    </div>
  {/if}
</div>
