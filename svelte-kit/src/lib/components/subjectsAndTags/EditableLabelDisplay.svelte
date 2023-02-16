<script lang="ts">
  import type { Label } from "$data/types";
  import cn from "classnames";

  export let item: Label;
  export let onEdit: () => void;
  export let expanded: boolean;
  export let setExpanded: (val: boolean) => void;
  export let childSubjects: Label[];

  $: textColor = item.textColor || "white";
</script>

<span style="background-color: {item.backgroundColor}; color: {textColor};" class="label label-default label-editable-expandable noselect ">
  {#if childSubjects?.length}
    <button
      class={cn("toggle raw-button", { expanded })}
      on:click={() => setExpanded(!expanded)}
      style="color: {textColor}; border-right: {`var(--default-border-width) solid ${textColor}`}"
    >
      <i class="fad fa-chevron-right" />
    </button>
  {/if}

  {#if $$slots.default}
    <slot />
  {:else}
    {item.name}
  {/if}

  <button class="raw-button" on:click={onEdit} style="color: {textColor}; cursor: pointer; margin-left: 5px;">
    <i class="fal fa-pencil-alt" />
  </button>
</span>
