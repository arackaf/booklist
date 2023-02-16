<script lang="ts">
  import { searchState } from "../state/searchState";

  const simpleFields = ["publisher", "author"] as (keyof typeof $searchState)[];
</script>

{#each simpleFields as field}
  {#if $searchState[field]}
    <input type="hidden" name={field} value={$searchState[field]} />
  {/if}
{/each}
