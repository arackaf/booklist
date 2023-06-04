<script lang="ts">
  import type { BookImages } from "$data/types";

  import UploadResult from "./UploadResult.svelte";

  export let error: boolean;
  export let uploadResults: BookImages | null;

  export let status: "error" | "invalid-size" | "";
</script>

{#if error}
  {#if status === "invalid-size"}
    <div class="alert alert-warning mt-3">This image is too small to use</div>
  {:else}
    <div class="alert alert-danger mt-3">An error occured</div>
  {/if}
{:else}
  <div class="flex flex-row mt-3">
    <div class="flex-1">
      <UploadResult packet={uploadResults} size="mobile" {error} />
    </div>
    <div class="flex-1">
      <UploadResult packet={uploadResults} size="small" {error} />
    </div>
    <div class="flex-1">
      <UploadResult packet={uploadResults} size="medium" {error} />
    </div>
  </div>
{/if}
