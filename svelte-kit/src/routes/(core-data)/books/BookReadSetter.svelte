<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";

  export let ids: number[];
  export let value: boolean;
  export let onSave: () => void = () => {};

  export let saving: boolean | undefined = false;
  const { onBooksUpdated } = getContext("books-module-context") as any;

  const booksUpdated = () => {
    saving = true;
    const idsToUse = ids;

    return async ({ result }: any) => {
      onBooksUpdated(idsToUse, result.data.updates);
      onSave?.();
      saving = void 0;
    };
  };
</script>

<form method="POST" action="?/setBooksRead" class="contents" use:enhance={booksUpdated}>
  {#each ids as id}
    <input type="hidden" name="ids" value={id} />
  {/each}
  <input type="hidden" name="read" value={value ? "true" : "false"} />
  <slot />
</form>
