<svelte:options runes={true} />

<script>
  import SectionNav from "../section-nav/SectionNav.svelte";
</script>

<section>
  <div style="max-width: var(--content-max-width)">
    <div>
      <div>
        <SectionNav>
          <slot name="nav" />
        </SectionNav>
        <slot />
      </div>
    </div>
  </div>
</section>
