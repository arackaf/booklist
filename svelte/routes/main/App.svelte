<script>
  import { setContext } from "svelte";
  import Loadable from "svelte-loadable";
  import { history } from "util/urlHelpers";
  import AppUI from "../AppUI.svelte";
  import "util/graphql";

  import { appState, dispatch as appStateDispatch, URL_SYNC } from "app/state/appState";

  // Listen for changes to the current location.
  history.listen(({ location, action }) => {
    appStateDispatch({ type: URL_SYNC });
  });

  $: activeModule = $appState.module;
</script>

<AppUI content={$appState.showingMobile ? 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0; user-scalable=0;' : ''}>
  {#if activeModule == 'home'}
    <Loadable loader={() => import('modules/home/Home.svelte')} />
  {:else if activeModule == 'scan'}
    <Loadable loader={() => import('modules/scan/Scan.svelte')} />
  {:else if activeModule == 'books'}
    <Loadable loader={() => import('modules/books/Books.svelte')} />
  {:else if activeModule == 'subjects'}
    <Loadable loader={() => import('modules/subjects/Subjects.svelte')} />
  {:else if activeModule == 'activate'}
    <Loadable loader={() => import('modules/activate/Activate.svelte')} />
  {/if}
</AppUI>
