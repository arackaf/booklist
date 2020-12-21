<script lang="ts">
  import { history } from "util/urlHelpers";
  import { appState } from "app/state/appState";

  export let href: string;
  export let style = "";
  export let disabled = false;
  export let onClick: (evt?: any) => void = null as any;
  export let external = false;

  function anchorClicked(evt) {
    if (external) {
      return;
    }

    evt.preventDefault();

    if (onClick) {
      onClick(evt);
    }

    if (!disabled && href && href != $appState.module) {
      history.push({ pathname: `/${href}`, search: "" });
    }
  }
</script>

<a {href} {style} on:click={anchorClicked}>
  <slot />
</a>
