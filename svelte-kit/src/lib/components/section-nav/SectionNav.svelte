<script lang="ts">
  import NavItems from "../navigation/NavItems.svelte";
  import type { NavigationItem } from "../navigation/types";

  type Props = {
    navItems: NavigationItem[];
  };

  let { navItems }: Props = $props();
</script>

<header class="z-50 sticky-content w-full border-b bg-background pl-1">
  <nav class="container flex h-14 items-center">
    <NavItems {navItems} />
  </nav>
</header>
