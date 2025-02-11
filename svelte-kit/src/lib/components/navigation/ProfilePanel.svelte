<script lang="ts">
  import { onMount } from "svelte";
  import { signOut } from "@auth/sveltekit/client";

  import { page } from "$app/stores";
  import type { UserSummary } from "$data/user-summary";
  import { invalidateAll } from "$app/navigation";
  import type { Login } from "$lib/types";

  import Button from "../Button/Button.svelte";
  import TagsSubjectsSummaryItem from "./TagsSubjectsSummaryItem.svelte";

  type Props = {
    loggedInUser: Login;
    userSummary: UserSummary | undefined;
  };

  let { loggedInUser, userSummary }: Props = $props();
  let { tags, subjects } = $derived($page.data);
</script>

<div class="">
  <div class="flex flex-col gap-6 bg-white">
    <div class="flex gap-2 items-center py-1 -mb-3 sticky top-0 bg-white">
      <img alt="User profile" class="w-14 h-14 rounded-full" src={loggedInUser.image} />
      <span class="text-xl">{loggedInUser.name}</span>
    </div>
    <div class="flex flex-col gap-2">
      {#if !userSummary}
        <div class="flex gap-2 items-center"><span>Book data loading</span><i class="far fa-fw fa-spin fa-spinner"></i></div>
      {:else}
        <span>Total Books: {userSummary?.allBooksCount}</span>
        {#if userSummary.maxUsedSubjects}
          <TagsSubjectsSummaryItem items={subjects} label={"MAX-S"} packet={userSummary.maxUsedSubjects} />
        {/if}
        {#if userSummary.minUsedSubjects}
          <TagsSubjectsSummaryItem items={subjects} label={"MIN-S"} packet={userSummary.minUsedSubjects} />
        {/if}
        {#if userSummary.unusedSubjects}
          <TagsSubjectsSummaryItem items={subjects} label={"UNUSED-S"} packet={userSummary.unusedSubjects} />
        {/if}
        {#if userSummary.maxUsedTags}
          <TagsSubjectsSummaryItem items={tags} label={"MAX-T"} packet={userSummary.maxUsedTags} />
        {/if}
        {#if userSummary.minUsedTags}
          <TagsSubjectsSummaryItem items={tags} label={"MIN-T"} packet={userSummary.minUsedTags} />
        {/if}
        {#if userSummary.unusedTags}
          <TagsSubjectsSummaryItem items={tags} label={"UNUSED-T"} packet={userSummary.unusedTags} />
        {/if}
      {/if}
    </div>
    <div class="grid gap-x-2 gap-y-2 grid-cols-[minmax(0,auto)_minmax(0,1fr)] grid-rows-[auto_auto] leading-none">
      <span>Provider:</span>
      <div class="flex gap-1">
        <i class="fab {loggedInUser.provider === 'google' ? 'fa-google' : 'fa-github'}"></i>
        <span>{loggedInUser.provider === "google" ? "Google" : "Github"}</span>
      </div>

      <span>Email:</span>
      <span class="break-words">{loggedInUser.email}</span>
    </div>
    <span>
      <Button size="med" onclick={() => signOut().then(() => invalidateAll())}>Logout</Button>
    </span>
  </div>
</div>
