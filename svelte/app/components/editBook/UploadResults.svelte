<script lang="ts">
  import FlowItems from "../layout/FlowItems.svelte";
  import UploadResult from "./UploadResult.svelte";

  export let success: boolean;
  export let status: "success" | "invalid-size" | "error";
  export let mobile;
  export let small;
  export let medium;
  export let useNewMobile: boolean;
  export let setUseNewMobile: (val: boolean) => void;
  export let useNewSmall: boolean;
  export let setUseNewSmall: (val: boolean) => void;
  export let useNewMedium: boolean;
  export let setUseNewMedium: (val: boolean) => void;
</script>

{#if !success}
  {#if status === "invalid-size"}
    <div class="alert alert-warning margin-top">This image is too small to use</div>
  {:else}
    <div class="alert alert-danger margin-top">An error occured</div>
  {/if}
{:else}
  <FlowItems>
    <UploadResult {...mobile} useNewImage={useNewMobile} setUseNewImage={setUseNewMobile} size="mobile" />
    <UploadResult {...small} useNewImage={useNewSmall} setUseNewImage={setUseNewSmall} size="small" />
    <UploadResult {...medium} useNewImage={useNewMedium} setUseNewImage={setUseNewMedium} size="medium" />
  </FlowItems>
{/if}

<!-- // return (
// ); -->
