<script lang="ts">
  import cn from "classnames";

  import Label from "$lib/components/form-elements/Label/Label.svelte";
  import type { Label as LabelType } from "$data/types";

  type Props = {
    item: LabelType;
    onEdit: () => void;
    expanded: boolean;
    setExpanded: (val: boolean) => void;
    childSubjects: LabelType[];
  };

  let { item, onEdit, expanded, setExpanded, childSubjects }: Props = $props();

  const textColor = $derived(item.textColor || "white");
</script>

<Label colors={item} class="inline-flex gap-2">
  {#if childSubjects?.length}
    <button class={cn("toggle raw-button", { expanded })} onclick={() => setExpanded(!expanded)} style="color: {textColor};}" aria-label="Expand">
      <i class="fad fa-chevron-right" class:rotate-90={expanded}></i>
    </button>
    <span style="border-left: 1px solid {textColor}"></span>
  {/if}

  {item.name}

  <button class="raw-button" onclick={onEdit} style="color: {textColor}; cursor: pointer;" aria-label="Edit">
    <i class="fal fa-pencil-alt"></i>
  </button>
</Label>
