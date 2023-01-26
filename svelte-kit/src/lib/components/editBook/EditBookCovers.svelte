<script lang="ts">
  import { enhance } from "$app/forms";

  import type { Book, BookCoversEdits } from "$data/types";
  import type { CoverUploadResults } from "$lambda/types";

  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import ManageBookCover from "./ManageBookCover.svelte";
  import UploadResults from "./UploadResults.svelte";

  import Button from "../buttons/Button.svelte";
  import ActionButton from "../buttons/ActionButton.svelte";
  import CurrentCovers from "./CurrentCovers.svelte";

  export let book: Book;
  export let onSave: (_id: string, updates: UpdatesTo<Book>) => void;

  export let updateUnsavedBook: (updates: BookCoversEdits) => void;

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

  function updateLocalBook() {
    const updatesPrelim: BookCoversEdits = {
      mobileImage,
      mobileImagePreview,
      smallImage,
      smallImagePreview,
      mediumImage,
      mediumImagePreview
    };
    const updates: BookCoversEdits = Object.entries(updatesPrelim).reduce<BookCoversEdits>((obj, [k, v]) => {
      if (v) {
        // @ts-ignore
        obj[k] = v;
      }
      return obj;
    }, {});

    updateUnsavedBook(updates);
    uploadResults = null;
  }

  let saving = false;
  function executeSave() {
    const { _id } = book;

    saving = true;

    return async ({ result }: any) => {
      onSave(_id, result.data.updates);
      saving = false;
      uploadResults = null;
    };
  }

  $: saveEligible = uploadResults?.success && (useNewMobile || useNewSmall || useNewMedium);

  $: isNew = !book?._id;
</script>

<div>
  <CurrentCovers {book} />
  <hr />

  <ManageBookCover onError={onCoverError} onResults={onCoverResults} />

  {#if uploadResults}
    <UploadResults {uploadResults} {useNewMobile} {setUseNewMobile} {useNewSmall} {setUseNewSmall} {useNewMedium} {setUseNewMedium} />
  {/if}

  {#if saveEligible && isNew}
    <Button class="margin-top" preset="primary" onClick={updateLocalBook}>Set image info</Button>
  {/if}

  {#if saveEligible && !isNew}
    <form action="/books?/saveBookCovers" method="post" use:enhance={executeSave}>
      <input type="hidden" name="_id" value={book._id} />
      <input type="hidden" name="mobileImage" value={mobileImage} />
      <input type="hidden" name="mobileImagePreview" value={mobileImagePreview} />
      <input type="hidden" name="smallImage" value={smallImage} />
      <input type="hidden" name="smallImagePreview" value={smallImagePreview} />
      <input type="hidden" name="mediumImage" value={mediumImage} />
      <input type="hidden" name="mediumImagePreview" value={mediumImagePreview} />

      <ActionButton class="margin-top" preset="primary" isRunning={saving} finishedText="Saved" text="Save" runningText="Saving" />
    </form>
  {/if}
</div>
