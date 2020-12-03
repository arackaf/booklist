<script>
  import { setContext } from "svelte";
  import Loadable from "svelte-loadable";
  import { createBrowserHistory } from "history";
  import ajaxUtil from "util/ajaxUtil";

  import Query from "graphQL/books/getBooks.graphql";

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
<a href="/login">Login</a>

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
<h2>{Query}</h2>
