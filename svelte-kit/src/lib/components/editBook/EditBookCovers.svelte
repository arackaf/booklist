<script lang="ts">
  import type { Book, BookImages } from "$data/types";

  import ManageBookCover from "./ManageBookCover.svelte";
  import UploadResults from "./UploadResults.svelte";

  import CurrentCovers from "./CurrentCovers.svelte";

  export let book: Book;
  let status: "error" | "invalid-size" | "" = "";

  let error = false;
  const emptyImages: BookImages = {
    mobileImage: "",
    mobileImagePreview: null,
    smallImage: "",
    smallImagePreview: null,
    mediumImage: "",
    mediumImagePreview: null
  };
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
    if (obj == null) {
      error = true;
      status = "invalid-size";
    } else {
      error = false;
      status = "";
      uploadResults = Object.assign({}, emptyImages, obj);
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

  {#if uploadResults || error}
    <UploadResults {error} {status} {uploadResults} />
  {/if}

  {#if uploadResults}
    <input type="hidden" name="mobileImage" value={mobileImage || ""} />
    <input type="hidden" name="mobileImagePreview" value={JSON.stringify(mobileImagePreview)} />

    <input type="hidden" name="smallImage" value={smallImage || ""} />
    <input type="hidden" name="smallImagePreview" value={JSON.stringify(smallImagePreview)} />

    <input type="hidden" name="mediumImage" value={mediumImage || ""} />
    <input type="hidden" name="mediumImagePreview" value={JSON.stringify(mediumImagePreview)} />
  {/if}
</div>
