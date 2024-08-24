<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";

  type Props = {
    defaultTab: string;
    currentTab?: string;
  };

  const setTab = (tab: string) => tabState.update(state => ({ ...state, currentTab: tab }));

  let {
    defaultTab = "",
    // default state set in onMount
    currentTab: _currentTab = $bindable()
  }: Props = $props();

  const initialDefaultTab = defaultTab;

  onMount(() => {
    _currentTab = initialDefaultTab;
  });

  let tabState = writable({ currentTab: initialDefaultTab, setTab });

  $effect(() => {
    _currentTab = $tabState.currentTab;
  });

  setContext("tabs-state", tabState);
</script>

<slot />
