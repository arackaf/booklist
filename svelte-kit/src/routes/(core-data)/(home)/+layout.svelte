<script lang="ts">
  import { page } from "$app/stores";
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import { SectionNavItem } from "$lib/components/section-nav";
  import { publicUserIdPersist } from "$lib/state/urlHelpers";

  $: ({ hasPublicId } = $page.data);
</script>

<TabbedPage>
  <svelte:fragment slot="nav">
    <SectionNavItem href={$publicUserIdPersist.urlTo("/")}><span>Explore</span></SectionNavItem>
    <SectionNavItem href={$publicUserIdPersist.urlTo("/discover")}>Discover</SectionNavItem>
    <SectionNavItem disabled={hasPublicId} href="/recent-scans">Recent Scans</SectionNavItem>
  </svelte:fragment>
  <slot />
</TabbedPage>
