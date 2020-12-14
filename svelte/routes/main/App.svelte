<script>
  import ModuleRoute from "app/components/navigation/ModuleRoute.svelte";

  import { history } from "util/urlHelpers";
  import AppUI from "../AppUI.svelte";
  import "util/graphql";

  import { appState, dispatch as appStateDispatch, URL_SYNC } from "app/state/appState";

  history.listen(() => {
    appStateDispatch({ type: URL_SYNC });
  });

  const booksPreload = () => {};
</script>

<AppUI content={$appState.showingMobile ? 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0; user-scalable=0;' : ''}>
  <ModuleRoute moduleName="home" loader={() => import('modules/home/Home.svelte')} />
  <ModuleRoute moduleName="scan" loader={() => import('modules/scan/Scan.svelte')} />
  <ModuleRoute moduleName="books" preload={booksPreload} loader={() => import('modules/books/Books.svelte')} />
  <ModuleRoute moduleName="subjects" loader={() => import('modules/subjects/Subjects.svelte')} />
  <ModuleRoute moduleName="activate" loader={() => import('modules/activate/Activate.svelte')} />
</AppUI>
