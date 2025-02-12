<script lang="ts">
  import { onMount } from "svelte";
  import { BookCopyIcon, BookPlusIcon, TagsIcon, CogIcon, SettingsIcon, HomeIcon } from "lucide-svelte";

  import { page } from "$app/state";
  import type { UserSummary } from "$data/user-summary";
  import { publicUserIdPersist } from "$lib/state/urlHelpers.svelte";
  import * as Sheet from "$lib/components/ui/sheet";

  import MainNavigationLink from "./MainNavigationLink.svelte";
  import ProfilePanel from "./ProfilePanel.svelte";
  import type { NavigationItem } from "./types";
  import Button from "../ui/button/button.svelte";
  import { profilePaneState } from "./profile-pane-state.svelte";

  let { loggedIn, hasPublicId, isAdminUser, loggedInUser } = $derived(page.data);

  let pathname = $derived(page.url.pathname);
  let isSettings = $derived(/\/settings/.test(pathname));

  const homeModules = new Set(["/", "/discover", "/recent-scans"]);
  let isHome = $derived(homeModules.has(pathname));

  let pendingCount = $state(0);
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

  let navItems: NavigationItem[] = $derived([
    { label: "Home", Icon: HomeIcon, active: isHome, href: publicUserIdPersist.urlTo("/") },
    { label: "Books", Icon: BookCopyIcon, href: publicUserIdPersist.urlTo("/books") },
    { label: "Subjects", Icon: TagsIcon, href: "/subjects", hidden: !(hasPublicId || loggedIn), disabled: hasPublicId },
    {
      label: "Book Entry",
      Icon: BookPlusIcon,
      href: "/scan",
      hidden: !(hasPublicId || loggedIn),
      disabled: hasPublicId,
      badge: pendingCount || null
    },
    { label: "Settings", Icon: SettingsIcon, active: isSettings, href: publicUserIdPersist.urlTo("/settings/theme") },
    { label: "Admin", Icon: CogIcon, href: "/admin/similar-books", hidden: !isAdminUser }
  ]);
</script>

<header class="z-50 sticky top-0 w-full border-b bg-background">
  <nav class="container flex h-14 items-center">
    {#if loggedInUser}
      <Button variant="ghost" class="mx-2 p-0" onclick={() => profilePaneState.open()}>
        <img alt="User profile" class="rounded-full h-8 w-8 max-h-8 max-w-8" src={loggedInUser.image} />
      </Button>
      <!-- <Sheet.Root>
        <Sheet.Trigger class="items-center mx-2 my-auto" onmouseenter={fetchUserSummaryIfNeeded}>
        </Sheet.Trigger>
        <Sheet.Content side="left"> -->
      <!-- <ProfilePanel {userSummary} {loggedInUser} /> -->
      <!-- </Sheet.Content>
      </Sheet.Root> -->
    {/if}

    <div class="flex gap-2">
      {#each navItems.filter(item => !item.hidden) as item}
        <MainNavigationLink Icon={item.Icon} active={item.active} disabled={item.disabled} href={item.href} label={item.label} badge={item.badge} />
      {/each}
    </div>
  </nav>
  <div id="main-mobile-menu" class="sliding-mobile-menu p-2 z-10 mt-[1px]"></div>
</header>
