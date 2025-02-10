<script lang="ts">
  import type { Snippet } from "svelte";
  import SectionNav from "../section-nav/SectionNav.svelte";

  type Props = {
    nav: Snippet;
    children: Snippet;
  };

  let { nav, children }: Props = $props();
</script>

<section class="p-0">
  <div style="max-width: var(--content-max-width)">
    <SectionNav>
      {@render nav()}
    </SectionNav>
    <section class="p-[var(--main-spacing)]">
      {@render children()}
    </section>
  </div>
</section>
