<script lang="ts">
  import { onMount } from "svelte";
  import type { Login } from "$lib/types";
  import { page } from "$app/stores";
  import type { UserSummary } from "$data/user-summary";
  import TagsSubjectsSummaryItem from "./TagsSubjectsSummaryItem.svelte";
  import { signOut } from "@auth/sveltekit/client";
  import { invalidateAll } from "$app/navigation";
  import Button from "../ui/Button/Button.svelte";

  export let open = false;
  export let onClose = () => {};

  export let loggedInUser: Login;

  $: ({ tags, subjects } = $page.data);

  $: userSummaryPromise = $page.data.userSummaryData as Promise<UserSummary>;
  let userSummary: UserSummary | undefined;

  $: userSummaryPromise.then(result => {
    userSummary = result;
  });

  const windowClickHandler = (evt: MouseEvent) => {
    if (!open) {
      return;
    }
    let clickedEl = evt.target as HTMLElement | null;
    while (clickedEl) {
      if (clickedEl == el || clickedEl.classList.contains("profile-menu-trigger")) {
        return;
      }
      clickedEl = clickedEl?.parentElement;
    }
    onClose();
  };

  let el: HTMLElement;

  $: {
    if (!open && el) {
      setTimeout(() => {
        el.scrollTop = 0;
      }, 50);
    }
  }

  onMount(() => {
    window.addEventListener("click", windowClickHandler);
  });
</script>

<div bind:this={el} class:open class="sliding-mobile-menu z-30 top-0 left-0 w-72 h-96 overflow-y-auto overflow-x-hidden">
  <div class="flex flex-col gap-6 pb-2 px-3 bg-white">
    <div class="flex gap-2 items-center py-1 -mb-3 sticky top-0 bg-white">
      <img class="w-14 h-14 rounded-full" src={loggedInUser.image} />
      <span class="text-xl">{loggedInUser.name}</span>
    </div>
    <div class="flex flex-col gap-2">
      {#if !userSummary}
        <div class="flex gap-2 items-center"><span>Book data loading</span><i class="far fa-fw fa-spin fa-spinner" /></div>
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
    <div class="grid gap-x-2 gap-y-2 grid-cols-[minmax(0,auto)_minmax(0,auto)] grid-rows-[auto_auto] leading-none">
      <span>Provider:</span>
      <div class="flex gap-1">
        <i class="fab {loggedInUser.provider === 'google' ? 'fa-google' : 'fa-github'}" />
        <span>{loggedInUser.provider === "google" ? "Google" : "Github"}</span>
      </div>

      <span>Email:</span>
      <span class="break-words">{loggedInUser.email + loggedInUser.email}</span>
    </div>
    <span>
      <Button size="med" on:click={() => signOut().then(() => invalidateAll())}>Logout</Button>
    </span>
  </div>
</div>
