<script lang="ts">
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import type { NavigationItem } from "$lib/components/navigation/types.js";
  import { SectionNavItem } from "$lib/components/section-nav";
  import { ExternalLinkIcon, PaletteIcon } from "lucide-svelte";

  let { data, children } = $props();
  let { hasPublicId } = $derived(data);

  const navItems: NavigationItem[] = $derived([
    {
      href: "/settings/theme",
      label: "Theme",
      Icon: PaletteIcon
    },
    {
      href: "/settings/public-sharing",
      label: "Public sharing",
      Icon: ExternalLinkIcon,
      disabled: hasPublicId
    }
  ]);
</script>

<TabbedPage {navItems}>
  {@render children()}
</TabbedPage>
