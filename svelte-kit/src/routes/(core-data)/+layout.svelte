<script lang="ts">
  import { mount, onMount } from "svelte";
  import { authClient } from "$lib/auth-client";

  import Toastify from "toastify-js";

  import { checkPendingCount, dispatchScanDataUpdate, getScanWebSocket } from "$lib/util/scanUtils";
  import type { Book } from "$data/types";
  import ScanToasterSuccessContent from "$lib/components/ScanToasterResultContent.svelte";

  let { data, children } = $props();
  let { loggedIn, userId } = $derived(data);

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
      props: { book, success: true }
    });

    Toastify({
      node,
      escapeMarkup: false,
      duration: 5 * 1000,
      gravity: "bottom",
      close: true,
      className: "toast-notification"
    }).showToast();
  }

  function showBookFailureToast(book: Book) {
    const node = document.createElement("div");

    mount(ScanToasterSuccessContent, {
      target: node,
      props: { book, success: false }
    });

    Toastify({
      node,
      escapeMarkup: false,
      duration: 5 * 1000,
      gravity: "bottom",
      close: true,
      className: "toast-notification"
    }).showToast();
  }

  function startToastListen() {
    window.addEventListener("ws-info", ({ detail }: any) => {
      if (detail.type === "scanResults") {
        fetch("/api/clear-books-cache", { method: "POST" });

        for (const { success, item: bookMaybe } of detail.packet.results) {
          if (success) {
            showBookToast(bookMaybe);
          } else {
            showBookFailureToast(bookMaybe);
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

{@render children()}
