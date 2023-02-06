<script lang="ts">
  import type { Book, BookImages } from "$data/types";

  import ManageBookCover from "./ManageBookCover.svelte";
  import UploadResults from "./UploadResults.svelte";

  import CurrentCovers from "./CurrentCovers.svelte";

  export let book: Book;
  let status: "error" | "invalid-size" | "" = "";

  let error = false;
  let uploadResults: BookImages | null = null;

  export const reset = () => {
    uploadResults = null;
  };

  const onCoverError = () => {
    error = true;
    status = "error";
    uploadResults = {} as BookImages;
  };

  const onCoverResults = (obj: BookImages) => {
    uploadResults = obj;
    if (!uploadResults.mediumImage && !uploadResults.smallImage && !uploadResults.mobileImage) {
      error = true;
      status = "invalid-size";
    } else {
      error = false;
      status = "";
    }
  };

  $: mobileImage = uploadResults?.mobileImage;
  $: mobileImagePreview = uploadResults?.mobileImagePreview;

  $: smallImage = uploadResults?.smallImage;
  $: smallImagePreview = uploadResults?.smallImagePreview;

  $: mediumImage = uploadResults?.mediumImage;
  $: mediumImagePreview = uploadResults?.mediumImagePreview;
</script>

<div>
  <CurrentCovers {book} />
  <hr />

  <ManageBookCover onError={onCoverError} onResults={onCoverResults} />

  {#if uploadResults}
    <UploadResults {error} {status} {uploadResults} />
  {/if}

  {#if mobileImage}
    <input type="hidden" name="mobileImage" value={mobileImage} />
  {/if}
  {#if mobileImagePreview}
    <input type="hidden" name="mobileImagePreview" value={JSON.stringify(mobileImagePreview)} />
  {/if}
  {#if smallImage}
    <input type="hidden" name="smallImage" value={smallImage} />
  {/if}
  {#if smallImagePreview}
    <input type="hidden" name="smallImagePreview" value={JSON.stringify(smallImagePreview)} />
  {/if}
  {#if mediumImage}
    <input type="hidden" name="mediumImage" value={mediumImage} />
  {/if}
  {#if mediumImagePreview}
    <input type="hidden" name="mediumImagePreview" value={JSON.stringify(mediumImagePreview)} />
  {/if}
</div>
