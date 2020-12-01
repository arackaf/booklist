<script>
  import { setContext } from "svelte";
  import Loadable from "svelte-loadable";
  import { createBrowserHistory } from "history";
  import ajaxUtil from "./util/ajaxUtil";

  import Link from "app/Link.svelte";

  let currentModule = "";

  const history = createBrowserHistory();

  setContext("booklist-history", history);

  syncHistory(history.location);

  // Listen for changes to the current location.
  let unlisten = history.listen(({ location, action }) => {
    syncHistory(location);
  });

  function syncHistory(location) {
    currentModule = location.pathname.replace(/^\//, "") || "home";
  }
</script>

<Link href="">Home</Link>
<Link href="books">Books</Link>
<Link href="subjects">Subjects</Link>
<!-- <Link href="login">Login</Link> -->
<a href="/login">Login</a>

<br />
<br />
<button on:click={() => ajaxUtil.post("/react/logout", {}, () => window.location = "/")}>Logout</button>

{#if currentModule == 'home'}
  <Loadable loader={() => import('./modules/home/Home.svelte')} />
{:else if currentModule == 'books'}
  <Loadable loader={() => import('./modules/books/Books.svelte')} />
{:else if currentModule == 'subjects'}
  <Loadable loader={() => import('./modules/subjects/Subjects.svelte')} />
{:else if currentModule == 'login'}
  <Loadable loader={() => import('./modules/login/Login.svelte')} />
{/if}
