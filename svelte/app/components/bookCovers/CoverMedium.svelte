<script lang="ts">
  import Cover from "./Cover.svelte";
  import NoCoverMedium from "./NoCoverMedium.svelte";

  export let url = "";
  export let preview = "";
</script>

<Cover {url} {preview} NoCoverComponent={NoCoverMedium} />
