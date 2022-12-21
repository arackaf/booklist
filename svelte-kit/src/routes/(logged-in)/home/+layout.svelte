<script>
  import { SectionNav, SectionNavItem } from "$lib/components/section-nav";
</script>

<section>
  <div style="margin-left: auto; margin-right: auto; max-width: var(--content-max-width)">
    <div>
      <div class="panel-body" style="position: relative">
        <SectionNav>
          <SectionNavItem href="/home/view">View</SectionNavItem>
          <SectionNavItem href="/home/discover">Discover</SectionNavItem>
          <SectionNavItem href="/home/recent-scans">Recent Scans</SectionNavItem>
        </SectionNav>
        <slot />
      </div>
    </div>
  </div>
</section>
