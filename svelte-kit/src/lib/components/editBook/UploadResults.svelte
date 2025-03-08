<script lang="ts">
  import { CircleAlertIcon, MessageCircleWarningIcon } from "lucide-svelte";

  import type { BookImages } from "$data/types";
  import * as Alert from "$lib/components/ui/alert";

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
    <Alert.Root>
      <MessageCircleWarningIcon class="size-4" />
      <Alert.Title>Invalid Image</Alert.Title>
      <Alert.Description>This image is too small to use</Alert.Description>
    </Alert.Root>
  {:else}
    <Alert.Root variant="destructive">
      <CircleAlertIcon class="size-4" />
      <Alert.Title>Error</Alert.Title>
      <Alert.Description>An error occured</Alert.Description>
    </Alert.Root>
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
