<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  type Props = {
    currentTab?: string;
  };

  const setTab = (tab: string) => tabState.update(state => ({ ...state, currentTab: tab }));

  let { currentTab = $bindable() }: Props = $props();

  let tabState = writable({ currentTab, setTab });

  $effect(() => {
    currentTab = $tabState.currentTab;
  });

  setContext("tabs-state", tabState);
</script>

<slot />
