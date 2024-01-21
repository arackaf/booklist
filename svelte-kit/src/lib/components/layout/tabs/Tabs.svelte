<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import localStorageManager from "$lib/util/localStorage";

  export let defaultTab = "";
  export let localStorageName = "";

  export let currentTab = localStorageManager.get(localStorageName) || defaultTab;

  export const setTab = (tab: string) => tabState.update(state => ({ ...state, currentTab: tab }));
  let tabState = writable({ localStorageName, currentTab, setTab });

  $: {
    currentTab = $tabState.currentTab;
  }

  setContext("tabs-state", tabState);
</script>

<slot />
