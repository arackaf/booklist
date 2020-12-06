<script lang="ts">
  import cn from "classnames";

  import { appState } from "app/state/appState";
  import ModuleLink from "./ModuleLink.svelte";

  export let style = "";
  export let href = "";
  export let disabled = false;
  export let className = "";
  export let onClick: (evt?: any) => void = null as any;
  export let external = false;

  $: currentModule = $appState.module;
  $: active = currentModule == href;

  const spreadClassNames = (baseCssClasses = "", ...userClasses) => `${baseCssClasses} ${userClasses.join(" ")}`;

  function liClicked() {
    onClick && onClick();
  }
</script>

<li on:click={liClicked} className={spreadClassNames(className, !!disabled ? 'disabled' : '', active ? 'active' : '')}>
  <ModuleLink {external} {disabled} {style} {href}>
    <slot />
  </ModuleLink>
</li>
