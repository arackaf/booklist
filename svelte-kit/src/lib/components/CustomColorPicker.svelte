<script module>
  let uniqueIdCounter = 0;
</script>

<script lang="ts">
  import "./jscolor";
  import { onMount } from "svelte";

  export let onColorChosen: (color: string) => void;
  export let currentColor: string | null;
  export let labelStyle: string;

  let uniqueId = `customColorPickerId${++uniqueIdCounter}`;
  let _colorChosen: any;

  let jscolorInstance: any;
  let rootElement: HTMLElement;
  let valueElementId = `${uniqueId}_value`;
  let styleElementId = `${uniqueId}_style`;

  $: {
    if (jscolorInstance && currentColor) {
      jscolorInstance.fromString(currentColor);
    }
  }

  onMount(() => {
    _colorChosen = function (this: any) {
      let hexColor = this.rgb
        .map((n: any) => (~~n).toString(16))
        .map((n: any) => (n.length == 1 ? `0${n}` : n))
        .join("");
      onColorChosen("#" + hexColor);
    };

    jscolorInstance = new (window as any).jscolor(rootElement, {
      valueElement: valueElementId,
      styleElement: styleElementId,
      onFineChange: _colorChosen
    });
  });
</script>

<div>
  <a id={uniqueId} bind:this={rootElement} style="height: 20px; {labelStyle}" href="/" on:click={evt => evt.preventDefault()}> Custom </a>
  <input style="display: none;" id={valueElementId} value={currentColor} />
  <input style="display: none" id={styleElementId} />
</div>
