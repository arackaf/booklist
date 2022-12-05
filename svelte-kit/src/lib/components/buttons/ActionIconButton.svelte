<script lang="ts">
  import { onMount } from "svelte";
  import cn from "classnames";
  import { cssFromPreset } from "./buttonHelpers";

  let active = true;
  onMount(() => {
    return () => (active = false);
  });

  export let style = "";
  let className = "";
  export { className as class };

  export let onClick: any;
  export let preset = "";
  export let disabled = false;

  let isRunning = false;
  let isFinished = false;

  const styleToUse = `minWidth: 5ch; ${style}`;

  const onClickFn = (...args: any[]) => {
    let result = onClick(...args);

    if (!result?.then) {
      return;
    }

    isRunning = true;
    Promise.resolve(result).then(() => {
      if (!active) {
        return;
      }

      isFinished = true;
      setTimeout(() => {
        if (active) {
          isFinished = false;
          isRunning = false;
        }
      }, 2000);
    });
  };
</script>

<button
  on:click={onClick}
  style={styleToUse}
  disabled={isRunning || isFinished || disabled || false}
  class={cn(cssFromPreset(preset, className), className, "bl-action-button")}
  {...$$restProps}
>
  {#if isFinished}
    <i class="fal fa-check" />
  {:else if isRunning}
    <i class="far fa-fw fa-spin fa-spinner" />
  {:else}
    <slot />
  {/if}
</button>
