<script>
  import { SectionNav, SectionNavItem } from "$lib/components/section-nav";
</script>

<section>
  <div style="margin-left: auto; margin-right: auto; max-width: var(--content-max-width)">
    <div>
      <div class="panel-body" style="position: relative">
        <SectionNav>
          <SectionNavItem href="/settings/theme">Theme</SectionNavItem>
          <SectionNavItem href="/settings/public-sharing">Public sharing</SectionNavItem>
          <SectionNavItem href="/settings/account-sync">Sync old login</SectionNavItem>
        </SectionNav>
        <slot />
      </div>
    </div>
  </div>
</section>
