<script lang="ts">
  import { page } from "$app/stores";
  import { signIn } from "@auth/sveltekit/client";

  import NavBarItem from "./NavBarItem.svelte";
  import ModuleLink from "./ModuleLink.svelte";

  import BookSvg from "./BookSvg.svelte";

  import { BlindsIcon, BookOpenIcon, ScanLineIcon, SettingsIcon } from "lucide-svelte";

  import { onMount } from "svelte";
  import { publicUserIdPersist } from "$lib/state/urlHelpers.svelte";
  import ProfilePanel from "./ProfilePanel.svelte";
  import type { UserSummary } from "$data/user-summary";
  import Button from "../ui/button/button.svelte";
  import { cn } from "$lib/utils";

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

  const navItems = [
    { label: "Home", Icon: BlindsIcon, href: "/" },
    { label: "Books", Icon: BookOpenIcon, href: "/books", isActive: true },
    { label: "Scan", Icon: ScanLineIcon, href: "/scan" },
    { label: "Settings", Icon: SettingsIcon, href: "/settings", disabled: true }
  ];
</script>

<header class="z-50 sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background">
  {#if loggedInUser}
    <ProfilePanel {userSummary} {loggedInUser} open={profilePanelOpen} onClose={() => (profilePanelOpen = false)} />
  {/if}
  <nav class="container flex h-14 items-center">
    {#if loggedIn}
      <div class="items-center mx-2 my-auto">
        <button
          onmouseenter={fetchUserSummaryIfNeeded}
          onclick={() => (profilePanelOpen = !profilePanelOpen)}
          class="raw-button flex profile-menu-trigger"
        >
          <img alt="User profile" class="rounded-full h-8 w-8 max-h-8 max-w-8" src={loggedInUser.image} />
        </button>
      </div>
    {/if}

    <div class="flex gap-2">
      {#each navItems as item}
        <Button
          variant={item.isActive ? "secondary" : "ghost"}
          disabled={item.disabled}
          href={item.href}
          class={cn("flex items-center gap-2", item.disabled && "opacity-50 cursor-not-allowed", item.isActive && "font-medium")}
        >
          <item.Icon class="h-4 w-4" />
          {item.label}
        </Button>
      {/each}
    </div>
  </nav>
  <div id="main-mobile-menu" class="sliding-mobile-menu p-2 z-10"></div>
</header>
