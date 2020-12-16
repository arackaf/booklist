<script context="module">
  let uniqueIdCounter = 0;
</script>

<script lang="ts">
  import "jscolor";
  import { onMount } from "svelte";

  export let onColorChosen: any = () => {};
  export let currentColor;
  export let labelStyle;

  let uniqueId = `customColorPickerId${++uniqueIdCounter}`;
  let _colorChosen: any;

  let jscolorInstance;
  let rootElement;
  let valueElement;
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
        .map(n => (~~n).toString(16))
        .map(n => (n.length == 1 ? `0${n}` : n))
        .join("");
      onColorChosen("#" + hexColor);
    };

    jscolorInstance = new jscolor(rootElement, {
      valueElement: valueElementId,
      styleElement: styleElementId,
      onFineChange: _colorChosen
    });
  });
</script>

<div>
  <a id={uniqueId} bind:this={rootElement} style="height: 20px; {labelStyle}"> Custom </a>
  <input style="display: none;" bind:this={valueElement} id={valueElementId} value={currentColor} />
  <input style="display: none" id={styleElementId} />
</div>
