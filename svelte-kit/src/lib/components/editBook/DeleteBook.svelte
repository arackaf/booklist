<script lang="ts">
  import { Trash2Icon } from "lucide-svelte";

  import { ajaxUtil } from "$lib/util/ajaxUtil";
  import Button from "$lib/components/ui/button/button.svelte";

  type Props = {
    id: number;
    afterDelete: (id: number) => void;
  };
  const { id, afterDelete = () => {} }: Props = $props();

  let pendingDelete = $state(false);
  let deleting = $state(false);

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
    <Button variant="destructive" size="sm" class="flex gap-1" onclick={() => (pendingDelete = true)}>
      Delete <Trash2Icon />
    </Button>
  {:else}
    <div class="flex gap-3">
      <Button variant="destructive" size="sm" onclick={deleteBook} disabled={deleting}>Confirm Delete</Button>

      <Button variant="outline" size="sm" disabled={deleting} onclick={() => (pendingDelete = false)}>Cancel</Button>
    </div>
  {/if}
</div>
