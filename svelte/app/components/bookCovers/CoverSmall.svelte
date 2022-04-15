<script lang="ts">
  import Cover from "./Cover.svelte";
  import NoCoverSmall from "./NoCoverSmall.svelte";

  export let url = "";
  export let preview = "";
</script>

<Cover {url} {preview} NoCoverComponent={NoCoverSmall} />
