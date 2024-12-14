<script lang="ts">
  import type { Snippet } from "svelte";
  import SectionNav from "../section-nav/SectionNav.svelte";

  type Props = {
    nav: Snippet;
    children: Snippet;
  };

  let { nav, children }: Props = $props();
</script>

<section>
  <div style="max-width: var(--content-max-width)">
    <div>
      <div>
        <SectionNav>
          {@render nav()}
        </SectionNav>
        {@render children()}
      </div>
    </div>
  </div>
</section>
