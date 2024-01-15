<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import Toastify from "toastify-js";
  import "toastify-js/src/toastify.css";

  import { checkPendingCount, dispatchScanDataUpdate, getScanWebSocket } from "$lib/util/scanUtils";
  import type { Book } from "$data/types";
  import ScanToasterContent from "$lib/components/ScanToasterContent.svelte";

  export let data;

  $: ({ loggedIn, userId } = data);

  function startWebSocket() {
    const scanWebSocket = getScanWebSocket();
    scanWebSocket.send({ action: "sync", userId });

    scanWebSocket.addHandler((data: any) => {
      let packet = JSON.parse(data);

      dispatchScanDataUpdate(packet);
    });
  }

  function showBookToast(book: Book) {
    const node = document.createElement("div");

    new ScanToasterContent({
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

  function startToastListen() {
    window.addEventListener("ws-info", ({ detail }: any) => {
      if (detail.type === "scanResults") {
        fetch("/api/clear-books-cache", { method: "POST" });
        if ($page.url.pathname !== "/scan") {
          for (const { item: book } of detail.packet.results.filter((result: any) => result.success)) {
            showBookToast(book);
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
