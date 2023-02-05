<script lang="ts">
  import "$styles/fontawesome/css/all.min.css";
  import "$styles/site-styles.scss";

  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import Toastify from "toastify-js";
  import "toastify-js/src/toastify.css";

  import { beforeNavigate, afterNavigate } from "$app/navigation";

  import MainNavigation from "$lib/components/navigation/MainNavigation.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loading from "$lib/components/ui/Loading.svelte";

  import { NUM_THEMES } from "$lib/util/constants";
  import { checkPendingCount, dispatchScanDataUpdate, getScanWebSocket } from "$lib/util/scanUtils";
  import PublicLandingPage from "./PublicLandingPage.svelte";
  import type { Book } from "$data/types";
  import ScanToasterContent from "$lib/components/ui/ScanToasterContent.svelte";

  export let data: any;

  const publicModules = new Set(["/", "/discover", "/books", "/settings/theme"]);

  $: ({ showMobile, uxState, loggedIn, hasPublicUserId, userId } = data);
  $: ({ theme, wbg: whiteBg } = uxState);

  $: {
    if (typeof document === "object") {
      document.body.classList.remove("white-bg");
      for (let i = 0; i < NUM_THEMES; i++) {
        document.body.classList.remove(`scheme${i}`);
      }

      if (whiteBg === "1") {
        document.body.classList.add("white-bg");
      }
      document.body.classList.add(theme);
    }
  }

  $: currentPath = $page.url.pathname;
  $: showContent = loggedIn || (hasPublicUserId && publicModules.has(currentPath));

  let navigating = false;
  beforeNavigate(({ type }) => {
    navigating = true;
  });

  afterNavigate(({ type }) => {
    navigating = false;
  });

  function startWebSocket() {
    const scanWebSocket = getScanWebSocket();
    scanWebSocket.send({ action: "sync", userId });

    scanWebSocket.addHandler((data: any) => {
      let packet = JSON.parse(data);

      dispatchScanDataUpdate(packet);
    });
  }

  function showBookToast(book: Book) {
    const { title, smallImage } = book;

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
    showBookToast({
      title: "This is a very very very long title",
      authors: ["Richard Dawkins", "Stephan Jay Gould", "Carl Sagan"],
      mobileImage:
        "https://my-library-cover-uploads.s3.amazonaws.com/medium-covers/60a93babcc3928454b5d1cc6/24782c1d-2425-4030-8515-ae816f55f27f.jpg",
      mobileImagePreview: {
        w: 35,
        h: 46,
        b64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMUlEQVR4nGMoy81vaWk5f/48w7Yd2xNjI7o72xmiI0JFORi+ffnEEOjn3dvZ/vPnTwB8sxOVv4T/PgAAAABJRU5ErkJggg=="
      },
      smallImage: "https://my-library-cover-uploads.s3.amazonaws.com/medium-covers/60a93babcc3928454b5d1cc6/24782c1d-2425-4030-8515-ae816f55f27f.jpg",
      smallImagePreview: {
        w: 50,
        h: 66,
        b64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMUlEQVR4nGMoy81vaWk5f/48w7Yd2xNjI7o72xmiI0JFORi+ffnEEOjn3dvZ/vPnTwB8sxOVv4T/PgAAAABJRU5ErkJggg=="
      },
      mediumImage:
        "https://my-library-cover-uploads.s3.amazonaws.com/medium-covers/60a93babcc3928454b5d1cc6/24782c1d-2425-4030-8515-ae816f55f27f.jpg",
      mediumImagePreview: {
        w: 106,
        h: 139,
        b64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMUlEQVR4nGMoy81vaWk5f/48w7Yd2xNjI7o72xmiI0JFORi+ffnEEOjn3dvZ/vPnTwB8sxOVv4T/PgAAAABJRU5ErkJggg=="
      }
    } as any);

    window.addEventListener("ws-info", ({ detail }: any) => {
      if (detail.type === "scanResults") {
        fetch("/api/clear-books-cache", { method: "POST" });
        if ($page.url.pathname !== "/scan") {
          for (const { item: book } of detail.packet.results.filter((result: any) => result.success)) {
            showBookToast(book);
            console.log("Showing", book);
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

<div class={`app-container ${theme}`} class:white-bg={whiteBg === "1"}>
  <div id="app">
    <MainNavigation />
    <main>
      {#if navigating}
        <Loading />
      {/if}

      {#if showContent}
        <slot />
      {:else}
        <PublicLandingPage />
      {/if}

      {#if showMobile}
        <Footer />
      {/if}
    </main>
    {#if !showMobile}
      <Footer />
    {/if}
  </div>
</div>

<style>
  .app-container {
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }
</style>
