<script lang="ts">
  import { enhance } from "$app/forms";

  import type { Book } from "$data/types";

  import ManageBookCover from "./ManageBookCover.svelte";
  import UploadResults from "./UploadResults.svelte";

  import Button from "../buttons/Button.svelte";
  import ActionButton from "../buttons/ActionButton.svelte";
  import CurrentCovers from "./CurrentCovers.svelte";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  export let book: Book;
  export let onSave: (_id: string, updates: UpdatesTo<Book>) => void;

  type IndividualCover = { STATUS: "success" | "invalid-size" | "error"; image?: { url: string; preview: string } };
  type UploadResultsType =
    | {
        success: false;
        status: "invalid-size" | "error";
      }
    | {
        success: true;
        mobile: IndividualCover;
        small: IndividualCover;
        medium: IndividualCover;
      };

  let coverProcessingResult: UploadResultsType | null = null;

  let useNewMobile = false;
  let useNewSmall = false;
  let useNewMedium = false;

  const setUseNewMobile = (val: any) => (useNewMobile = val);
  const setUseNewSmall = (val: any) => (useNewSmall = val);
  const setUseNewMedium = (val: any) => (useNewMedium = val);

  const onCoverError = () => {
    coverProcessingResult = { success: false, status: "error" };
  };

  const onCoverResults = (obj: UploadResultsType) => {
    coverProcessingResult = obj;
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

  $: mobileImage = useNewMobile && coverProcessingResult?.success ? coverProcessingResult.mobile.image?.url : null;
  $: mobileImagePreview = useNewMobile && coverProcessingResult?.success ? coverProcessingResult.mobile.image?.preview : null;

  $: smallImage = useNewSmall && coverProcessingResult?.success ? coverProcessingResult.small.image?.url : null;
  $: smallImagePreview = useNewSmall && coverProcessingResult?.success ? coverProcessingResult.small.image?.preview : null;

  $: mediumImage = useNewMedium && coverProcessingResult?.success ? coverProcessingResult.medium.image?.url : null;
  $: mediumImagePreview = useNewMedium && coverProcessingResult?.success ? coverProcessingResult.medium.image?.preview : null;

  function updateLocalBook() {}

  let saving = false;
  function executeSave() {
    const { _id } = book;

    saving = true;

    return async ({ result }: any) => {
      onSave(_id, result.data.updates);
      saving = false;
      coverProcessingResult = null;
    };
  }

  $: ({ success, status, mobile, small, medium } = coverProcessingResult || ({} as any));

  $: saveEligible = coverProcessingResult?.success && (useNewMobile || useNewSmall || useNewMedium);

  $: isNew = !book?._id;
</script>

<div>
  <CurrentCovers {book} />
  <hr />

  <ManageBookCover onError={onCoverError} onResults={onCoverResults} />

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
