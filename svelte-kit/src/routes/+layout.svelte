<script lang="ts">
  import { beforeNavigate, afterNavigate } from "$app/navigation";
  import MainNavigation from "$lib/components/navigation/MainNavigation.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loading from "$lib/components/ui/Loading.svelte";

  import "$styles/fontawesome/css/all.min.css";
  import "$styles/site-styles.scss";
  import "./styles.scss";

  import type { PageData } from "./$types";
  import { NUM_THEMES } from "$lib/util/constants";

  export let data: PageData;

  $: ({ showMobile, uxState } = data);
  $: ({ theme, wbg: whiteBg } = uxState);

  $: {
    if (typeof document === "object") {
      document.body.classList.remove("white-bg");
      for (let i = 0; i < NUM_THEMES; i++) {
        document.body.classList.remove(`scheme${i}`);
      }

      if (whiteBg) {
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
</script>

<div class={`app-container ${theme}`} class:white-bg={whiteBg}>
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
