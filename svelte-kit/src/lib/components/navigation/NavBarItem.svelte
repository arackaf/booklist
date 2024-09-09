<script lang="ts">
  import { page } from "$app/stores";
  import ModuleLink from "./ModuleLink.svelte";

  type Props = {
    style?: string;
    href?: string;
    disabled?: boolean;
    class?: string;
    onClick?: (() => void) | null;
    label?: string;
    active?: boolean | null;
  };

  let {
    style = "",
    href = "",
    disabled = false,

    class: className = "",

    onClick = null,
    label = "",
    active = null
  }: Props = $props();

  let currentPathname = $derived($page.url.pathname);
  let hrefPathname = $derived(href ? href.replace(/\?.*/, "") : "");
  let isActive = $derived(active != null ? active : currentPathname === hrefPathname);
</script>

<li class="flex {className || ''}">
  <ModuleLink active={isActive} {disabled} {onClick} {style} href={disabled ? "" : href} {label}>
    <slot />
  </ModuleLink>
</li>
