<script lang="ts">
  import { appState, requestDesktop, requestMobile } from "app/state/appState";

  $: showChooseDesktop = $appState.isMobile && $appState.showingMobile;
  $: showSwitchBackMobile = $appState.isMobile && $appState.showingDesktop;
</script>

<footer>
  <i class="fal fa-book" />
  <span style="margin-left: 5px; margin-right: 5px">My Library</span>
  {#if showChooseDesktop}<a on:click={requestDesktop}>Use desktop version</a>{/if}
  {#if showSwitchBackMobile}<a on:click={requestMobile}>Use mobile version</a>{/if}
</footer>
