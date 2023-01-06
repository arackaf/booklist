<script lang="ts">
  import { page } from "$app/stores";
  //import { appState, requestDesktop, requestMobile } from "app/state/appState";

  const requestDesktop = () => {};
  const requestMobile = () => {};

  $: ({ isMobile, desktopRequested } = $page.data);

  $: showChooseDesktop = isMobile && !desktopRequested;
  $: showSwitchBackMobile = isMobile && desktopRequested;
</script>

<footer>
  <i class="fal fa-book" />
  <span style="margin-left: 5px; margin-right: 5px">My Library</span>
  {#if showChooseDesktop}
    <button class="raw-button cursor-pointer" name="Use desktop version" on:click={requestDesktop}>Use desktop version</button>
  {/if}
  {#if showSwitchBackMobile}
    <button class="raw-button cursor-pointer" name="Use mobile version" on:click={requestMobile}>Use mobile version</button>
  {/if}
</footer>
