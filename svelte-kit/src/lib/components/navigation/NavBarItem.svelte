<script lang="ts">
  import { page } from "$app/stores";
  import ModuleLink from "./ModuleLink.svelte";

  export let style = "";
  export let href = "";
  export let disabled = false;

  let className = "";
  export { className as class };

  export let onClick: (() => void) | null = null;
  export let label: string = "";
  export let active: boolean | null = null;

  $: currentPathname = $page.url.pathname;
  $: hrefPathname = href ? href.replace(/\?.*/, "") : "";
  $: isActive = active != null ? active : currentPathname === hrefPathname;
</script>

<li class={className || ""}>
  <ModuleLink active={isActive} {disabled} {onClick} {style} href={disabled ? "" : href} {label}>
    <slot />
  </ModuleLink>
</li>
