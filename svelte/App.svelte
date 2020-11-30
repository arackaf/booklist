<script>
  import { setContext } from "svelte";
  import Loadable from "svelte-loadable";
  import { createBrowserHistory } from "history";

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
    currentModule = location.pathname.replace(/^\//, "");
  }
</script>

<Link href="books">Books</Link>
<Link href="subjects">Subjects</Link>
<Link href="login">Login</Link>
{#if currentModule == 'books'}
  <Loadable loader={() => import('./modules/books/Books.svelte')} />
{:else if currentModule == 'subjects'}
  <Loadable loader={() => import('./modules/subjects/Subjects.svelte')} />
{:else if currentModule == 'login'}
  <Loadable loader={() => import('./modules/login/Login.svelte')} />
{/if}
