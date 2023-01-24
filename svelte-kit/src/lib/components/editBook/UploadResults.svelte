<script lang="ts">
  import type { CoverUploadResults, IndividualCoverResult } from "$lambda/types";
  import FlowItems from "../layout/FlowItems.svelte";
  import UploadResult from "./UploadResult.svelte";

  export let uploadResults: CoverUploadResults;

  let status: "error" | "invalid-size";
  let mobile: IndividualCoverResult | null;
  let small: IndividualCoverResult | null;
  let medium: IndividualCoverResult | null;

  $: ({ success } = uploadResults);
  $: {
    if (uploadResults.success) {
      mobile = uploadResults.mobile;
      small = uploadResults.small;
      medium = uploadResults.medium;
    } else {
      status = uploadResults.status;
      mobile = small = medium = null;
    }
  }

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
    <UploadResult packet={mobile} useNewImage={useNewMobile} setUseNewImage={setUseNewMobile} size="mobile" />
    <UploadResult packet={small} useNewImage={useNewSmall} setUseNewImage={setUseNewSmall} size="small" />
    <UploadResult packet={medium} useNewImage={useNewMedium} setUseNewImage={setUseNewMedium} size="medium" />
  </FlowItems>
{/if}
