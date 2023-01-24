<script lang="ts">
  import type { Book } from "$data/types";

  import ManageBookCover from "./ManageBookCover.svelte";
  import UploadResults from "./UploadResults.svelte";

  import Button from "../buttons/Button.svelte";
  import ActionButton from "../buttons/ActionButton.svelte";
  import CurrentCovers from "./CurrentCovers.svelte";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  export let book: Book;
  export let onBookUpdated: (_id: string, updates: UpdatesTo<Book>) => void;

  type IndividualCover = { STATUS: "success" | "invalid-size" | "error"; image?: { url: string; preview: string } };
  type UploadResultsType = {
    success: boolean;
    status?: "success" | "invalid-size" | "error";
    mobile: IndividualCover;
    small: IndividualCover;
    medium: IndividualCover;
  };

  let coverProcessingResult: any = null;

  let useNewMobile = false;
  let useNewSmall = false;
  let useNewMedium = false;

  const setUseNewMobile = (val: any) => (useNewMobile = val);
  const setUseNewSmall = (val: any) => (useNewSmall = val);
  const setUseNewMedium = (val: any) => (useNewMedium = val);

  let coverProcessingError = false;
  const onCoverError = () => {
    coverProcessingError = true;
    coverProcessingResult = null;
  };
  const clearCoverError = () => (coverProcessingError = false);

  const onCoverResults = (obj: UploadResultsType) => {
    clearCoverError();
    coverProcessingResult = obj;
    if (obj.success) {
      useNewMobile = obj.mobile.STATUS === "success";
      useNewSmall = obj.small.STATUS === "success";
      useNewMedium = obj.medium.STATUS === "success";
    } else {
      useNewMobile = false;
      useNewSmall = false;
      useNewMedium = false;
    }
  };

  const runSave = () => {
    let { _id } = book;

    const updateObject: Partial<Book> = {};

    if (useNewMobile) {
      updateObject.mobileImage = coverProcessingResult.mobile.image.url;
      updateObject.mobileImagePreview = coverProcessingResult.mobile.image.preview;
    }
    if (useNewSmall) {
      updateObject.smallImage = coverProcessingResult.small.image.url;
      updateObject.smallImagePreview = coverProcessingResult.small.image.preview;
    }
    if (useNewMedium) {
      updateObject.mediumImage = coverProcessingResult.medium.image.url;
      updateObject.mediumImagePreview = coverProcessingResult.medium.image.preview;
    }

    if (_id) {
      onBookUpdated(_id, { fieldsSet: updateObject });
      // return updateBookState.runMutation({ _id, book: updateObject }).then(() => {
      //   coverProcessingResult = null;
      //   updateBook(b => ({ ...b, ...updateObject }));
      // });
    } else {
      // updateBook(b => ({ ...b, ...updateObject }));
      // coverProcessingResult = null;
    }
  };

  $: ({ success, status, mobile, small, medium } = coverProcessingResult || ({} as any));

  $: saveEligible = coverProcessingResult?.success && (useNewMobile || useNewSmall || useNewMedium);

  $: isNew = !book?._id;
</script>

<div>
  <CurrentCovers {book} />
  <hr />

  <ManageBookCover onError={onCoverError} onResults={onCoverResults} />

  {#if coverProcessingError}
    <div class="alert alert-danger">Error processing this cover</div>
  {/if}

  {#if coverProcessingResult}
    <UploadResults
      {success}
      {status}
      {mobile}
      {small}
      {medium}
      {useNewMobile}
      {setUseNewMobile}
      {useNewSmall}
      {setUseNewSmall}
      {useNewMedium}
      {setUseNewMedium}
    />
  {/if}

  {#if saveEligible && isNew}
    <Button class="margin-top" preset="primary" onClick={runSave}>Set image info</Button>
  {/if}

  {#if saveEligible && !isNew}
    <ActionButton class="margin-top" preset="primary" onClick={runSave} finishedText="Saved" text="Save" runningText="Saving" />
  {/if}
</div>
