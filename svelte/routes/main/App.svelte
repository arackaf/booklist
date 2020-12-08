<script>
  import { setContext } from "svelte";
  import Loadable from "svelte-loadable";
  import { history } from "util/urlHelpers";
  import AppUI from "../AppUI.svelte";
  import "util/graphql";

  import { appState, dispatch as appStateDispatch, URL_SYNC } from "app/state/appState";
  import ajaxUtil from "util/ajaxUtil";

  import Query from "graphQL/books/getBooks.graphql";
  import Link from "app/components/navigation/ModuleLink.svelte";

  let currentModule = "";

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

<AppUI content={$appState.showingMobile ? 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0; user-scalable=0;' : ''}>
  {#if currentModule == 'home'}
    <Loadable loader={() => import('modules/home/Home.svelte')} />
  {:else if currentModule == 'scan'}
    <Loadable loader={() => import('modules/scan/Scan.svelte')} />
  {:else if currentModule == 'books'}
    <Loadable loader={() => import('modules/books/Books.svelte')} />
  {:else if currentModule == 'subjects'}
    <Loadable loader={() => import('modules/subjects/Subjects.svelte')} />
  {:else if currentModule == 'activate'}
    <Loadable loader={() => import('modules/activate/Activate.svelte')} />
  {/if}
</AppUI>
