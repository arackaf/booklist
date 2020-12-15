<script lang="ts">
  import cn from "classnames";

  export let item;
  export let name;
  export let onEdit;
  export let expanded;
  export let setExpanded;
  export let childSubjects;

  export let extraStyles = "";
  let className = "";
  export { className as class };

  let extraClasses = className || "";
</script>

<span
  style="background-color: {item.backgroundColor}; color: {item.textColor || 'white'}; {extraStyles}"
  class={'label label-default label-editable-expandable noselect ' + extraClasses}
>
  {#if childSubjects?.length}
    <a
      class={cn('toggle', { expanded })}
      onClick={() => setExpanded(val => !val)}
      style={{ color: item.textColor || 'white', borderRight: `1px solid ${item.textColor || 'white'}` }}
    >
      <i class="fad fa-chevron-right" />
    </a>
  {/if}

  <span>{name}</span>
  {#if $$slots.default}
    <slot></slot>
  {:else}
    {item.name}
  {/if}


  <a onClick={onEdit} style="color: {item.textColor || 'white'}; cursor: pointer; margin-left: 5px;"> <i class="fal fa-pencil-alt" /> </a>
</span>
