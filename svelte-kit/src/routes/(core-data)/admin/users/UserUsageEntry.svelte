<script lang="ts">
  import type { StoredUserInfo } from "$data/types";
  import type { UserUsageEntry } from "$data/user-usage-info";
  import UserIcon from "./UserIcon.svelte";

  export let userUsageEntry: UserUsageEntry;
  export let missingUserInfo: StoredUserInfo | undefined | null;

  $: provider = userUsageEntry.provider || missingUserInfo?.provider || "";
  $: books = userUsageEntry.books;

  let lastEnteredDate: string;
  $: {
    if (userUsageEntry.latest) {
      const date: Date = userUsageEntry.latest;
      lastEnteredDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
  }
</script>

<div class="flex flex-row gap-4">
  <UserIcon avatar={userUsageEntry.avatar} {provider} />
  <div class="flex flex-col gap-2">
    <div class="flex flex-col">
      <div class="text-lg leading-none">
        {userUsageEntry.books} Book{books === 1 ? "" : "s"}
      </div>
      <div>
        Last book entered: {lastEnteredDate}
      </div>
    </div>
    <div>
      {userUsageEntry.email}
    </div>
  </div>
</div>
