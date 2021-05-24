<script lang="ts">
  import ModuleRoute from "app/components/navigation/ModuleRoute.svelte";

  import { history } from "util/urlHelpers";
  import AppUI from "../AppUI.svelte";
  import "util/graphql";

  import booksPreload from "./booksPreload";

  import { appState, dispatch as appStateDispatch, URL_SYNC } from "app/state/appState";

  import setupServiceWorker from "../../util/setupServiceWorker";

  history.listen(() => {
    appStateDispatch({ type: URL_SYNC });
  });

  let ws = new WebSocket(webSocketAddress("/bookEntryWS"));

  ws.onmessage = ({ data }) => {
    let packet = JSON.parse(data);
    window.dispatchEvent(new CustomEvent("ws-info", { detail: { type: packet._messageType, packet } }));
  };

  ws.onopen = () => {
    ws.send(`SYNC`);
    window.addEventListener("sync-ws", () => {
      ws.send(`SYNC`);
    });
  };

  window.onbeforeunload = function () {
    ws.onclose = function () {}; // disable onclose handler first
    ws.close();
  };

  setupServiceWorker();

</script>

<AppUI content={$appState.showingMobile ? "width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0; user-scalable=0;" : ""}>
  <ModuleRoute moduleName="home" loader={() => import(/* webpackChunkName: "home-module" */ "modules/home/Home.svelte")} />
  <ModuleRoute moduleName="scan" loader={() => import(/* webpackChunkName: "scan-module" */ "modules/scan/Scan.svelte")} />
  <ModuleRoute moduleName="books" preload={booksPreload} loader={() => import(/* webpackChunkName: "books-module" */ "modules/books/Books.svelte")} />
  <ModuleRoute moduleName="view" preload={booksPreload} loader={() => import(/* webpackChunkName: "books-module" */ "modules/books/Books.svelte")} />
  <ModuleRoute moduleName="subjects" loader={() => import(/* webpackChunkName: "subjects-module" */ "modules/subjects/Subjects.svelte")} />
  <ModuleRoute moduleName="settings" loader={() => import(/* webpackChunkName: "settings-module" */ "modules/settings/Settings.svelte")} />
  <ModuleRoute moduleName="activate" loader={() => import(/* webpackChunkName: "activate-module" */ "modules/activate/Activate.svelte")} />
</AppUI>
