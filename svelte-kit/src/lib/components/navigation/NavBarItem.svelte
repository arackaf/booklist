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

  $: currentModule = $page.route.id;
  $: active = href && currentModule?.indexOf(href) !== -1;

  const spreadClassNames = (baseCssClasses = "", ...userClasses: string[]) => `${baseCssClasses} ${userClasses.join(" ")}`;
</script>

<li class={spreadClassNames(className || "", !!disabled ? "disabled" : "", active ? "active" : "")}>
  <ModuleLink {onClick} {style} {href} {label}>
    <slot />
  </ModuleLink>
</li>
