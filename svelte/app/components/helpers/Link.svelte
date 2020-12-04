<script lang="ts">
  import { getContext } from "svelte";
  import { appState } from "app/state/appState";
  import cn from "classnames";

  export let href: string;
  export let style = "";
  export let disabled = false;
  export let onClick: (evt?: any) => void = null as any;
  export let external = false;

  const history: any = getContext("booklist-history");

  function anchorClicked(evt) {
    if (external) {
      return;
    }

    evt.preventDefault();

    if (onClick) {
      onClick(evt);
    }

    if (!disabled && href && href != $appState.module) {
      history.push(`/${href}`);
    }
  }
</script>

<a {href} {style} on:click={anchorClicked}>
  <slot />
</a>
