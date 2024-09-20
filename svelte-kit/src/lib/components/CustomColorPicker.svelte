<script module>
  let uniqueIdCounter = 0;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import "./jscolor";

  type Props = {
    onColorChosen: (color: string) => void;
    currentColor: string | null;
    labelStyle: string;
  };

  let { onColorChosen, currentColor, labelStyle }: Props = $props();

  const uniqueId = `customColorPickerId${++uniqueIdCounter}`;
  let _colorChosen: any;

  let jscolorInstance: any;
  let rootElement: HTMLElement;
  const valueElementId = `${uniqueId}_value`;
  const styleElementId = `${uniqueId}_style`;

  $effect(() => {
    if (jscolorInstance && currentColor) {
      jscolorInstance.fromString(currentColor);
    }
  });

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
  <button id={uniqueId} bind:this={rootElement} class="raw-button" style="height: 20px; {labelStyle}"> Custom </button>
  <input style="display: none;" id={valueElementId} value={currentColor} />
  <input style="display: none" id={styleElementId} />
</div>
