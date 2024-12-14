<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "$lib/components/Button/Button.svelte";

  type Props = {
    onHide?: () => void;
    children?: Snippet;
  };

  let { onHide = () => {}, children }: Props = $props();
</script>

<div class="mt-8">
  <hr class="my-3" />
  {#if children}
    {@render children()}
  {:else}
    <Button onclick={onHide}>Close</Button>
  {/if}
</div>
