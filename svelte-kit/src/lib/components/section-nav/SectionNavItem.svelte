<script lang="ts">
  import { page } from "$app/stores";
  import type { Snippet } from "svelte";

  type Props = {
    href: string;
    disabled?: boolean;
    children: Snippet;
  };

  let { href, disabled = false, children }: Props = $props();

  let targetPathname = $derived(href.replace(/\?.*/, ""));
  let active = $derived(targetPathname === $page.url.pathname);
  let addedClasses = $derived(active ? "bg-[var(--primary-10)]" : "");
</script>

<div class="section-nav-item flex p-0" class:active class:opacity-60={disabled} class:cursor-default={active || disabled}>
  <svelte:element
    this={active || disabled ? "span" : "a"}
    class="p-2 xs:p-3 sm:p-4 {addedClasses}"
    class:text-neutral-500={disabled}
    class:font-bold={active}
    href={active || disabled ? null : href}
  >
    {@render children()}
  </svelte:element>
</div>
