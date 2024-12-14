<script lang="ts">
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";

  const requestDesktop = () => {
    fetch("/api/device-override/view-desktop").then(() => {
      invalidate("app:root");
    });
  };

  const requestMobile = () => {
    fetch("/api/device-override/view-mobile").then(() => {
      invalidate("app:root");
    });
  };

  let { isMobile, uxState } = $derived($page.data);
  let { desktopRequested } = $derived(uxState);

  let showChooseDesktop = $derived(isMobile && desktopRequested !== "1");
  let showSwitchBackMobile = $derived(isMobile && desktopRequested === "1");
</script>

<footer>
  <i class="fal fa-book"></i>
  <span style="margin-left: 5px; margin-right: 5px">My Library</span>
  {#if showChooseDesktop}
    <button class="raw-button cursor-pointer" name="Use desktop version" onclick={requestDesktop}> Use desktop version </button>
  {/if}
  {#if showSwitchBackMobile}
    <button class="raw-button cursor-pointer" name="Use mobile version" onclick={requestMobile}> Use mobile version </button>
  {/if}
</footer>
