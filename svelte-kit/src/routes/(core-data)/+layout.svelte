<script lang="ts">
  import { mount, onMount } from "svelte";

  import Toastify from "toastify-js";
  import "toastify-js/src/toastify.css";

  import { checkPendingCount, dispatchScanDataUpdate, getScanWebSocket } from "$lib/util/scanUtils";
  import type { Book } from "$data/types";
  import ScanToasterSuccessContent from "$lib/components/ScanToasterResultContent.svelte";

  $effect(() => {
    setTimeout(() => {
      const fail = {
        _id: "b26fe39d-67ab-4482-8027-823d8db87c7c",
        title: "Failed lookup for 9988776655"
      };

      const success = {
        success: true,
        item: {
          title: "The Forging of the Union, 1781-1789 (New American Nation Series)",
          authors: ["Richard B. Morris"],
          smallImage:
            "https://my-library-cover-uploads.s3.amazonaws.com/medium-covers/573d1b97120426ef0078aa92/61af7adf-80c4-4122-848d-0938fbd86245.jpg",
          smallImagePreview: {
            w: 50,
            h: 75,
            b64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/ALymQZSBJsOrSAB+chUXEABnYAkAx6RCTTsAtpc6AP/vgOi9Vv/ufjI6ESGQHZPBAAAAAElFTkSuQmCC"
          }
        }
      };

      showBookToast(success.item as any);
      showBookFailureToast(fail as any);
    }, 1000);
  });
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
