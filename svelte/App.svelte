<script>
  import { setContext } from "svelte";
  import { createBrowserHistory } from "history";

  import Link from "app/Link.svelte";

  const history = createBrowserHistory();

  setContext("booklist-history", history);

  syncHistory(history.location);

  // Listen for changes to the current location.
  let unlisten = history.listen(({ location, action }) => {
    syncHistory(location);
  });

  function syncHistory(location) {
    console.log(location.pathname, location.state);
  }

</script>

<Link href="books">Books</Link>
<Link href="subjects">Subjects</Link>
<Link href="login">Login</Link>