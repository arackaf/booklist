<script lang="ts">
  import Cover from "./Cover.svelte";
  import NoCoverMobile from "./NoCoverMobile.svelte";

  export let url = "";
  export let preview = "";
</script>

<Cover {url} {preview} NoCoverComponent={NoCoverMobile} />
