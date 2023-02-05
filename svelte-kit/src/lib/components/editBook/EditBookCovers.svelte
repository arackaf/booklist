<script lang="ts">
  import type { Book } from "$data/types";
  import type { CoverUploadResults } from "$lambda/types";

  import ManageBookCover from "./ManageBookCover.svelte";
  import UploadResults from "./UploadResults.svelte";

  import CurrentCovers from "./CurrentCovers.svelte";

  export let book: Book;

  let uploadResults: CoverUploadResults | null = null;

  export const reset = () => {
    uploadResults = null;
  };

  const onCoverError = () => {
    uploadResults = { success: false, status: "error" };
  };

  const onCoverResults = (obj: CoverUploadResults) => {
    console.log("Cover results", obj);
    //uploadResults = obj;
  };

  $: mobileImage = uploadResults?.success ? uploadResults.mobile.image?.url : null;
  $: mobileImagePreview = uploadResults?.success ? uploadResults.mobile.image?.preview : null;

  $: smallImage = uploadResults?.success ? uploadResults.small.image?.url : null;
  $: smallImagePreview = uploadResults?.success ? uploadResults.small.image?.preview : null;

  $: mediumImage = uploadResults?.success ? uploadResults.medium.image?.url : null;
  $: mediumImagePreview = uploadResults?.success ? uploadResults.medium.image?.preview : null;
</script>

<div>
  <CurrentCovers {book} />
  <hr />

  <ManageBookCover onError={onCoverError} onResults={onCoverResults} />

  {#if uploadResults}
    <UploadResults {uploadResults} />
  {/if}

  {#if mobileImage}
    <input type="hidden" name="mobileImage" value={mobileImage} />
  {/if}
  {#if mobileImagePreview}
    <input type="hidden" name="mobileImagePreview" value={mobileImagePreview} />
  {/if}
  {#if smallImage}
    <input type="hidden" name="smallImage" value={smallImage} />
  {/if}
  {#if smallImagePreview}
    <input type="hidden" name="smallImagePreview" value={smallImagePreview} />
  {/if}
  {#if mediumImage}
    <input type="hidden" name="mediumImage" value={mediumImage} />
  {/if}
  {#if mediumImagePreview}
    <input type="hidden" name="mediumImagePreview" value={mediumImagePreview} />
  {/if}
</div>
