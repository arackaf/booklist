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
</script>

{#if !success}
  {#if status === "invalid-size"}
    <div class="alert alert-warning margin-top">This image is too small to use</div>
  {:else}
    <div class="alert alert-danger margin-top">An error occured</div>
  {/if}
{:else}
  <FlowItems>
    <UploadResult packet={mobile} size="mobile" />
    <UploadResult packet={small} size="small" />
    <UploadResult packet={medium} size="medium" />
  </FlowItems>
{/if}
