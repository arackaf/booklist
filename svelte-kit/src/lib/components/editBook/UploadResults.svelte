<script lang="ts">
  import type { BookImages } from "$data/types";
  import Alert from "$lib/components/Alert.svelte";

  import UploadResult from "./UploadResult.svelte";

  type Props = {
    error: boolean;
    uploadResults: BookImages | null;

    status: "error" | "invalid-size" | "";
  };
  let { error, uploadResults, status }: Props = $props();
</script>

{#if error}
  {#if status === "invalid-size"}
    <Alert type="warning" class="mt-3">This image is too small to use</Alert>
  {:else}
    <Alert type="error" class="mt-3">An error occured</Alert>
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
