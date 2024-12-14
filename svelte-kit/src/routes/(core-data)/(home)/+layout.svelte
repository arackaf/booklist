<script lang="ts">
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import { SectionNavItem } from "$lib/components/section-nav";
  import { publicUserIdPersist } from "$lib/state/urlHelpers";

  let { data, children } = $props();
  let { hasPublicId } = $derived(data);
</script>

<TabbedPage>
  {#snippet nav()}
    <SectionNavItem href={$publicUserIdPersist.urlTo("/")}>
      <span>Explore</span>
    </SectionNavItem>
    <SectionNavItem href={$publicUserIdPersist.urlTo("/discover")}>Discover</SectionNavItem>
    <SectionNavItem disabled={hasPublicId} href="/recent-scans">Recent Scans</SectionNavItem>
  {/snippet}

  {@render children()}
</TabbedPage>
