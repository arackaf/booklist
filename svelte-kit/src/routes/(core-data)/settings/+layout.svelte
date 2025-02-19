<script lang="ts">
  import PageWithNavigation from "$lib/components/navigation/PageWithNavigation.svelte";
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

<PageWithNavigation {navItems}>
  <div class="pt-2">
    {@render children()}
  </div>
</PageWithNavigation>
