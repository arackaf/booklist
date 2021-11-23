<script lang="ts">
  import ModuleRoute from "app/components/navigation/ModuleRoute.svelte";

  import { history } from "util/urlHelpers";
  import AppUI from "../AppUI.svelte";
  import "util/graphql";

  import booksPreload from "./booksPreload";
  import { appState, dispatch as appStateDispatch, URL_SYNC } from "app/state/appState";
  import setupServiceWorker from "../../util/setupServiceWorker";

  import { scanWebSocket, checkPendingCount, dispatchScanDataUpdate } from "util/scanUtils";
  import { getCookieLookup, isLoggedIn } from "util/loginStatus";

  import Toastify from "toastify-js";
  import "toastify-js/src/toastify.css";

  const cookieHash = getCookieLookup();

  if (isLoggedIn()) {
    checkPendingCount();
    scanWebSocket.send({ action: "sync", userId: cookieHash.userId, loginToken: cookieHash.loginToken });

    scanWebSocket.addHandler(data => {
      let packet = JSON.parse(data);

      dispatchScanDataUpdate(packet);
    });
  }

  function showBookToast(title, url) {
    Toastify({
      text: `<div><img src="${url}" ></div><span>${title}</span>`,
      escapeMarkup: false,
      duration: 5 * 1000,
      gravity: "bottom",
      close: true,
      className: "toast-notification book-loaded"
    }).showToast();
  }

  history.listen(() => {
    appStateDispatch({ type: URL_SYNC });
  });

  setupServiceWorker();

  window.addEventListener("ws-info", ({ detail }: any) => {
    if (detail.type === "scanResults" && $appState.module !== "scan") {
      for (const { item: book } of detail.packet.results.filter(result => result.success)) {
        showBookToast(book.title, book.smallImage);
      }
    }
  });
</script>

<AppUI content={$appState.showingMobile ? "width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0; user-scalable=0;" : ""}>
  <ModuleRoute moduleName="home" loader={() => import(/* webpackChunkName: "home-module" */ "modules/home/Home.svelte")} />
  <ModuleRoute moduleName="scan" loader={() => import(/* webpackChunkName: "scan-module" */ "modules/scan/Scan.svelte")} />
  <ModuleRoute moduleName="books" preload={booksPreload} loader={() => import(/* webpackChunkName: "books-module" */ "modules/books/Books.svelte")} />
  <ModuleRoute moduleName="view" preload={booksPreload} loader={() => import(/* webpackChunkName: "books-module" */ "modules/books/Books.svelte")} />
  <ModuleRoute moduleName="subjects" loader={() => import(/* webpackChunkName: "subjects-module" */ "modules/subjects/Subjects.svelte")} />
  <ModuleRoute moduleName="settings" loader={() => import(/* webpackChunkName: "settings-module" */ "modules/settings/Settings.svelte")} />
  <ModuleRoute moduleName="activate" loader={() => import(/* webpackChunkName: "activate-module" */ "modules/activate/Activate.svelte")} />
  <ModuleRoute moduleName="admin" loader={() => import(/* webpackChunkName: "admin-module" */ "modules/admin/Admin.svelte")} />
  <ModuleRoute moduleName="authenticate" loader={() => import(/* webpackChunkName: "admin-module" */ "modules/login/Login.svelte")} />
</AppUI>
