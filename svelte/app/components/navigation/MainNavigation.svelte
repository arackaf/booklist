<script lang="ts">
  import NavBarItem from "./NavBarItem.svelte";
  import ModuleLink from "./ModuleLink.svelte";

  import ajaxUtil from "util/ajaxUtil";

  import { appState } from "app/state/appState";
  import { isAdmin } from "util/loginStatus";

  import navClasses from "css/navbar.module.scss";

  const { nav, navHeader, navItems, navItemsRight } = navClasses;

  const logout = () => {
    ajaxUtil.post("/auth/logout", {}, () => ((window as any).location = "/"));
  };

  let isAdminUser = isAdmin();

  let currentModule;
  $: currentModule = $appState.module;

  $: isLoginModule = currentModule == "authenticate";
  $: isLoggedIn = $appState.isLoggedIn;
  $: isPublic = $appState.isPublic;

  $: isHome = currentModule == "home";
</script>

<style>
  header :global(a) {
    text-decoration: none;;
  }
</style>

<header>
  <nav class={nav}>
    <div class={`${navHeader} hidden-xs ${isHome && isLoggedIn ? 'active' : ''}`}>
      <ModuleLink href="home"><i class="fal fa-book" style="margin-right: 5px;" /> <span>My Library</span></ModuleLink>
    </div>

    <ul class={navItems}>
      <NavBarItem class="visible-xs" disabled={isPublic} href={'home'} style="margin-top: '2px'"><i class="fal fa-home visible-xs" /></NavBarItem>
      {#if isLoggedIn || isPublic}
        <NavBarItem disabled={isPublic} href="scan"><span class="hidden-xs">Book entry</span> <i class="visible-xs fal fa-scanner" /></NavBarItem>
      {/if}
      {#if isLoggedIn || isPublic}
        <NavBarItem href={isPublic ? 'view' : 'books'}><span class="hidden-xs">Books</span> <i class="visible-xs fal fa-books" /></NavBarItem>
      {/if}
      {#if isLoggedIn || isPublic}
        <NavBarItem disabled={isPublic} href="subjects"><span class="hidden-xs">Subjects</span> <i class="visible-xs fal fa-sitemap" /></NavBarItem>
      {/if}
      {#if isLoggedIn || isPublic}
        <NavBarItem href={'settings'}><span class="hidden-xs">Settings</span> <i class="visible-xs fal fa-cogs" /></NavBarItem>
      {/if}
      {#if isLoggedIn && isAdminUser}
        <NavBarItem href="admin"><span class="hidden-xs">Admin</span> <i class="visible-xs fal fa-users-cog" /></NavBarItem>
      {/if}
    </ul>
    <ul class={navItemsRight}>
      {#if !isLoggedIn && !isLoginModule}
        <NavBarItem external={true} href="/login"><span class="hidden-xs">Login</span> <i class="visible-xs fal fa-sign-in" /></NavBarItem>
      {/if}
    </ul>
    {#if isLoggedIn}
      <ul class={navItemsRight}>
        <NavBarItem onClick={logout}><span class="hidden-xs">Logout</span> <i class="visible-xs fal fa-sign-out" /></NavBarItem>
      </ul>
    {/if}
  </nav>
</header>
