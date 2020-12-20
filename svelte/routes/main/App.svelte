<script lang="ts">
  import ModuleRoute from "app/components/navigation/ModuleRoute.svelte";

  import navigationState from "app/components/navigation/navigationState";
  const { navStore, moduleLoaded } = navigationState;

  import { history } from "util/urlHelpers";
  import AppUI from "../AppUI.svelte";
  import "util/graphql";

  import { appState, dispatch as appStateDispatch, URL_SYNC } from "app/state/appState";

  history.listen(() => {
    appStateDispatch({ type: URL_SYNC });
  });

  const booksPreload = () => {
    return new Promise(res => setTimeout(res, 2000))
  };
</script>

<AppUI content={$appState.showingMobile ? 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0; user-scalable=0;' : ''}>
  <ModuleRoute moduleName="home" loader={() => import(/* webpackChunkName: "home-module" */ 'modules/home/Home.svelte')} />
  <ModuleRoute moduleName="scan" loader={() => import(/* webpackChunkName: "scan-module" */ 'modules/scan/Scan.svelte')} />
  <ModuleRoute moduleName="books" preload={booksPreload} loader={() => import(/* webpackChunkName: "books-module" */ 'modules/books/Books.svelte')} />
  <ModuleRoute moduleName="subjects" loader={() => import(/* webpackChunkName: "subjects-module" */ 'modules/subjects/Subjects.svelte')} />
  <ModuleRoute moduleName="activate" loader={() => import(/* webpackChunkName: "activate-module" */ 'modules/activate/Activate.svelte')} />
</AppUI>
