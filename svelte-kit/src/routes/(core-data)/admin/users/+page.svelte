<script lang="ts">
  export let data;

  $: ({ userUsageInfo, missingUserInfo } = data);
  let lookup: Record<string, string> = {};

  $: Promise.resolve(missingUserInfo).then(val => {
    if (typeof window === "object") {
      val.forEach(user => {
        lookup[user.userId] = user.provider ?? "";
      });
    }
  });
</script>

<div class="flex flex-col gap-6">
  {#each userUsageInfo as x}
    <div class="flex flex-row gap-2">
      <div>
        {x.userId}
      </div>

      <div>
        {x.provider || lookup[x.userId] || ""}
      </div>
      <div>
        {x.books}
      </div>
      <div>
        {x.latest?.getFullYear()}
      </div>
    </div>
  {/each}
</div>
