<script lang="ts">
  import { getContext } from "svelte";
  import cn from "classnames";

  export let tabName = "";
  let className = "";
  export { className as class };

  const tabsState: any = getContext("tabs-state");
  $: ({ currentTab, setTab, localStorageName } = $tabsState);
  $: isActive = currentTab === tabName;
</script>

<div {...$$restProps} class={cn('tab-pane', className, { active: isActive })}>
  <slot {isActive} />
</div>
