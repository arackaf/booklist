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

  $: currentModule = $page.route.id;
  $: isActive = (active != null && active) || (href && currentModule?.indexOf(href) !== -1);

  const spreadClassNames = (baseCssClasses = "", ...userClasses: string[]) => `${baseCssClasses} ${userClasses.join(" ")}`;
</script>

<li class={spreadClassNames(className || "", !!disabled ? "disabled" : "", isActive ? "active" : "")}>
  <ModuleLink {onClick} {style} {href} {label}>
    <slot />
  </ModuleLink>
</li>
