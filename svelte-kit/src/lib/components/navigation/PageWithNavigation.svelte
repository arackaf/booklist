<script lang="ts">
  import type { Snippet } from "svelte";

  import type { NavigationItem } from "./types";
  import NavItems from "./NavItems.svelte";

  type Props = {
    navItems: NavigationItem[];
    children: Snippet;
  };

  let { navItems, children }: Props = $props();
</script>

<section class="p-0">
  <div style="max-width: var(--content-max-width)">
    <header class="z-50 sticky-content w-full border-b bg-background pl-1">
      <div class="scroll-gradient"></div>
      <nav class="container flex h-14 items-center">
        <NavItems {navItems} />
      </nav>
    </header>
    <section class="p-(--main-spacing) pt-3">
      {@render children()}
    </section>
  </div>
</section>
