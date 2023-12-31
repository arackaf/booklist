<script lang="ts">
  import { onMount } from "svelte";
  import type { Login } from "$lib/types";
  import { page } from "$app/stores";
  import type { UserSummary } from "$data/user-summary";
  import TagsSubjectsSummaryItem from "./TagsSubjectsSummaryItem.svelte";

  export let open = false;
  export let onClose = () => {};

  export let loggedInUser: Login;

  $: ({ tags, subjects } = $page.data);

  $: userSummaryPromise = $page.data.userSummaryData as Promise<UserSummary>;
  let userSummary: UserSummary | undefined;

  onMount(() => {
    userSummaryPromise.then(result => {
      userSummary = result;
    });
  });

  $: console.log({ userSummary });

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

  let el;

  onMount(() => {
    window.addEventListener("click", windowClickHandler);
  });
</script>

<div bind:this={el} class:open class="sliding-mobile-menu z-30 top-0 left-0 w-72 h-96 overflow-auto">
  <div class="flex flex-col gap-3 px-3 bg-white">
    <div class="flex gap-2 items-center sticky py-3 top-0 bg-white">
      <img class="w-14 h-14 rounded-full" src={loggedInUser.image} />
      <span class="text-xl">{loggedInUser.name}</span>
    </div>
    <div class="flex flex-col gap-2 mb-3">
      {#if !userSummary}
        <div class="flex gap-2 items-center"><span>Book data loading</span><i class="far fa-fw fa-spin fa-spinner" /></div>
      {:else}
        <span>Total Books: {userSummary?.allBooksCount}</span>
        {#if userSummary.maxUsedSubject}
          <TagsSubjectsSummaryItem items={subjects} label={"MAX-S"} packet={userSummary.maxUsedSubject} />
        {/if}
        {#if userSummary.minUsedSubject}
          <TagsSubjectsSummaryItem items={subjects} label={"MIN-S"} packet={userSummary.minUsedSubject} />
        {/if}
        {#if userSummary.maxUsedTag}
          <TagsSubjectsSummaryItem items={tags} label={"MAX-T"} packet={userSummary.maxUsedTag} />
        {/if}
        {#if userSummary.minUsedTag}
          <TagsSubjectsSummaryItem items={tags} label={"MIN-T"} packet={userSummary.minUsedTag} />
        {/if}
      {/if}
    </div>
  </div>
</div>
