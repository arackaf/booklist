<script lang="ts">
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import type { NavigationItem } from "$lib/components/navigation/types.js";
  import { SectionNavItem } from "$lib/components/section-nav";
  import { publicUserIdPersist } from "$lib/state/urlHelpers.svelte";
  import { BookDownIcon, BookHeartIcon, ChartAreaIcon, TelescopeIcon } from "lucide-svelte";

  let { data, children } = $props();
  let { hasPublicId } = $derived(data);

  let navItems: NavigationItem[] = $derived([
    {
      href: publicUserIdPersist.urlTo("/"),
      label: "Explore",
      Icon: ChartAreaIcon
    },
    {
      href: publicUserIdPersist.urlTo("/discover"),
      label: "Find new books",
      Icon: TelescopeIcon
    },
    {
      href: publicUserIdPersist.urlTo("/recent-scans"),
      label: "Recent Scans",
      Icon: BookDownIcon
    }
  ]);
</script>

<TabbedPage {navItems}>
  {@render children()}
</TabbedPage>
