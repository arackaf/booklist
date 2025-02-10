<script lang="ts">
  import type { Snippet } from "svelte";
  import MainNavigationLink from "../navigation/MainNavigationLink.svelte";
  import { BookCopyIcon, HomeIcon } from "lucide-svelte";

  type Props = {
    children: Snippet;
  };

  const navItems = $derived([
    { label: "Home", Icon: HomeIcon, active: true, href: "/foo", hidden: false, disabled: false },
    { label: "Books", Icon: BookCopyIcon, href: "/books" }
  ]);
</script>

<header class="z-50 sticky-content w-full border-b bg-background">
  <nav class="container flex h-14 items-center">
    <div class="flex gap-2">
      {#each navItems.filter(item => !item.hidden) as item}
        <MainNavigationLink Icon={item.Icon} active={item.active} disabled={item.disabled} href={item.href} label={item.label} badge={item.badge} />
      {/each}
    </div>
  </nav>
</header>
