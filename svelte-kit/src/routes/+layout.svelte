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

  export let data: any;

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

  const publicModules = new Set(["/", "/discover", "/books", "/settings/theme"]);
  $: console.log({ data });

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

  function showBookToast(title: string, url: string) {
    Toastify({
      text: `<div><img alt="Book cover for recently scanned ${title}" src="${url}" ></div><span>${title}</span>`,
      escapeMarkup: false,
      duration: 5 * 1000,
      gravity: "bottom",
      close: true,
      className: "toast-notification book-loaded"
    }).showToast();
  }

  function startToastListen() {
    window.addEventListener("ws-info", ({ detail }: any) => {
      if (detail.type === "scanResults" && $page.url.pathname !== "/scan") {
        for (const { item: book } of detail.packet.results.filter((result: any) => result.success)) {
          showBookToast(book.title, book.smallImage);
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
