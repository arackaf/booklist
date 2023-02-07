<script lang="ts">
  import type { BookImages } from "$data/types";
  import FlowItems from "../layout/FlowItems.svelte";
  import UploadResult from "./UploadResult.svelte";

  export let error: boolean;
  export let uploadResults: BookImages | null;

  export let status: "error" | "invalid-size" | "";
</script>

{#if error}
  {#if status === "invalid-size"}
    <div class="alert alert-warning margin-top">This image is too small to use</div>
  {:else}
    <div class="alert alert-danger margin-top">An error occured</div>
  {/if}
{:else}
  <FlowItems>
    <UploadResult packet={uploadResults} size="mobile" {error} />
    <UploadResult packet={uploadResults} size="small" {error} />
    <UploadResult packet={uploadResults} size="medium" {error} />
  </FlowItems>
{/if}
