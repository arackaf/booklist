<script lang="ts">
  import { page } from "$app/stores";
  import { signIn } from "@auth/sveltekit/client";

  import NavBarItem from "./NavBarItem.svelte";
  import ModuleLink from "./ModuleLink.svelte";

  import BookSvg from "./BookSvg.svelte";

  import { onMount } from "svelte";
  import { publicUserIdPersist } from "$lib/state/urlHelpers";
  import ProfilePanel from "./ProfilePanel.svelte";
  import type { UserSummary } from "$data/user-summary";

  let { loggedIn, hasPublicId, isAdminUser, loggedInUser } = $derived($page.data);

  let pathname = $derived($page.url.pathname);
  let isSettings = $derived(/\/settings/.test(pathname));

  const homeModules = new Set(["/", "/discover", "/recent-scans"]);
  let isHome = $derived(homeModules.has(pathname));

  let pendingCount = $state(0);

  let bigCount = $derived(pendingCount > 9);

  let profilePanelOpen = $state(false);

  let userSummaryFetched = $state(false);
  let userSummaryStale = $state(false);
  let userSummary = $state<UserSummary | undefined>();

  onMount(() => {
    window.addEventListener("ws-info", handleWsPendingCountUpdate);
  });

  function handleWsPendingCountUpdate(evt: any) {
    const detail = evt?.detail || {};

    if (typeof detail.pendingCount === "number") {
      pendingCount = detail.pendingCount;
    }
  }

  function fetchUserSummaryIfNeeded() {
    if (userSummaryFetched && !userSummaryStale) {
      return;
    }

    userSummaryFetched = true;
    userSummaryStale = false;

    fetch("/api/user-summary")
      .then(resp => resp.json())
      .then(userSummaryData => {
        userSummary = userSummaryData;
      });
  }

  onMount(() => {
    window.addEventListener("reload-user-summary", () => {
      userSummaryStale = true;
    });
  });
</script>

<header class="master-nav z-10 sticky top-0">
  {#if loggedInUser}
    <ProfilePanel {userSummary} {loggedInUser} open={profilePanelOpen} onClose={() => (profilePanelOpen = false)} />
  {/if}
  <nav class="nav flex bg-[var(--primary-4)] h-12 text-base">
    {#if loggedIn}
      <div class="items-center mx-2 my-auto">
        <button
          on:mouseenter={fetchUserSummaryIfNeeded}
          on:click={() => (profilePanelOpen = !profilePanelOpen)}
          class="raw-button flex profile-menu-trigger"
        >
          <img alt="User profile" class="rounded-full h-8 w-8 max-h-8 max-w-8" src={loggedInUser.image} />
        </button>
      </div>
    {/if}
    <div class={`hidden md:flex text-lg ${isHome ? "active" : ""}`}>
      <ModuleLink active={isHome} padding="px-3" href={$publicUserIdPersist.urlTo("/")}>
        <BookSvg height="18" style="margin-right: 10px; color: white; fill: var(--primary-10);" />
        <span>My Library</span>
      </ModuleLink>
    </div>

    <ul class="flex nav-items">
      <NavBarItem active={isHome} class="flex md:hidden" href="/" style="margin-top: '2px';" label={"Home"}>
        <i class="fal fa-fw fa-home text-lg"></i>
      </NavBarItem>
      {#if loggedIn || hasPublicId}
        <NavBarItem disabled={hasPublicId} href="/scan" style="position: relative;" label={"Scan books"}>
          <span class="hidden md:block">Book entry</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-scanner"></i>
          </span>
          {#if pendingCount}
            <span class="absolute top-[3px] right-[2px] {bigCount ? 'text-[0.7rem]' : 'text-[0.65rem]'}">
              <span class="overlay-holder">
                <i class="fas fa-badge text-info-6 text-base leading-none"></i>
                <span class="text-primary-2 leading-none self-center justify-self-center">{pendingCount}</span>
              </span>
            </span>
          {/if}
        </NavBarItem>
      {/if}
      {#if loggedIn || hasPublicId}
        <NavBarItem href={$publicUserIdPersist.urlTo("/books")} label={"View books"}>
          <span class="hidden md:block">Books</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-books"></i>
          </span>
        </NavBarItem>
      {/if}
      {#if loggedIn || hasPublicId}
        <NavBarItem disabled={hasPublicId} href="/subjects" label={"Manage subjects"}>
          <span class="hidden md:block">Subjects</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-sitemap"></i>
          </span>
        </NavBarItem>
      {/if}
      {#if loggedIn || hasPublicId}
        <NavBarItem active={isSettings} href={$publicUserIdPersist.urlTo("/settings/theme")} label={"Settings"}>
          <span class="hidden md:block">Settings</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-cogs"></i>
          </span>
        </NavBarItem>
      {/if}
      {#if loggedIn && isAdminUser}
        <NavBarItem href="/admin/similar-books" label={"Admin"}>
          <span class="hidden md:block">Admin</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-users-cog"></i>
          </span>
        </NavBarItem>
      {/if}
    </ul>
    <ul class="flex ml-auto">
      {#if !loggedIn}
        <NavBarItem
          onClick={() => {
            signIn("", { callbackUrl: "/books" });
          }}
          label={"Login"}
        >
          <span class="hidden md:block">Login</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-sign-in"></i>
          </span>
        </NavBarItem>
      {/if}
    </ul>
  </nav>
  <div id="main-mobile-menu" class="sliding-mobile-menu p-2 z-10"></div>
</header>
