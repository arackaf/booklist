<script lang="ts">
  import type { Snippet } from "svelte";
  import { XIcon } from "lucide-svelte";

  import Badge from "$lib/components/ui/badge/badge.svelte";
  import type { Label as LabelType } from "./types";

  type Props = {
    item?: Partial<LabelType> | null;
    doRemove?: () => void;
    href?: string;
    disabled?: boolean;
    children?: Snippet;
  };

  let { item = null, doRemove = () => {}, href = "", disabled = false, children }: Props = $props();
</script>

<Badge
  class="bg-neutral-500 text-white flex gap-1 px-2 text-xs leading-none"
  style={item?.backgroundColor && item?.textColor ? `background-color: ${item.backgroundColor}; color: ${item.textColor};` : ""}
>
  {#if href}
    <a {href} class="font-bold text-inherit" style="font-size: inherit"><XIcon size="12" /></a>
  {:else}
    <button
      type="button"
      {disabled}
      onclick={doRemove}
      class="raw-button font-bold"
      class:cursor-pointer={!disabled}
      style="font-size: inherit; color: inherit;"
    >
      <XIcon size="12" />
    </button>
  {/if}

  {#if children}
    {@render children()}
  {:else}
    {item?.name}
  {/if}
</Badge>
