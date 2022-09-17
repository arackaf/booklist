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

  import "uikit/modal";

  import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
  import "@shoelace-style/shoelace/dist/themes/light.css";

  import { setDefaultAnimation } from "@shoelace-style/shoelace/dist/utilities/animation-registry";

  setDefaultAnimation("dialog.show", {
    keyframes: [
      { opacity: 0, transform: "translate3d(0px, -20px, 0px)" },
      { opacity: 1, transform: "translate3d(0px, 0px, 0px)" }
    ],
    options: { duration: 250, easing: "cubic-bezier(0.785, 0.135, 0.150, 0.860)" }
    // options: { duration: 250, easing: "cubic-bezier(0.800, 0.360, 0.365, 1.315)" }
    // options: { duration: 250, easing: "ease" }
    // options: { duration: 250, easing: "cubic-bezier(0.445, 0.050, 0.550, 0.950)" }
    // options: { duration: 200, easing: "ease-out" }
  });
  setDefaultAnimation("dialog.hide", {
    keyframes: [
      { opacity: 1, transform: "translate3d(0px, 0px, 0px)" },
      { opacity: 0, transform: "translate3d(0px, 20px, 0px)" }
    ],
    //options: { duration: 250, easing: "cubic-bezier(0.445, 0.050, 0.550, 0.950)" }
    //options: { duration: 250, easing: "cubic-bezier(0.190, 1.000, 0.220, 1.000)" }
    // options: { duration: 200, easing: "ease-in" }
    options: { duration: 200, easing: "cubic-bezier(0.785, 0.135, 0.150, 0.860)" }
  });

  setDefaultAnimation("dialog.overlay.show", {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 200, easing: "cubic-bezier(0.190, 1.000, 0.220, 1.000)" }
  });
  setDefaultAnimation("dialog.overlay.hide", {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    // options: { duration: 200, easing: "cubic-bezier(0.190, 1.000, 0.220, 1.000)" }
    options: { duration: 200, easing: "cubic-bezier(0.785, 0.135, 0.150, 0.860)" }
  });

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
