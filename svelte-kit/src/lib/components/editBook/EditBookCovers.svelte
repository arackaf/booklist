<script lang="ts">
  import { BookMutationInput, MutationOf, Mutations } from "gql/graphql-typings";
  import UpdateBook from "gql/books/updateBook.graphql";

  import { mutation } from "micro-graphql-svelte";

  import ManageBookCover from "./ManageBookCover.svelte";
  import UploadResults from "./UploadResults.svelte";
  import { IBookRaw } from "modules/books/booksState";
  import Button from "../buttons/Button.svelte";
  import ActionButton from "../buttons/ActionButton.svelte";
  import CurrentCovers from "./CurrentCovers.svelte";

  export let book;
  export let updateBook: (updater: (book: IBookRaw) => IBookRaw) => void;

  const { mutationState: updateMutationState } = mutation<MutationOf<Mutations["updateBook"]>>(UpdateBook);
  $: updateBookState = $updateMutationState;

  type IndividualCover = { STATUS: "success" | "invalid-size" | "error"; image?: { url: string; preview: string } };
  type UploadResultsType = {
    success: boolean;
    status?: "success" | "invalid-size" | "error";
    mobile: IndividualCover;
    small: IndividualCover;
    medium: IndividualCover;
  };

  let coverProcessingResult: UploadResultsType = null;

  let useNewMobile = false;
  let useNewSmall = false;
  let useNewMedium = false;

  const setUseNewMobile = val => (useNewMobile = val);
  const setUseNewSmall = val => (useNewSmall = val);
  const setUseNewMedium = val => (useNewMedium = val);

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

    const updateObject: Partial<
      Pick<BookMutationInput, "mobileImage" | "mobileImagePreview" | "smallImage" | "smallImagePreview" | "mediumImage" | "mediumImagePreview">
    > = {};
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
      return updateBookState.runMutation({ _id, book: updateObject }).then(() => {
        coverProcessingResult = null;
        updateBook(b => ({ ...b, ...updateObject }));
      });
    } else {
      updateBook(b => ({ ...b, ...updateObject }));
      coverProcessingResult = null;
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
