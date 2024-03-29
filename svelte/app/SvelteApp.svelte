<script lang="ts">
  import ModuleRoute from "app/components/navigation/ModuleRoute.svelte";
  import { appState, dispatch as appStateDispatch, URL_SYNC } from "app/state/appState";
  import booksPreload from "modules/books/booksPreload";

  import "util/graphql";
  import { history } from "util/urlHelpers";
  import { scanWebSocket, checkPendingCount, dispatchScanDataUpdate } from "util/scanUtils";
  import { getCookieLookup, isLoggedIn } from "util/loginStatus";
  import setupServiceWorker from "util/setupServiceWorker";

  import AppUI from "app/AppUI.svelte";

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
      text: `<div><img alt="Book cover for recently scanned ${title}" src="${url}" ></div><span>${title}</span>`,
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

<AppUI>
  <ModuleRoute moduleName="home" loader={() => import("modules/home/Home.svelte")} />
  <ModuleRoute moduleName="scan" loader={() => import("modules/scan/Scan.svelte")} />
  <ModuleRoute moduleName="books" preload={booksPreload} loader={() => import("modules/books/Books.svelte")} />
  <ModuleRoute moduleName="view" preload={booksPreload} loader={() => import("modules/books/Books.svelte")} />
  <ModuleRoute moduleName="subjects" loader={() => import("modules/subjects/Subjects.svelte")} />
  <ModuleRoute moduleName="settings" loader={() => import("modules/settings/Settings.svelte")} />
  <ModuleRoute moduleName="activate" loader={() => import("modules/activate/Activate.svelte")} />
  <ModuleRoute moduleName="admin" loader={() => import("modules/admin/Admin.svelte")} />
  <ModuleRoute moduleName="authenticate" loader={() => import("modules/login/Login.svelte")} />
</AppUI>
