<script lang="ts">
  import { page } from "$app/stores";
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import { SectionNavItem } from "$lib/components/section-nav";

  $: ({ isPublic } = $page.data);
</script>

<TabbedPage>
  <svelte:fragment slot="nav">
    <SectionNavItem href="/settings/theme">Theme</SectionNavItem>
    <SectionNavItem disabled={isPublic} href="/settings/public-sharing">Public sharing</SectionNavItem>
    <SectionNavItem disabled={isPublic} href="/settings/account-sync">Sync old login</SectionNavItem>
  </svelte:fragment>
  <slot />
</TabbedPage>
