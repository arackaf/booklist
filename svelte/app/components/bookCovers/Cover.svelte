<script>
  import { onMount } from "svelte";

  import { getCrossOriginAttribute } from "util/corsHelpers";

  export let url = "";
  export let preview = "";
  export let NoCoverComponent;

  let loaded = false;
  let previewedImage = null;

  const onLoad = () => {
    loaded = true;
  };

  onMount(() => {
    if (previewedImage) {
      previewedImage.src = url;
    }
  });
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
    <img alt="Book cover preview" src={preview} style="display: {loaded ? 'none' : 'block'}" />
  {:else}
    <img on:load={onLoad} src={url} alt="Book cover" style="display: block" {...getCrossOriginAttribute(url)} />
  {/if}
{:else}
  <svelte:component this={NoCoverComponent} />
{/if}
