<script lang="ts">
  import type { Label } from "$data/types";
  import type { SubjectOrTagSummaryEntry } from "$data/user-summary";
  import { toHash } from "$lib/state/helpers";

  export let packet: SubjectOrTagSummaryEntry;
  export let label: "MAX-S" | "MIN-S" | "MAX-T" | "MIN-T";
  export let items: Label[];

  $: itemLookup = toHash(items);
  $: itemsToDisplay = packet.ids.map(id => itemLookup[id]).filter(x => x);

  let labelToDisplay: string;
  $: {
    let prefix = label.startsWith("MAX") ? "Most" : "Least";
    let itemDisplay = label.endsWith("S") ? "subject" : "tag";
    let bookDisplay = `${packet.books} book${packet.books > 1 ? "s" : ""}`;
    if (itemsToDisplay.length > 1) {
      itemDisplay += "s";
    }

    labelToDisplay = `${prefix} popular popular popular ${itemDisplay} with ${bookDisplay}`;
  }
</script>

<div class="flex flex-col">
  <span>{labelToDisplay}</span>
  <div class="ml-auto">
    {#each itemsToDisplay as x}
      <span>{x.name}</span>
    {/each}
  </div>
</div>
