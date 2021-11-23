<script lang="ts">
  import { appState } from "app/state/appState";
  import ModuleLink from "./ModuleLink.svelte";

  export let style = "";
  export let href = "";
  export let disabled = false;
  let className = "";
  export { className as class };
  export let onClick: (evt?: any) => void = null as any;

  $: currentModule = $appState.module;
  $: active = currentModule == href;

  const spreadClassNames = (baseCssClasses = "", ...userClasses) => `${baseCssClasses} ${userClasses.join(" ")}`;

  function liClicked() {
    onClick && onClick();
  }
</script>

<li on:click={liClicked} class={spreadClassNames(className || "", !!disabled ? "disabled" : "", active ? "active" : "")}>
  <ModuleLink {disabled} {style} {href}>
    <slot />
  </ModuleLink>
</li>
