<script lang="ts">
  import Cover from "./Cover.svelte";

  export let url = "";
  export let preview = "";
</script>

<Cover {url} {preview} noCoverElementName="uikit-no-cover-mobile" />
