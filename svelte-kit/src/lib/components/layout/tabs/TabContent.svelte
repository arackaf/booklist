<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = {
    tabName: string;
    children: Snippet;
  } & HTMLAttributes<HTMLDivElement>;
  let { tabName, class: className, children, ...rest }: Props = $props();

  const tabsState: any = getContext("tabs-state");
  let currentTab = $derived($tabsState.currentTab);
  let isActive = $derived(currentTab === tabName);
</script>

<div {...rest} class="mt-2 ml-0 md:ml-1 {className}" class:hidden={!isActive}>
  {@render children()}
</div>
