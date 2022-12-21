<script lang="ts">
  import { page } from "$app/stores";

  export let href: string;

  $: active = new RegExp(`${href}\\b`).test($page.route.id!);
</script>

<div class="section-nav-item" class:active>
  <svelte:element this={active ? "span" : "a"} href={active ? null : href}>
    <slot />
  </svelte:element>
</div>
