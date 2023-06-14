<script lang="ts">
  import { getContext } from "svelte";
  import localStorageManager from "$lib/util/localStorage";

  export let tabName = "";

  const tabsState: any = getContext("tabs-state");
  $: ({ currentTab, setTab, localStorageName } = $tabsState);

  $: active = tabName == currentTab;

  const onClick = () => {
    if (localStorageName) {
      localStorageManager.set(localStorageName, tabName);
    }
    setTab(tabName);
  };
</script>

<div class="border-primary-9" class:bg-primary-10={active} class:border-b={active}>
  <button on:click={onClick} type="button" class="raw-button overlay-holder" style="padding: 4px 8px" class:cursor-default={active}>
    <span class:font-bold={active}><slot /></span>
    <span class="invisible font-bold"><slot /></span>
  </button>
</div>
