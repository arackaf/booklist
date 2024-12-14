<svelte:options runes={true} />

<script lang="ts">
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import { SectionNavItem } from "$lib/components/section-nav";

  let { children } = $props();
</script>

<TabbedPage>
  {#snippet nav()}
    <SectionNavItem href="/admin/similar-books">Similar Items</SectionNavItem>
    <SectionNavItem href="/admin/users">Users</SectionNavItem>
  {/snippet}
  {@render children()}
</TabbedPage>
