<script lang="ts">
  import type { Snippet, Component, ComponentInternals } from "svelte";
  import { page } from "$app/state";
  import ModuleLink from "./ModuleLink.svelte";
  import Button from "../ui/button/button.svelte";
  import { cn } from "$lib/utils";
  import Badge from "../ui/badge/badge.svelte";

  type Props = {
    href?: string;
    disabled?: boolean;
    label?: string;
    Icon: any;
    active?: boolean | null;
    badge?: string | number;
  };

  let { href = "", disabled = false, badge, label = "", Icon, active = null }: Props = $props();

  let currentPathname = $derived(page.url.pathname);
  let hrefPathname = $derived(href ? href.replace(/\?.*/, "") : "");
  let isActive = $derived(active != null ? active : currentPathname === hrefPathname);

  $effect(() => console.log("badge", badge));
</script>

<Button
  size="default"
  variant={isActive ? "secondary" : "ghost"}
  {disabled}
  {href}
  class={cn(
    "flex items-center gap-2",
    disabled && "opacity-50 cursor-not-allowed",
    isActive && "font-medium",
    "[&_svg]:size-4",
    "[&_svg]:md:size-4",
    "[&_svg]:xs:size-5",
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
