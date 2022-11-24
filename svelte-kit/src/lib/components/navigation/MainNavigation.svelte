<script lang="ts">
	import NavBarItem from './NavBarItem.svelte';
	import ModuleLink from './ModuleLink.svelte';

	//import ajaxUtil from 'util/ajaxUtil';

	//import { appState } from 'app/state/appState';
	//import { isAdmin } from 'util/loginStatus';

	import BookSvg from './BookSvg.svelte';

	import '$styles/navbar.scss';
	import './mobile-menu.scss';
	import { onMount } from 'svelte';

	const logout = () => {};
	// const logout = () => {
	//   ajaxUtil.postAuth("/logout", {}, () => ((window as any).location = "/"));
	// };

	//let isAdminUser = isAdmin();
	let isAdminUser = false;

	//let currentModule;
	//$: currentModule = $appState.module;

	//$: isLoginModule = currentModule == 'authenticate';
	let isLoginModule = false;
	//$: isLoggedIn = $appState.isLoggedIn;
	let isLoggedIn = true;

	//$: isPublic = $appState.isPublic;
	let isPublic = false;

	//$: isHome = currentModule == 'home';
	let isHome = false;

	let pendingCount = 0;

	function handleWsPendingCountUpdate(evt: any) {
		if (typeof evt?.detail?.pendingCount === 'number') {
			pendingCount = evt.detail.pendingCount;
		}
	}

	onMount(() => {
		window.addEventListener('ws-info', handleWsPendingCountUpdate);
	});
</script>

<header class="master-nav">
	<nav class="nav">
		<div class={`nav-header hidden-xs ${isHome && isLoggedIn ? 'active' : ''}`}>
			<ModuleLink href="/home">
				<BookSvg height="18" style="margin-right: 10px; color: white; fill: var(--primary-10);" />
				<span>My Library</span>
			</ModuleLink>
		</div>

		<ul class="nav-items">
			<NavBarItem class="visible-xs" disabled={isPublic} href="/home" style="margin-top: '2px';">
				<i class="fal fa-fw fa-home visible-xs" />
			</NavBarItem>
			{#if isLoggedIn || isPublic}
				<NavBarItem disabled={isPublic} href="/scan" style="position: relative;">
					<span class="hidden-xs">Book entry</span>
					<i class="visible-xs fal fa-fw fa-scanner" />
					{#if pendingCount}
						<span class={`number-badge ${pendingCount > 9 ? 'big-count' : ''}`}>
							<span class="overlay-holder">
								<i class="fas fa-badge" />
								<span>{pendingCount}</span>
							</span>
						</span>
					{/if}
				</NavBarItem>
			{/if}
			{#if isLoggedIn || isPublic}
				<NavBarItem href={isPublic ? '/view' : '/books'}
					><span class="hidden-xs">Books</span>
					<i class="visible-xs fal fa-fw fa-books" />
				</NavBarItem>
			{/if}
			{#if isLoggedIn || isPublic}
				<NavBarItem disabled={isPublic} href="/subjects">
					<span class="hidden-xs">Subjects</span>
					<i class="visible-xs fal fa-fw fa-sitemap" />
				</NavBarItem>
			{/if}
			{#if isLoggedIn || isPublic}
				<NavBarItem href="/settings"
					><span class="hidden-xs">Settings</span>
					<i class="visible-xs fal fa-fw fa-cogs" />
				</NavBarItem>
			{/if}
			{#if isLoggedIn && isAdminUser}
				<NavBarItem href="/admin">
					<span class="hidden-xs">Admin</span>
					<i class="visible-xs fal fa-fw fa-users-cog" />
				</NavBarItem>
			{/if}
		</ul>
		<ul class="nav-items-right">
			{#if !isLoggedIn && !isLoginModule}
				<NavBarItem href="/login">
					<span class="hidden-xs">Login</span>
					<i class="visible-xs fal fa-fw fa-sign-in" />
				</NavBarItem>
			{/if}
		</ul>
		{#if isLoggedIn}
			<ul class="nav-items-right">
				<NavBarItem href="/logout">
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
