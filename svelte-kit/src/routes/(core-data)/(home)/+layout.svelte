<script lang="ts">
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import { SectionNavItem } from "$lib/components/section-nav";
</script>

<TabbedPage>
  <svelte:fragment slot="nav">
    <SectionNavItem href="/"><span><i class="far fa-chart-bar margin-right-sm" />Explore</span></SectionNavItem>
    <SectionNavItem href="/discover">Discover</SectionNavItem>
    <SectionNavItem href="/recent-scans">Recent Scans</SectionNavItem>
  </svelte:fragment>
  <slot />
</TabbedPage>
