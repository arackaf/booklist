<script lang="ts">
  import type { StoredUserInfo } from "$data/types";
  import UserUsageEntry from "./UserUsageEntry.svelte";

  let { data } = $props();

  let { userUsageInfo } = $derived(data);
  let lookup = $state<Record<string, StoredUserInfo | null>>({});
</script>

<div class="flex flex-col gap-5">
  <h1 class="text-3xl">Users</h1>
  <div class="flex flex-col gap-6">
    {#each userUsageInfo as x}
      <UserUsageEntry userUsageEntry={x} missingUserInfo={lookup[x.userId]} />
    {/each}
  </div>
</div>
