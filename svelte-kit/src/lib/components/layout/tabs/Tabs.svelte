<script lang="ts">
  import { setContext, type Snippet } from "svelte";
  import { createTabState } from "./tabState.svelte";

  type Props = {
    currentTab: string;
    children: Snippet;
  };

  let { currentTab = $bindable(), children }: Props = $props();

  let tabState = createTabState(currentTab);

  $effect(() => {
    currentTab = tabState.currentTab;
  });

  setContext("tabs-state", tabState);
</script>

{@render children()}
