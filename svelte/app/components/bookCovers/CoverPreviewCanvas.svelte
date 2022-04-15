<script lang="ts">
  import { decode } from "blurhash";

  export let preview: { blurhash: string; w: number; h: number };

  let canvasRef: HTMLCanvasElement = null;

  $: {
    if (canvasRef) {
      const pixels = decode(preview.blurhash, preview.w, preview.h);
      const ctx = canvasRef.getContext("2d");
      const imageData = ctx.createImageData(preview.w, preview.h);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    }
  }
</script>

<canvas bind:this={canvasRef} width={preview.w} height={preview.h} />
