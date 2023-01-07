<script lang="ts">
  import { onMount } from "svelte";
  import { beforeNavigate, afterNavigate } from "$app/navigation";
  import MainNavigation from "$lib/components/navigation/MainNavigation.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loading from "$lib/components/ui/Loading.svelte";

  import "$styles/fontawesome/css/all.min.css";
  import "$styles/site-styles.scss";
  import "./styles.scss";

  import type { PageData } from "./$types";

  export let data: PageData;

  $: ({ showMobile } = data);

  const theme = "scheme5";
  onMount(() => {
    document.body.classList.add(theme);
  });

  let navigating = false;

  beforeNavigate(({ type }) => {
    navigating = true;
  });

  afterNavigate(({ type }) => {
    navigating = false;
  });
</script>

<div class={`app-container ${theme}`}>
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
