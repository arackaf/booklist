<script lang="ts">
  import NavBarItem from "./NavBarItem.svelte";
  import ModuleLink from "./ModuleLink.svelte";

  import ajaxUtil from "util/ajaxUtil";

  import { appState } from "app/state/appState";
  import { isAdmin } from "util/loginStatus";

  import BookSvg from "./BookSvg.svelte";

  import "css/navbar.scss";
  import "./mobile-menu.scss";

  const logout = () => {
    ajaxUtil.postAuth("/logout", {}, () => ((window as any).location = "/"));
  };

  let isAdminUser = isAdmin();

  let currentModule;
  $: currentModule = $appState.module;

  $: isLoginModule = currentModule == "authenticate";
  $: isLoggedIn = $appState.isLoggedIn;
  $: isPublic = $appState.isPublic;

  $: isHome = currentModule == "home";

  let pendingCount = 0;

  function handleWsPendingCountUpdate(evt) {
    if (typeof evt?.detail?.pendingCount === "number") {
      pendingCount = evt.detail.pendingCount;
    }
  }

  window.addEventListener("ws-info", handleWsPendingCountUpdate);
</script>

<style>
  header :global(a) {
    text-decoration: none;
  }
</style>

<header class="master-nav">
  <nav class="nav">
    <div class={`nav-header hidden-xs ${isHome && isLoggedIn ? "active" : ""}`}>
      <ModuleLink href="/home">
        <BookSvg height="18" style="margin-right: 10px; color: white; fill: var(--primary-10);" />
        <span>My Library</span>
      </ModuleLink>
    </div>

    <ul class="nav-items">
      <NavBarItem class="visible-xs" disabled={isPublic} href="/home" style="margin-top: '2px';"><i class="fal fa-home visible-xs" /></NavBarItem>
      {#if isLoggedIn || isPublic}
        <NavBarItem disabled={isPublic} href="/scan" style="position: relative;">
          <span class="hidden-xs">Book entry</span>
          <i class="visible-xs fal fa-scanner" />
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
      {#if isLoggedIn || isPublic}
        <NavBarItem href={isPublic ? "/view" : "/books"}><span class="hidden-xs">Books</span> <i class="visible-xs fal fa-books" /></NavBarItem>
      {/if}
      {#if isLoggedIn || isPublic}
        <NavBarItem disabled={isPublic} href="/subjects"><span class="hidden-xs">Subjects</span> <i class="visible-xs fal fa-sitemap" /></NavBarItem>
      {/if}
      {#if isLoggedIn || isPublic}
        <NavBarItem href="/settings"><span class="hidden-xs">Settings</span> <i class="visible-xs fal fa-cogs" /></NavBarItem>
      {/if}
      {#if isLoggedIn && isAdminUser}
        <NavBarItem href="/admin"><span class="hidden-xs">Admin</span> <i class="visible-xs fal fa-users-cog" /></NavBarItem>
      {/if}
    </ul>
    <ul class="nav-items-right">
      {#if !isLoggedIn && !isLoginModule}
        <NavBarItem href="/login"><span class="hidden-xs">Login</span> <i class="visible-xs fal fa-sign-in" /></NavBarItem>
      {/if}
    </ul>
    {#if isLoggedIn}
      <ul class="nav-items-right">
        <NavBarItem onClick={logout}><span class="hidden-xs">Logout</span> <i class="visible-xs fal fa-sign-out" /></NavBarItem>
      </ul>
    {/if}
  </nav>
  <div id="main-mobile-menu" class="main-mobile-menu" />
</header>
