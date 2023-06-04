<script lang="ts">
  import { page } from "$app/stores";

  export let href: string;
  export let disabled: boolean = false;

  $: targetPathname = href.replace(/\?.*/, "");

  $: active = targetPathname === $page.url.pathname;
</script>

<div class="section-nav-item flex p-0" class:active class:disabled>
  <svelte:element this={active || disabled ? "span" : "a"} href={active || disabled ? null : href}>
    <slot />
  </svelte:element>
</div>

<style>
  .disabled {
    cursor: not-allowed;
  }
</style>
