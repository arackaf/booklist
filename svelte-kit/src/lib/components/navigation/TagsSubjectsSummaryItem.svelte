<script lang="ts">
  import type { Label } from "$data/types";
  import type { SubjectOrTagSummaryEntry } from "$data/user-summary";
  import { toHash } from "$lib/state/helpers";
  import LabelDisplay from "../subjectsAndTags/LabelDisplay.svelte";

  export let packet: SubjectOrTagSummaryEntry;
  export let label: "UNUSED-S" | "MAX-S" | "MIN-S" | "UNUSED-T" | "MAX-T" | "MIN-T";
  export let items: Label[];

  $: itemLookup = toHash(items);
  $: itemsToDisplay = packet.ids.map(id => itemLookup[id]).filter(x => x);

  let labelToDisplay: string;
  $: {
    let itemDisplay = label.endsWith("S") ? "subject" : "tag";
    if (itemsToDisplay.length > 1) {
      itemDisplay += "s";
    }

    if (label.startsWith("UNUSED")) {
      labelToDisplay = `Unused ${itemDisplay}`;
    } else {
      let prefix = label.startsWith("MAX") ? "Most" : "Least";
      let bookDisplay = `${packet.books} book${packet.books > 1 ? "s" : ""}`;

      labelToDisplay = `${prefix} popular ${itemDisplay} with ${bookDisplay}`;
    }
  }
</script>

<div class="flex flex-col">
  <span>{labelToDisplay}</span>
  <div class="flex flex-wrap gap-1">
    {#each itemsToDisplay as x}
      <LabelDisplay item={x} />
    {/each}
  </div>
</div>
