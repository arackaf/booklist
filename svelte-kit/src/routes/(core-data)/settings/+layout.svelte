<script lang="ts">
  import { page } from "$app/stores";
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import { SectionNavItem } from "$lib/components/section-nav";

  $: ({ hasPublicId } = $page.data);
</script>

<TabbedPage>
  <svelte:fragment slot="nav">
    <SectionNavItem href="/settings/theme">Theme</SectionNavItem>
    <SectionNavItem disabled={hasPublicId} href="/settings/public-sharing">Public sharing</SectionNavItem>
  </svelte:fragment>
  <slot />
</TabbedPage>
