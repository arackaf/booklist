<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "$lib/utils";

  import Button from "../ui/button/button.svelte";
  import Badge from "../ui/badge/badge.svelte";
  import type { NavigationItem } from "./types";

  let { href = "", disabled = false, badge, label = "", Icon, active = null }: NavigationItem = $props();

  let currentPathname = $derived(page.url.pathname);
  let hrefPathname = $derived(href ? href.replace(/\?.*/, "") : "");
  let isActive = $derived(active != null ? active : currentPathname === hrefPathname);
</script>

<Button
  size="default"
  variant={isActive ? "secondary" : "ghost"}
  {disabled}
  href={disabled ? null : href}
  class={cn(
    "flex items-center gap-2",
    disabled && "opacity-50 cursor-not-allowed",
    isActive && "font-medium",
    "[&_svg]:size-5",
    "[&_svg]:md:size-4",
    "relative"
  )}
>
  <Icon />
  <span class="md:block hidden">
    {label}
  </span>
  {#if badge}
    <Badge class="absolute -top-1 right-0 h-5 min-w-5 flex items-center justify-center rounded-full px-1 text-xs scale-[0.8]">
      {badge}
    </Badge>
  {/if}
</Button>
