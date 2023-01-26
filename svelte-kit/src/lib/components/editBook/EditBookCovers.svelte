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

  let useNewMobile = false;
  let useNewSmall = false;
  let useNewMedium = false;

  const setUseNewMobile = (val: any) => (useNewMobile = val);
  const setUseNewSmall = (val: any) => (useNewSmall = val);
  const setUseNewMedium = (val: any) => (useNewMedium = val);

  const onCoverError = () => {
    uploadResults = { success: false, status: "error" };
  };

  const onCoverResults = (obj: CoverUploadResults) => {
    uploadResults = obj;
    if (obj.success) {
      useNewMobile = obj.mobile?.STATUS === "success";
      useNewSmall = obj.small?.STATUS === "success";
      useNewMedium = obj.medium?.STATUS === "success";
    } else {
      useNewMobile = false;
      useNewSmall = false;
      useNewMedium = false;
    }
  };

  $: mobileImage = useNewMobile && uploadResults?.success ? uploadResults.mobile.image?.url : null;
  $: mobileImagePreview = useNewMobile && uploadResults?.success ? uploadResults.mobile.image?.preview : null;

  $: smallImage = useNewSmall && uploadResults?.success ? uploadResults.small.image?.url : null;
  $: smallImagePreview = useNewSmall && uploadResults?.success ? uploadResults.small.image?.preview : null;

  $: mediumImage = useNewMedium && uploadResults?.success ? uploadResults.medium.image?.url : null;
  $: mediumImagePreview = useNewMedium && uploadResults?.success ? uploadResults.medium.image?.preview : null;
</script>

<div>
  <CurrentCovers {book} />
  <hr />

  <ManageBookCover onError={onCoverError} onResults={onCoverResults} />

  {#if uploadResults}
    <UploadResults {uploadResults} {useNewMobile} {setUseNewMobile} {useNewSmall} {setUseNewSmall} {useNewMedium} {setUseNewMedium} />
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
