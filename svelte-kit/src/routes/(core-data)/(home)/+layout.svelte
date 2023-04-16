<script>
  import { SectionNav, SectionNavItem } from "$lib/components/section-nav";
</script>

<section>
  <div style="max-width: var(--content-max-width)">
    <div>
      <div>
        <SectionNav>
          <SectionNavItem href="/"><span><i class="far fa-chart-bar margin-right-sm" />Explore</span></SectionNavItem>
          <SectionNavItem href="/discover">Discover</SectionNavItem>
          <SectionNavItem href="/recent-scans">Recent Scans</SectionNavItem>
        </SectionNav>
        <slot />
      </div>
    </div>
  </div>
</section>
