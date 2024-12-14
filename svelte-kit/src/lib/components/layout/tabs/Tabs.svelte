<script lang="ts">
  import { setContext, type Snippet } from "svelte";
  import { writable } from "svelte/store";

  type Props = {
    currentTab?: string;
    children: Snippet;
  };

  const setTab = (tab: string) => tabState.update(state => ({ ...state, currentTab: tab }));

  let { currentTab = $bindable(), children }: Props = $props();

  let tabState = writable({ currentTab, setTab });

  $effect(() => {
    currentTab = $tabState.currentTab;
  });

  setContext("tabs-state", tabState);
</script>

{@render children()}
