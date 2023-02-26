<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";

  export let ids: string[];
  export let value: boolean;
  export let onSave: () => void = () => {};

  export let saving: boolean | undefined = false;
  const { onBooksUpdated } = getContext("books-module-context") as any;

  const booksUpdated = () => {
    saving = true;
    const _idsToUse = ids;
    return async ({ result }: any) => {
      onBooksUpdated(_idsToUse, result.data.updates);
      onSave?.();
      saving = void 0;
    };
  };
</script>

<form method="POST" action="?/setBooksRead" use:enhance={booksUpdated}>
  {#each ids as id}
    <input type="hidden" name="_ids" value={id} />
  {/each}
  <input type="hidden" name="read" value={value ? "true" : "false"} />
  <slot />
</form>
