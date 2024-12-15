<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import type { TabState } from "./tabState.svelte";

  type Props = {
    tabName: string;
    class?: string;
    children: Snippet;
  };

  let { tabName, class: className = "", children }: Props = $props();

  const tabsState: TabState = getContext("tabs-state");

  let { currentTab, setTab } = $derived(tabsState);

  let active = $derived(tabName === currentTab);

  const onClick = () => {
    setTab(tabName);
  };
</script>

<div class="border-primary-9" class:bg-primary-10={active} class:border-b={active}>
  <button onclick={onClick} type="button" class="raw-button overlay-holder {className}" style="padding: 4px 8px" class:cursor-default={active}>
    <span class:font-bold={active}>
      {@render children()}
    </span>
    <span class="invisible font-bold">
      {@render children()}
    </span>
  </button>
</div>
