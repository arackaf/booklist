<script>
  import { onMount } from "svelte";

  import { getCrossOriginAttribute } from "util/corsHelpers";
  import CoverPreview from "./CoverPreview.svelte";

  export let url = "";
  export let preview = "";
  export let NoCoverComponent;

  let loaded = false;
  let previewedImage = null;

  const onLoad = () => {
    setTimeout(() => {
      loaded = true;
    }, 3000);
  };

  $: {
    if (previewedImage) {
      previewedImage.src = url;
    }
  }
</script>

{#if url}
  {#if preview}
    <img
      bind:this={previewedImage}
      on:load={onLoad}
      alt="Book cover"
      style="display: {loaded ? 'block' : 'none'}"
      {...getCrossOriginAttribute(url)}
    />
    <CoverPreview {loaded} {preview} />
  {:else}
    <img on:load={onLoad} src={url} alt="Book cover" style="display: block" {...getCrossOriginAttribute(url)} />
  {/if}
{:else}
  <svelte:component this={NoCoverComponent} />
{/if}
