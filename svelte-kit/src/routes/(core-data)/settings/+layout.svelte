<script lang="ts">
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import { SectionNavItem } from "$lib/components/section-nav";

  let { data, children } = $props();
  let { hasPublicId } = $derived(data);
</script>

<TabbedPage>
  {#snippet nav()}
    <SectionNavItem href="/settings/theme">Theme</SectionNavItem>
    <SectionNavItem disabled={hasPublicId} href="/settings/public-sharing">Public sharing</SectionNavItem>
  {/snippet}
  {@render children()}
</TabbedPage>
