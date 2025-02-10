<script lang="ts">
  import type { Snippet } from "svelte";
  import SectionNav from "../section-nav/SectionNav.svelte";
  import type { NavigationItem } from "./types";

  type Props = {
    navItems: NavigationItem[];
    children: Snippet;
  };

  let { navItems, children }: Props = $props();
</script>

<section class="p-0">
  <div style="max-width: var(--content-max-width)">
    <SectionNav {navItems}></SectionNav>
    <section class="p-[var(--main-spacing)]">
      {@render children()}
    </section>
  </div>
</section>
