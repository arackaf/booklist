<svelte:options runes={true} />

<script lang="ts">
  import TabbedPage from "$lib/components/layout/TabbedPage.svelte";
  import type { NavigationItem } from "$lib/components/navigation/types";
  import { SectionNavItem } from "$lib/components/section-nav";
  import { BookCopyIcon, UsersIcon } from "lucide-svelte";

  let { children } = $props();

  let navItems: NavigationItem[] = [
    {
      href: "/admin/similar-books",
      label: "Similar Books",
      Icon: BookCopyIcon
    },
    {
      href: "/admin/users",
      label: "Users",
      Icon: UsersIcon
    }
  ];
</script>

<TabbedPage {navItems}>
  {@render children()}
</TabbedPage>
