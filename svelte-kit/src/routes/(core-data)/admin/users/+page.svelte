<script lang="ts">
  import type { StoredUserInfo } from "$data/types";
  import UserUsageEntry from "./UserUsageEntry.svelte";

  export let data;

  $: ({ userUsageInfo, missingUserInfo } = data);
  let lookup: Record<string, StoredUserInfo | null> = {};

  // $: Promise.resolve(missingUserInfo).then(val => {
  //   if (typeof window === "object") {
  //     val.forEach(user => {
  //       lookup[user.userId] = user ?? null;
  //     });
  //   }
  // });
</script>

<div class="flex flex-col gap-5">
  <h1 class="text-3xl">Users</h1>
  <div class="flex flex-col gap-6">
    {#each userUsageInfo ?? [] as x}
      <UserUsageEntry userUsageEntry={x} missingUserInfo={lookup[x.userId]} />
    {/each}
  </div>
</div>
