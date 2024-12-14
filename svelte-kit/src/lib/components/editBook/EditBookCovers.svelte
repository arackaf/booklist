<script lang="ts">
  import type { Book, BookImages } from "$data/types";

  import ManageBookCover from "./ManageBookCover.svelte";
  import UploadResults from "./UploadResults.svelte";

  import CurrentCovers from "./CurrentCovers.svelte";

  let { book }: { book: Book } = $props();

  let status = $state<"error" | "invalid-size" | "">("");
  let error = $state(false);

  const emptyImages: BookImages = {
    mobileImage: "",
    mobileImagePreview: null,
    smallImage: "",
    smallImagePreview: null,
    mediumImage: "",
    mediumImagePreview: null
  };
  let uploadResults = $state<BookImages | null>(null);

  const onCoverError = () => {
    error = true;
    status = "error";
    uploadResults = {} as BookImages;
  };

  const onCoverResults = (obj: BookImages) => {
    if (obj == null) {
      error = true;
      status = "invalid-size";
      uploadResults = null;
    } else {
      error = false;
      status = "";
      uploadResults = Object.assign({}, emptyImages, obj);
    }
  };

  let mobileImage = $derived(uploadResults?.mobileImage);
  let mobileImagePreview = $derived(uploadResults?.mobileImagePreview);

  let smallImage = $derived(uploadResults?.smallImage);
  let smallImagePreview = $derived(uploadResults?.smallImagePreview);

  let mediumImage = $derived(uploadResults?.mediumImage);
  let mediumImagePreview = $derived(uploadResults?.mediumImagePreview);
</script>

<div>
  <CurrentCovers {book} />
  <hr class="my-3" />

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
