<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import localStorageManager from "$lib/util/localStorage";

  export let defaultTab = "";
  export let localStorageName = "";

  let currentTab = localStorageManager.get(localStorageName) || defaultTab;

  const setTab = (tab: string) => tabState.update(state => ({ ...state, currentTab: tab }));
  let tabState = writable({ localStorageName, currentTab, setTab });

  setContext("tabs-state", tabState);
</script>

<slot />
