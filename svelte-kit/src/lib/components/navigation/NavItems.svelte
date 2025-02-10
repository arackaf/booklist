<script lang="ts">
  import MainNavigationLink from "../navigation/MainNavigationLink.svelte";
  import type { NavigationItem } from "../navigation/types";

  type Props = {
    navItems: NavigationItem[];
  };

  let { navItems }: Props = $props();
</script>

<div class="flex gap-2">
  {#each navItems.filter(item => !item.hidden) as item}
    <MainNavigationLink Icon={item.Icon} active={item.active} disabled={item.disabled} href={item.href} label={item.label} badge={item.badge} />
  {/each}
</div>
