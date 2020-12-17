<script lang="ts">
  import { getContext } from "svelte";
  import cn from "classnames";
  import localStorageManager from "util/localStorage";

  export let tabName = "";
  export let disabled = false;

  const tabsState: any = getContext("tabs-state");
  $: ({ currentTab, setTab, localStorageName } = $tabsState);

  const onClick = () => {
    if (!disabled) {
      if (localStorageName) {
        localStorageManager.set(localStorageName, tabName);
      }
      debugger;
      setTab(tabName);
    }
  };
</script>

<div on:click={onClick} class={cn('tab-header', { disabled, active: tabName == currentTab })}>
  <slot />
</div>
