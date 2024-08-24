<script lang="ts">
  import { getContext } from "svelte";
  import localStorageManager from "$lib/util/localStorage";

  type Props = {
    tabName: string;
    class: string;
  };

  let { tabName, class: className }: Props = $props();

  const tabsState: any = getContext("tabs-state");

  let { currentTab, setTab, localStorageName } = $derived($tabsState);

  let active = $derived(tabName === currentTab);

  const onClick = () => {
    if (localStorageName) {
      localStorageManager.set(localStorageName, tabName);
    }
    setTab(tabName);
  };
</script>

<div class="border-primary-9" class:bg-primary-10={active} class:border-b={active}>
  <button onclick={onClick} type="button" class="raw-button overlay-holder {className}" style="padding: 4px 8px" class:cursor-default={active}>
    <span class:font-bold={active}><slot /></span>
    <span class="invisible font-bold"><slot /></span>
  </button>
</div>
