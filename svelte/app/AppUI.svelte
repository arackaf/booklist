<script lang="ts">
  import { onMount } from "svelte";
  import { appState } from "app/state/appState";
  import Footer from "app/components/Footer.svelte";
  import MainNavigation from "app/components/navigation/MainNavigation.svelte";

  onMount(() => {
    document.documentElement.scrollTop = 0;
    if ($appState.isMobile) {
      function setAdjustedVh() {
        let vh = window.innerHeight * 0.01 + "px";
        document.documentElement.style.setProperty("--adjusted-vh", vh);
      }

      window.addEventListener("resize", setAdjustedVh);

      let pinching = false;
      window.addEventListener("gesturestart", () => {
        pinching = true;
      });
      window.addEventListener("gestureend", () => {
        pinching = false;
        setTimeout(() => setAdjustedVh(), 1);
        setTimeout(() => setAdjustedVh(), 100);
        setTimeout(() => setAdjustedVh(), 250);
        setTimeout(() => setAdjustedVh(), 750);
      });
      setAdjustedVh();
      setTimeout(setAdjustedVh, 10); //Chrome iOS
      setTimeout(setAdjustedVh, 100);
      setTimeout(setAdjustedVh, 250);
    }
  });

  const metaTag = document.querySelector("meta[name='viewport']");

  $: {
    metaTag.setAttribute("content", $appState.desktopRequested ? "" : "width=device-width, initial-scale=1, maximum-scale=5.0");
  }
</script>

<style>
  .app-container {
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }
</style>

<div class="app-container">
  <div id="app">
    <MainNavigation />
    <main>
      <slot />
      {#if $appState.isMobile}
        <Footer />
      {/if}
    </main>
    {#if !$appState.isMobile}
      <Footer />
    {/if}
  </div>
</div>
