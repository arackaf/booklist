<script lang="ts">
  import { mount, onMount } from "svelte";
  import { page } from "$app/stores";

  import Toastify from "toastify-js";
  import "toastify-js/src/toastify.css";

  import { checkPendingCount, dispatchScanDataUpdate, getScanWebSocket } from "$lib/util/scanUtils";
  import type { Book } from "$data/types";
  import ScanToasterSuccessContent from "$lib/components/ScanToasterSuccessContent.svelte";

  export let data;

  $: ({ loggedIn, userId } = data);

  function startWebSocket() {
    if (window.ws) {
      return;
    }

    window.ws = getScanWebSocket();
    window.ws.send({ action: "sync", userId });

    window.ws.addHandler((data: any) => {
      let packet = JSON.parse(data);

      dispatchScanDataUpdate(packet);
    });
  }

  function showBookToast(book: Book) {
    const node = document.createElement("div");

    mount(ScanToasterSuccessContent, {
      target: node,
      props: { book }
    });

    Toastify({
      node,
      escapeMarkup: false,
      duration: 5 * 1000,
      gravity: "bottom",
      close: true,
      className: "toast-notification success"
    }).showToast();
  }

  function showBookFailureToast(book: Book) {
    const node = document.createElement("div");

    mount(ScanToasterSuccessContent, {
      target: node,
      props: { book }
    });

    Toastify({
      node,
      escapeMarkup: false,
      duration: 5 * 1000,
      gravity: "bottom",
      close: true,
      className: "toast-notification error"
    }).showToast();
  }

  function startToastListen() {
    window.addEventListener("ws-info", ({ detail }: any) => {
      if (detail.type === "scanResults") {
        fetch("/api/clear-books-cache", { method: "POST" });
        if ($page.url.pathname !== "/scan") {
          for (const { success, item: bookMaybe } of detail.packet.results) {
            if (success) {
              showBookToast(bookMaybe);
            } else {
              showBookFailureToast(bookMaybe);
            }
          }
        }
      }
    });
  }

  onMount(() => {
    if (loggedIn) {
      checkPendingCount();
    }

    startWebSocket();
    startToastListen();
  });
</script>

<slot />
