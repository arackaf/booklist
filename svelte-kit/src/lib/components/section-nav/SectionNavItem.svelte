<script lang="ts">
  import { page } from "$app/stores";

  export let href: string;
  export let disabled: boolean = false;

  $: targetPathname = href.replace(/\?.*/, "");

  $: active = targetPathname === $page.url.pathname;

  $: addedClasses = active ? "bg-[var(--primary-10)]" : "";
</script>

<div class="section-nav-item flex p-0" class:active class:disabled class:cursor-default={active || disabled}>
  <svelte:element
    this={active || disabled ? "span" : "a"}
    class="p-4 {addedClasses}"
    class:text-neutral-500={disabled}
    class:font-bold={active}
    href={active || disabled ? null : href}
  >
    <slot />
  </svelte:element>
</div>
