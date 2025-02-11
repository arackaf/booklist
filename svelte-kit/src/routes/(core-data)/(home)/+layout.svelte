<script lang="ts">
  import PageWithNavigation from "$lib/components/navigation/PageWithNavigation.svelte";
  import type { NavigationItem } from "$lib/components/navigation/types.js";
  import { publicUserIdPersist } from "$lib/state/urlHelpers.svelte";
  import { BookDownIcon, ChartAreaIcon, TelescopeIcon } from "lucide-svelte";

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
      label: "Recent scans",
      Icon: BookDownIcon,
      disabled: hasPublicId
    }
  ]);
</script>

<PageWithNavigation {navItems}>
  {@render children()}
</PageWithNavigation>
