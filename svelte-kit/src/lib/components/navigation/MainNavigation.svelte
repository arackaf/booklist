<script lang="ts">
  import { page } from "$app/stores";
  import { signIn, signOut } from "@auth/sveltekit/client";

  import NavBarItem from "./NavBarItem.svelte";
  import ModuleLink from "./ModuleLink.svelte";

  import BookSvg from "./BookSvg.svelte";

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

  $: bigCount = pendingCount > 9;

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
    <div class={`hidden md:flex text-lg ${isHome ? "active" : ""}`}>
      <ModuleLink active={isHome} padding="px-5" href={$publicUserIdPersist.urlTo("/")}>
        <BookSvg height="18" style="margin-right: 10px; color: white; fill: var(--primary-10);" />
        <span>My Library</span>
      </ModuleLink>
    </div>

    <ul class="flex nav-items">
      <NavBarItem active={isHome} class="flex md:hidden" href="/" style="margin-top: '2px';" label={"Home"}>
        <i class="fal fa-fw fa-home text-lg" />
      </NavBarItem>
      {#if loggedIn || hasPublicId}
        <NavBarItem disabled={hasPublicId} href="/scan" style="position: relative;" label={"Scan books"}>
          <span class="hidden md:block">Book entry</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-scanner" />
          </span>
          {#if pendingCount}
            <span class="absolute top-[3px] right-[2px] {bigCount ? 'text-[0.7rem]' : 'text-[0.65rem]'}">
              <span class="overlay-holder">
                <i class="fas fa-badge text-info-6 text-base leading-none" />
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
            <i class="text-lg fal fa-fw fa-books" />
          </span>
        </NavBarItem>
      {/if}
      {#if loggedIn || hasPublicId}
        <NavBarItem disabled={hasPublicId} href="/subjects" label={"Manage subjects"}>
          <span class="hidden md:block">Subjects</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-sitemap" />
          </span>
        </NavBarItem>
      {/if}
      {#if loggedIn || hasPublicId}
        <NavBarItem active={isSettings} href={$publicUserIdPersist.urlTo("/settings/theme")} label={"Settings"}>
          <span class="hidden md:block">Settings</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-cogs" />
          </span>
        </NavBarItem>
      {/if}
      {#if loggedIn && isAdminUser}
        <NavBarItem href="/admin/similar-books" label={"Admin"}>
          <span class="hidden md:block">Admin</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-users-cog" />
          </span>
        </NavBarItem>
      {/if}
    </ul>
    <ul class="flex ml-auto">
      {#if !loggedIn}
        <NavBarItem
          onClick={() =>
            signIn("google", {
              callbackUrl: "/books"
            })}
          label={"Login"}
        >
          <span class="hidden md:block">Login</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-sign-in" />
          </span>
        </NavBarItem>
      {/if}
    </ul>
    {#if loggedIn}
      <ul class="flex ml-auto">
        <NavBarItem onClick={() => signOut().then(() => invalidateAll())} label={"Logout"}>
          <span class="hidden md:block">Logout</span>
          <span class="md:hidden">
            <i class="text-lg fal fa-fw fa-sign-out" />
          </span>
        </NavBarItem>
      </ul>
    {/if}
  </nav>
  <div id="main-mobile-menu" class="main-mobile-menu" />
</header>
