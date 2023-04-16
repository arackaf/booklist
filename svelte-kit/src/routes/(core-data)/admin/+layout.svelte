<script lang="ts">
  import { page } from "$app/stores";
  import { SectionNav, SectionNavItem } from "$lib/components/section-nav";
</script>

<section>
  <div style="max-width: var(--content-max-width)">
    <div>
      <div>
        <SectionNav>
          <SectionNavItem href="/admin/similar-items">Similar Items</SectionNavItem>
          <SectionNavItem href="/admin/users">Users</SectionNavItem>
        </SectionNav>
        <slot />
      </div>
    </div>
  </div>
</section>
