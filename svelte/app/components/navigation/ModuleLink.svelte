<script lang="ts">
  import { browseTo } from "util/urlHelpers";
  import { appState } from "app/state/appState";

  export let href: string;
  export let style = "";
  export let disabled = false;
  export let onClick: (evt?: any) => void = null as any;

  function anchorClicked(evt) {
    evt.preventDefault();

    if (onClick) {
      onClick(evt);
    }

    if (!disabled && href && href != $appState.module) {
      browseTo(href);
    }
  }
</script>

<a {href} {style} on:click={anchorClicked}>
  <slot />
</a>
