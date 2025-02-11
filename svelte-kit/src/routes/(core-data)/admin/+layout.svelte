<svelte:options runes={true} />

<script lang="ts">
  import PageWithNavigation from "$lib/components/navigation/PageWithNavigation.svelte";
  import type { NavigationItem } from "$lib/components/navigation/types";
  import { BookCopyIcon, UsersIcon } from "lucide-svelte";

  let { children } = $props();

  let navItems: NavigationItem[] = [
    {
      href: "/admin/similar-books",
      label: "Similar books",
      Icon: BookCopyIcon
    },
    {
      href: "/admin/users",
      label: "Users",
      Icon: UsersIcon
    }
  ];
</script>

<PageWithNavigation {navItems}>
  {@render children()}
</PageWithNavigation>
