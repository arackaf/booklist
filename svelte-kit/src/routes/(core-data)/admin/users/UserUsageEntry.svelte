<script lang="ts">
  import type { StoredUserInfo } from "$data/types";
  import type { UserUsageEntry } from "$data/user-usage-info";

  export let userUsageEntry: UserUsageEntry;
  export let missingUserInfo: StoredUserInfo | undefined | null;
</script>

<div class="flex flex-row gap-2">
  <div>
    {userUsageEntry.userId}
  </div>

  <div>
    {userUsageEntry.provider || missingUserInfo?.provider || ""}
  </div>
  <div>
    {userUsageEntry.books}
  </div>
  <div>
    {userUsageEntry.latest?.getFullYear()}
  </div>
</div>
