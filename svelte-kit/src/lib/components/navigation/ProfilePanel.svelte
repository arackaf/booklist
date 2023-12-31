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

<div bind:this={el} class:open class="sliding-mobile-menu z-30 top-0 left-0 w-72 h-96">
  <div class="flex flex-col gap-3 p-3">
    <div class="flex gap-2 items-center">
      <img class="w-14 h-14 rounded-full" src={loggedInUser.image} />
      <span class="text-xl">{loggedInUser.name}</span>
    </div>
    <div class="flex flex-col gap-2">
      {#if !userSummary}
        <div class="flex gap-2 items-center"><span>Book data loading</span><i class="far fa-fw fa-spin fa-spinner" /></div>
      {:else}
        <span>Total Books: {userSummary?.allBooksCount}</span>
        {#if userSummary.maxUsedSubject}
          <TagsSubjectsSummaryItem items={subjects} label={"MAX-S"} packet={userSummary.maxUsedSubject} />
          {userSummary.maxUsedSubject.books}
          {userSummary.maxUsedSubject.ids}
        {/if}
        {#if userSummary.minUsedSubject}
          {userSummary.minUsedSubject.books}
          {userSummary.minUsedSubject.ids}
        {/if}
        {#if userSummary.maxUsedTag}
          {userSummary.maxUsedTag.books}
          {userSummary.maxUsedTag.ids}
        {/if}
        {#if userSummary.minUsedTag}
          {userSummary.minUsedTag.books}
          {userSummary.minUsedTag.ids}
        {/if}
      {/if}
    </div>
  </div>
</div>
