<script lang="ts">
  import cn from "classnames";

  import Label from "$lib/components/form-elements/Label/Label.svelte";
  import type { Label as LabelType } from "$data/types";

  export let item: LabelType;
  export let onEdit: () => void;
  export let expanded: boolean;
  export let setExpanded: (val: boolean) => void;
  export let childSubjects: LabelType[];

  $: textColor = item.textColor || "white";
</script>

<Label colors={item} class="inline-flex gap-2">
  {#if childSubjects?.length}
    <button class={cn("toggle raw-button", { expanded })} on:click={() => setExpanded(!expanded)} style="color: {textColor};}">
      <i class="fad fa-chevron-right" class:rotate-90={expanded}></i>
    </button>
    <span style="border-left: 1px solid {textColor}"></span>
  {/if}

  {#if $$slots.default}
    <slot />
  {:else}
    {item.name}
  {/if}

  <button class="raw-button" on:click={onEdit} style="color: {textColor}; cursor: pointer;">
    <i class="fal fa-pencil-alt"></i>
  </button>
</Label>
