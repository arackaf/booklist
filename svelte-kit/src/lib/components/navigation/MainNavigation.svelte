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

  $: ({ loggedIn } = $page.data);

  $: isSettings = /\/settings/.test($page.url.pathname);
  $: currentModule = $page.url.pathname;

  //let isAdminUser = isAdmin();
  let isAdminUser = false;

  //$: isPublic = $appState.isPublic;
  let isPublic = false;

  const homeModules = new Set(["/", "/discover", "/recent-scans"]);
  $: isHome = homeModules.has(currentModule);

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
  <nav class="nav">
    <div class={`nav-header hidden-xs ${isHome && loggedIn ? "active" : ""}`}>
      <ModuleLink href="/">
        <BookSvg height="18" style="margin-right: 10px; color: white; fill: var(--primary-10);" />
        <span>My Library</span>
      </ModuleLink>
    </div>

    <ul class="nav-items">
      <NavBarItem class="visible-xs" disabled={isPublic} href="/" style="margin-top: '2px';" label={"Home"}>
        <i class="fal fa-fw fa-home visible-xs" />
      </NavBarItem>
      {#if loggedIn || isPublic}
        <NavBarItem disabled={isPublic} href="/scan" style="position: relative;" label={"Scan books"}>
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
      {#if loggedIn || isPublic}
        <NavBarItem href={"/books"} label={"View books"}>
          <span class="hidden-xs">Books</span>
          <i class="visible-xs fal fa-fw fa-books" />
        </NavBarItem>
      {/if}
      {#if loggedIn || isPublic}
        <NavBarItem disabled={isPublic} href="/subjects" label={"Manage subjects"}>
          <span class="hidden-xs">Subjects</span>
          <i class="visible-xs fal fa-fw fa-sitemap" />
        </NavBarItem>
      {/if}
      {#if loggedIn || isPublic}
        <NavBarItem active={isSettings} href="/settings/theme" label={"Settings"}>
          <span class="hidden-xs">Settings</span>
          <i class="visible-xs fal fa-fw fa-cogs" />
        </NavBarItem>
      {/if}
      {#if loggedIn && isAdminUser}
        <NavBarItem href="/admin" label={"Admin"}>
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
