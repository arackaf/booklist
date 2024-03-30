<script lang="ts">
  import type { DynamoUserInfo } from "$data/types.js";

  export let data;

  $: ({ userUsageInfo, missingUserInfo } = data);
  let lookup: Record<string, DynamoUserInfo> = {};

  $: Promise.resolve(missingUserInfo).then(val => {
    if (typeof window === "object") {
      val.forEach(user => {
        lookup[user.userId] = user;
      });
    }
  });
</script>

{#each userUsageInfo as x}
  <div>
    <div>
      {x.latest}
    </div>
    <div>
      {x.userId}
    </div>
    <div>
      {x.provider}
    </div>
    <br />
  </div>
{/each}
