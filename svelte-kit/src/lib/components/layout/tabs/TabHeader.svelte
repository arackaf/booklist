<script lang="ts">
  import { getContext } from "svelte";
  import cn from "classnames";
  import localStorageManager from "$lib/util/localStorage";

  export let tabName = "";
  export let disabled = false;

  const tabsState: any = getContext("tabs-state");
  $: ({ currentTab, setTab, localStorageName } = $tabsState);

  $: active = tabName == currentTab;

  const onClick = () => {
    if (!disabled) {
      if (localStorageName) {
        localStorageManager.set(localStorageName, tabName);
      }
      setTab(tabName);
    }
  };
</script>

<div class={cn("tab-header", { disabled, active })}>
  <button on:click={onClick} type="button" class="raw-button overlay-holder">
    <span class:active><slot /></span>
    <span class="placeholder"><slot /></span>
  </button>
</div>

<style>
  span.active {
    font-weight: bold;
  }
  span.placeholder {
    visibility: hidden;
    font-weight: bold;
  }
</style>
