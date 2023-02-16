<script lang="ts">
  import type { Label } from "$data/types";
  import cn from "classnames";

  export let item: Label;
  export let onEdit: () => void;
  export let expanded: boolean;
  export let setExpanded: (val: boolean) => void;
  export let childSubjects: Label[];

  export let extraStyles = "";
  let className = "";
  export { className as class };

  let extraClasses = className || "";
</script>

<span
  style="background-color: {item.backgroundColor}; color: {item.textColor || 'white'}; {extraStyles}"
  class={"label label-default label-editable-expandable noselect " + extraClasses}
>
  {#if childSubjects?.length}
    <a
      class={cn("toggle", { expanded })}
      on:click={() => setExpanded(!expanded)}
      style="color: {item.textColor || 'white'}; border-right: {`var(--default-border-width) solid ${item.textColor || 'white'}`}"
    >
      <i class="fad fa-chevron-right" />
    </a>
  {/if}

  {#if $$slots.default}
    <slot />
  {:else}{item.name}{/if}

  <a on:click={onEdit} style="color: {item.textColor || 'white'}; cursor: pointer; margin-left: 5px;"> <i class="fal fa-pencil-alt" /> </a>
</span>
