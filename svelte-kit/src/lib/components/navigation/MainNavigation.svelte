<script lang="ts">
  import { page } from "$app/stores";
  import { signIn, signOut } from "@auth/sveltekit/client";

  import NavBarItem from "./NavBarItem.svelte";
  import ModuleLink from "./ModuleLink.svelte";

  import BookSvg from "./BookSvg.svelte";

  import "$styles/navbar.scss";
  import "./mobile-menu.scss";
  import { onMount } from "svelte";
  import { invalidateAll } from "$app/navigation";
  import { publicUserIdPersist } from "$lib/state/urlHelpers";

  $: ({ loggedIn, hasPublicId, isAdminUser } = $page.data);

  $: pathname = $page.url.pathname;
  $: isSettings = /\/settings/.test(pathname);

  const homeModules = new Set(["/", "/discover", "/recent-scans"]);
  $: isHome = homeModules.has(pathname);

  let pendingCount = 0;

  function handleWsPendingCountUpdate(evt: any) {
    const detail = evt?.detail || {};

    if (typeof detail.pendingCount === "number") {
      pendingCount = detail.pendingCount;
    }
  }

  onMount(() => {
    window.addEventListener("ws-info", handleWsPendingCountUpdate);
  });
</script>

<header class="master-nav">
  <nav class="nav flex bg-[var(--primary-4)] h-12 text-base">
    <div class={`flex text-lg hidden-xs ${isHome ? "active" : ""}`}>
      <ModuleLink active={isHome} padding="px-5" href={$publicUserIdPersist.urlTo("/")}>
        <BookSvg height="18" style="margin-right: 10px; color: white; fill: var(--primary-10);" />
        <span>My Library</span>
      </ModuleLink>
    </div>

    <ul class="nav-items">
      <NavBarItem active={isHome} class="visible-xs" href="/" style="margin-top: '2px';" label={"Home"}>
        <i class="fal fa-fw fa-home visible-xs" />
      </NavBarItem>
      {#if loggedIn || hasPublicId}
        <NavBarItem disabled={hasPublicId} href="/scan" style="position: relative;" label={"Scan books"}>
          <span class="hidden-xs">Book entry</span>
          <i class="visible-xs fal fa-fw fa-scanner" />
          {#if pendingCount}
            <span class={`number-badge ${pendingCount > 9 ? "big-count" : ""}`}>
              <span class="overlay-holder">
                <i class="fas fa-badge" />
                <span>{pendingCount}</span>
              </span>
            </span>
          {/if}
        </NavBarItem>
      {/if}
      {#if loggedIn || hasPublicId}
        <NavBarItem href={$publicUserIdPersist.urlTo("/books")} label={"View books"}>
          <span class="hidden-xs">Books</span>
          <i class="visible-xs fal fa-fw fa-books" />
        </NavBarItem>
      {/if}
      {#if loggedIn || hasPublicId}
        <NavBarItem disabled={hasPublicId} href="/subjects" label={"Manage subjects"}>
          <span class="hidden-xs">Subjects</span>
          <i class="visible-xs fal fa-fw fa-sitemap" />
        </NavBarItem>
      {/if}
      {#if loggedIn || hasPublicId}
        <NavBarItem active={isSettings} href={$publicUserIdPersist.urlTo("/settings/theme")} label={"Settings"}>
          <span class="hidden-xs">Settings</span>
          <i class="visible-xs fal fa-fw fa-cogs" />
        </NavBarItem>
      {/if}
      {#if loggedIn && isAdminUser}
        <NavBarItem href="/admin/similar-books" label={"Admin"}>
          <span class="hidden-xs">Admin</span>
          <i class="visible-xs fal fa-fw fa-users-cog" />
        </NavBarItem>
      {/if}
    </ul>
    <ul class="nav-items-right">
      {#if !loggedIn}
        <NavBarItem
          onClick={() =>
            signIn("google", {
              callbackUrl: "/books"
            })}
          label={"Login"}
        >
          <span class="hidden-xs">Login</span>
          <i class="visible-xs fal fa-fw fa-sign-in" />
        </NavBarItem>
      {/if}
    </ul>
    {#if loggedIn}
      <ul class="nav-items-right">
        <NavBarItem onClick={() => signOut().then(() => invalidateAll())} label={"Logout"}>
          <span class="hidden-xs">Logout</span>
          <i class="visible-xs fal fa-fw fa-sign-out" />
        </NavBarItem>
      </ul>
    {/if}
  </nav>
  <div id="main-mobile-menu" class="main-mobile-menu" />
</header>

<style>
  header :global(a) {
    text-decoration: none;
  }
</style>
