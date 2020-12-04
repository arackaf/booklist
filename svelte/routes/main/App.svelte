<script>
  import { setContext } from "svelte";
  import Loadable from "svelte-loadable";
  import { history } from "util/urlHelpers";

  import { appState, dispatch as appStateDispatch, URL_SYNC } from "app/state/appState";
  import ajaxUtil from "util/ajaxUtil";

  import Query from "graphQL/books/getBooks.graphql";

  import MainNavigation from "app/components/navigation/MainNavigation.svelte";
  import Link from "app/components/helpers/Link.svelte";

  let currentModule = "";

  setContext("booklist-history", history);

  syncHistory(history.location);

  // Listen for changes to the current location.
  let unlisten = history.listen(({ location, action }) => {
    appStateDispatch({ type: URL_SYNC });
    syncHistory(location);
  });

  function syncHistory(location) {
    currentModule = location.pathname.replace(/^\//, "") || "home";
  }
</script>

<style>
  .app-container {
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }
</style>

<meta
  name="viewport"
  content={$appState.showingMobile ? 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0; user-scalable=0;' : ''} />
  
<div class="app-container">
  <div id="app">
    <MainNavigation />
  </div>
</div>

<!-- <Link href="">Default</Link>
<Link href="home">Home</Link>
<Link href="books">Books</Link>
<Link href="subjects">Subjects</Link>
<a href="/login">Login</a>

<br />
<br />

<h1>App State: {$appState.module}</h1>

<br />
<br />
<button on:click={() => ajaxUtil.post('/auth/logout', {}, () => (window.location = '/'))}>Logout</button>

{#if currentModule == 'home'}
  <Loadable loader={() => import('../../modules/home/Home.svelte')} />
{:else if currentModule == 'books'}
  <Loadable loader={() => import('../../modules/books/Books.svelte')} />
{:else if currentModule == 'subjects'}
  <Loadable loader={() => import('../../modules/subjects/Subjects.svelte')} />
{/if}

<hr />
<h2>{Query}</h2> -->
