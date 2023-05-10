<script lang="ts">
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import { SectionNavItem } from "$lib/components/section-nav";
</script>

<TabbedPage>
  <svelte:fragment slot="nav">
    <SectionNavItem href="/admin/similar-books">Similar Items</SectionNavItem>
    <SectionNavItem href="/admin/users">Users</SectionNavItem>
    <SectionNavItem href="/admin/design-system">Design system</SectionNavItem>
  </svelte:fragment>
  <slot />
</TabbedPage>
