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

<div class="mt-8">
  <Separator class="my-4 h-[2px]" />
  {#if children}
    {@render children()}
  {:else}
    <Button variant="secondary" onclick={onHide}>Close</Button>
  {/if}
</div>
