<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { get, writable } from "svelte/store";

  import localStorageManager from "$lib/util/localStorage";

  type Props = {
    defaultTab: string;
    localStorageName?: string;
    currentTab: string;
    setTab?: (tab: string) => void;
  };

  const doSetTab = (tab: string) => tabState.update(state => ({ ...state, currentTab: tab }));

  let {
    defaultTab = "",
    localStorageName = "",
    // default state set in onMount
    currentTab: _currentTab = $bindable(),
    setTab: _setTab = $bindable()
  }: Props = $props();

  const initialDefaultTab = localStorageManager.get(localStorageName) || defaultTab;

  onMount(() => {
    _currentTab = initialDefaultTab;
    _setTab = doSetTab;
  });

  let tabState = writable({ localStorageName, currentTab: initialDefaultTab, setTab: doSetTab });

  $effect(() => {
    _currentTab = $tabState.currentTab;
  });

  setContext("tabs-state", tabState);
</script>

<slot />
