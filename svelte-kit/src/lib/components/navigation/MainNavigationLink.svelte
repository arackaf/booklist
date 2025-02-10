<script lang="ts">
  import type { Snippet, Component, ComponentInternals } from "svelte";
  import { page } from "$app/state";
  import ModuleLink from "./ModuleLink.svelte";
  import Button from "../ui/button/button.svelte";
  import { cn } from "$lib/utils";

  type Props = {
    href?: string;
    disabled?: boolean;
    label?: string;
    Icon: any;
    active?: boolean | null;
  };

  let {
    href = "",
    disabled = false,

    label = "",
    Icon,
    active = null
  }: Props = $props();

  let currentPathname = $derived(page.url.pathname);
  let hrefPathname = $derived(href ? href.replace(/\?.*/, "") : "");
  let isActive = $derived(active != null ? active : currentPathname === hrefPathname);
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
    "[&_svg]:xs:size-5"
  )}
>
  <Icon />
  <span class="md:block hidden">
    {label}
  </span>
</Button>
