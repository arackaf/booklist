<script lang="ts">
  import "./styles.scss";
  import "$styles/fontawesome/css/all.min.css";
  import "$styles/site-styles.scss";

  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { beforeNavigate, afterNavigate } from "$app/navigation";

  import MainNavigation from "$lib/components/navigation/MainNavigation.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loading from "$lib/components/ui/Loading.svelte";

  import { NUM_THEMES } from "$lib/util/constants";
  import { checkPendingCount } from "$lib/util/scanUtils";

  export let data: PageData;

  $: ({ showMobile, uxState, loggedIn } = data);
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

  let navigating = false;

  beforeNavigate(({ type }) => {
    navigating = true;
  });

  afterNavigate(({ type }) => {
    navigating = false;
  });

  onMount(() => {
    if (loggedIn) {
      checkPendingCount();
    }
  });
</script>

<div class={`app-container ${theme}`} class:white-bg={whiteBg === "1"}>
  <div id="app">
    <MainNavigation />
    <main>
      {#if navigating}
        <Loading />
      {/if}
      <slot />

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
