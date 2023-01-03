<script lang="ts">
  import { getContext } from "svelte";
  import cn from "classnames";
  import localStorageManager from "$lib/util/localStorage";

  export let text = "";
  export let tabName = "";
  export let spaceWith = "";
  export let disabled = false;

  const tabsState: any = getContext("tabs-state");
  $: ({ currentTab, setTab, localStorageName } = $tabsState);

  const onClick = () => {
    if (!disabled) {
      if (localStorageName) {
        localStorageManager.set(localStorageName, tabName);
      }
      setTab(tabName);
    }
  };
</script>

<div on:click={onClick} on:keypress={() => {}} data-title={text || spaceWith} class={cn("tab-header", { disabled, active: tabName == currentTab })}>
  {#if text}
    <button class="raw-button">{text}</button>
  {:else}
    <slot />
  {/if}
</div>
