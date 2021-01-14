<script lang="ts">
  import { appState } from "app/state/appState";
  import Footer from "app/components/Footer.svelte";
  import MainNavigation from "app/components/navigation/MainNavigation.svelte";

  export let content = null;
</script>

<style>
  .app-container {
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }
</style>

<meta name="viewport" {content} />
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
