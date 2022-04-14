<script lang="ts">
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

  const toggleUse = (e: any) => {
    setUseNewImage(e.target.checked);
  };
</script>

<div style="flex: 1">
  {#if success}
    <Stack inline={true} style="alignItems: center; height: 100%">
      <div class="margin-bottom">
        <svelte:component this={ImgComponent} url={image.url} preview={image.preview} />
      </div>
      <div style="marginTop: auto;">
        <!-- <Toggle checked={useNewImage} onChange={e => setUseNewImage(e.target.checked)} icons={{ unchecked: null }} /> -->
        <input type="checkbox" checked={useNewImage} on:change={toggleUse} />
      </div>
    </Stack>
  {/if}
</div>
