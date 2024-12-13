<script lang="ts">
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import { SectionNavItem } from "$lib/components/section-nav";

  let { data } = $props();
  let { hasPublicId } = $derived(data);
</script>

<TabbedPage>
  <svelte:fragment slot="nav">
    <SectionNavItem href="/settings/theme">Theme</SectionNavItem>
    <SectionNavItem disabled={hasPublicId} href="/settings/public-sharing">Public sharing</SectionNavItem>
  </svelte:fragment>
  <slot />
</TabbedPage>
