<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";

  type Props = {
    ids: number[];
    value: boolean;
    saving?: boolean;
  };

  let { ids, value, saving = $bindable() }: Props = $props();

  const { onBooksUpdated } = getContext("books-module-context") as any;

  const booksUpdated = () => {
    saving = true;
    const idsToUse = ids;

    return async ({ result }: any) => {
      onBooksUpdated(idsToUse, result.data.updates);
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
