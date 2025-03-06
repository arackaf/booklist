<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  type Props = {
    onHide?: () => void;
    children?: Snippet;
  };

  let { onHide = () => {}, children }: Props = $props();
</script>

<div>
  <Separator class="my-4 h-[2px]" />
  {#if children}
    {@render children()}
  {:else}
    <div class="flex">
      <Button class="ml-auto" variant="outline" onclick={onHide}>Close</Button>
    </div>
  {/if}
</div>
