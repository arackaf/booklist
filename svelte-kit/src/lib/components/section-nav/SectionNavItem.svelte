<script lang="ts">
  import { page } from "$app/stores";

  export let href: string;

  $: active = href === $page.url.pathname;
</script>

<div class="section-nav-item" class:active>
  <svelte:element this={active ? "span" : "a"} href={active ? null : href}>
    <slot />
  </svelte:element>
</div>
