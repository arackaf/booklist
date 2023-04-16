<script lang="ts">
  import { page } from "$app/stores";
  import { SectionNav, SectionNavItem } from "$lib/components/section-nav";

  $: ({ isPublic } = $page.data);
</script>

<section>
  <div style="max-width: var(--content-max-width)">
    <div>
      <div>
        <SectionNav>
          <SectionNavItem href="/settings/theme">Theme</SectionNavItem>
          <SectionNavItem disabled={isPublic} href="/settings/public-sharing">Public sharing</SectionNavItem>
          <SectionNavItem disabled={isPublic} href="/settings/account-sync">Sync old login</SectionNavItem>
        </SectionNav>
        <slot />
      </div>
    </div>
  </div>
</section>
