<script lang="ts">
  import { getContext } from "svelte";

  export let tabName = "";
  let className = "";
  export { className as class };

  const tabsState: any = getContext("tabs-state");
  $: ({ currentTab } = $tabsState);
  $: isActive = currentTab === tabName;
</script>

<div {...$$restProps} class="mt-2 ml-0 md:ml-1 {className}" class:hidden={!isActive}>
  <slot {isActive} />
</div>
