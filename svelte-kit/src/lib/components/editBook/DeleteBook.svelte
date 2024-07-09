<script lang="ts">
  import { ajaxUtil } from "$lib/util/ajaxUtil";
  import ActionButton from "../Button/ActionButton.svelte";
  import Button from "../Button/Button.svelte";

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
    <Button type="button" size="med" class="flex gap-1" theme="danger" onclick={() => (pendingDelete = true)}>
      Delete <i class={`fal fa-trash-alt fa-fw`}></i>
    </Button>
  {:else}
    <div class="flex gap-3">
      <ActionButton type="button" onclick={deleteBook} running={deleting} theme="danger" size="med">Confirm Delete</ActionButton>

      <Button type="button" size="sm" disabled={deleting} onclick={() => (pendingDelete = false)}>Cancel</Button>
    </div>
  {/if}
</div>
