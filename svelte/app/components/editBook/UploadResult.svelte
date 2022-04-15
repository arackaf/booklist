<script lang="ts">
  import Toggle from "svelte-toggle";

  import CoverMobile from "../bookCovers/CoverMobile.svelte";
  import CoverSmall from "../bookCovers/CoverSmall.svelte";
  import CoverMedium from "../bookCovers/CoverMedium.svelte";
  import Stack from "../layout/Stack.svelte";

  export let STATUS: "success" | "invalid-size" | "error";
  export let image: { url: string; preview: string } = null;
  export let size: "mobile" | "small" | "medium";
  export let useNewImage: boolean;
  export let setUseNewImage: (val: boolean) => void;

  $: success = STATUS === "success";
  $: ImgComponent = size === "mobile" ? CoverMobile : size === "small" ? CoverSmall : CoverMedium;
</script>

<div style="flex: 1">
  {#if success}
    <Stack inline={true} style="align-items: center; height: 100%">
      <div class="margin-bottom" style="opacity: {useNewImage ? 1 : 0.5}">
        <svelte:component this={ImgComponent} url={image.url} preview={image.preview} />
      </div>
      <div style="margin-top: auto;">
        <Toggle
          toggledColor="var(--success-5)"
          untoggledColor="var(--neutral-5)"
          toggled={!!useNewImage}
          on:toggle={e => setUseNewImage(!useNewImage)}
          hideLabel
        />
      </div>
    </Stack>
  {/if}
</div>
