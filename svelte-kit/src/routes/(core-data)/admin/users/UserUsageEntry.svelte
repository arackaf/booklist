<script lang="ts">
  import { UserIcon } from "lucide-svelte";
  import type { StoredUserInfo } from "$data/types";
  import type { UserUsageEntry } from "$data/user-usage-info";

  import GoogleIcon from "$lib/svg/GoogleIcon.svelte";
  import GithubIcon from "$lib/svg/GithubIcon.svelte";

  import UserProviderIcon from "./UserProviderIcon.svelte";

  type Props = {
    userUsageEntry: UserUsageEntry;
    missingUserInfo?: StoredUserInfo | null;
  };

  let { userUsageEntry, missingUserInfo }: Props = $props();

  let provider = $derived(userUsageEntry.provider || missingUserInfo?.provider || "");
  let books = $derived(userUsageEntry.books);
  let lastEnteredDate = $derived.by(() => {
    if (userUsageEntry.latest) {
      const date: Date = userUsageEntry.latest;
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return "";
  });
</script>

<div class="flex flex-row gap-4">
  <UserProviderIcon avatar={userUsageEntry.avatar} {provider} />
  <div class="flex flex-col gap-2">
    <div class="flex flex-col">
      <div class="text-lg leading-none">
        {books} Book{books === 1 ? "" : "s"}
      </div>
      <div>
        Last book entered: {lastEnteredDate}
      </div>
    </div>
    <div class="flex gap-2 items-center">
      <span>
        {#if provider === "google"}
          <GoogleIcon size={16} />
        {:else if provider === "github"}
          <GithubIcon size={16} />
        {:else}
          <UserIcon size={16} />
        {/if}
      </span>
      {userUsageEntry.email}
    </div>
  </div>
</div>
