<script lang="ts">
  import { searchState } from "../state/searchState";

  type SimpleFields = (keyof typeof $searchState)[];
  let simpleFields = $state<SimpleFields>(["publisher", "author"]);
</script>

{#each simpleFields as field}
  {#if $searchState[field]}
    <input type="hidden" name={field} value={$searchState[field]} />
  {/if}
{/each}
