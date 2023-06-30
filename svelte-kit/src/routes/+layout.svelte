<script lang="ts">
  import "toastify-js/src/toastify.css";

  import "../app.css";

  import { beforeNavigate, afterNavigate } from "$app/navigation";

  import MainNavigation from "$lib/components/navigation/MainNavigation.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loading from "$lib/components/ui/Loading.svelte";

  import { NUM_THEMES } from "$lib/util/constants";

  export let data;

  $: ({ showMobile, uxState } = data);
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
    if (type === "leave") {
      return;
    }
    navigating = true;
  });

  afterNavigate(() => {
    navigating = false;
  });
</script>

<div class={`app-container overflow-hidden h-screen w-screen ${theme}`} class:white-bg={whiteBg === "1"}>
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
