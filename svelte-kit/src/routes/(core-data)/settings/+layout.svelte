<script lang="ts">
  import TabbedPage from "$lib/components/navigation/TabbedPage.svelte";
  import type { NavigationItem } from "$lib/components/navigation/types.js";
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
