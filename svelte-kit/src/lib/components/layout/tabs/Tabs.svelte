<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { get, writable } from "svelte/store";

  import localStorageManager from "$lib/util/localStorage";

  type Props = {
    defaultTab: string;
    localStorageName?: string;
    currentTab?: string;
  };

  const setTab = (tab: string) => tabState.update(state => ({ ...state, currentTab: tab }));

  let {
    defaultTab = "",
    localStorageName = "",
    // default state set in onMount
    currentTab: _currentTab = $bindable()
  }: Props = $props();

  const initialDefaultTab = localStorageManager.get(localStorageName) || defaultTab;

  onMount(() => {
    _currentTab = initialDefaultTab;
  });

  let tabState = writable({ localStorageName, currentTab: initialDefaultTab, setTab });

  $effect(() => {
    _currentTab = $tabState.currentTab;
  });

  setContext("tabs-state", tabState);
</script>

<slot />
