<script lang="ts">
  import cn from "classnames";
  import { onMount } from "svelte";
  import { cssFromPreset } from "./buttonHelpers";

  let active = true;

  export let text = "";
  export let runningText: any = null;
  export let finishedText = "";

  export let style = "";
  export let preset = "";
  let className;
  export { className as class };
  export let disabled = false;

  export let icon: any = null;
  export let baseWidth: any = null;

  export let onClick: (...args) => any = null as any;

  let isRunning = false;
  let isFinished = false;

  onMount(() => () => (active = false));

  const buttonStyle = `min-width: ${baseWidth || text.length + 2 + "ch"} ${style}`;
  const iconStyles = `${text.length ? "margin-left: 3px" : ""}`;
  const finishedIconStyles = `${text.length ? "margin-left: 5px" : ""}`;

  const clickHandler = (...args) => {
    let result = onClick(...args);

    if (!result?.then) {
      return;
    }

    isRunning = true;
    Promise.resolve(result).then(() => {
      if (!active) {
        return;
      }
      if (finishedText) {
        isFinished = true;
        setTimeout(() => {
          if (active) {
            isFinished = false;
            isRunning = false;
          }
        }, 2000);
      } else {
        isRunning = false;
      }
    });
  };
</script>

<style>
  button {
    min-width: 5ch;
  }
</style>

<button
  on:click={clickHandler}
  style={buttonStyle}
  disabled={isRunning || isFinished || disabled || false}
  class={cn(cssFromPreset(preset, className), className, 'bl-action-button')}
  {...$$restProps}
>
  {#if isFinished}
    {finishedText}
  {:else if isRunning}
    {runningText || text}
  {:else if text}
    {text}
  {:else}
    <slot />
  {/if}

  {#if isFinished}
    <i style={finishedIconStyles} class="fal fa-check" />
  {:else if isRunning}<i style={iconStyles} class="fa fa-fw fa-spin fa-spinner" />{:else if icon}<i style={iconStyles} class={icon} />{/if}
</button>
