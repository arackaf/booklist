<script lang="ts">
  import ManageBookCover from "./ManageBookCover.svelte";

  type IndividualCover = { STATUS: "success" | "invalid-size" | "error"; image?: { url: string; preview: string } };
  type UploadResultsType = { success: boolean; status?: string; mobile: IndividualCover; small: IndividualCover; medium: IndividualCover };

  let coverProcessingResult: UploadResultsType = null;

  let useNewMobile = false;
  let useNewSmall = false;
  let useNewMedium = false;

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
  /*
export const EditBookCovers: FunctionComponent<Props> = ({ book, updateBook }) => {
  const { runMutation: runBookMutation } = useMutation<MutationOf<Mutations["updateBook"]>>(UpdateBook);

  const [coverProcessingResult, setCoverProcessingResult] = useState<UploadResultsType>(null);
  const [useNewMobile, setUseNewMobile] = useState(false);
  const [useNewSmall, setUseNewSmall] = useState(false);
  const [useNewMedium, setUseNewMedium] = useState(false);

  const isNew = () => !book?._id;

  const saveEligible = useMemo(() => {
    return coverProcessingResult?.success && (useNewMobile || useNewSmall || useNewMedium);
  }, [coverProcessingResult, useNewMobile, useNewSmall, useNewMedium]);

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
      return runBookMutation({ _id, book: updateObject }).then(() => {
        setCoverProcessingResult(null);
        updateBook(b => ({ ...b, ...updateObject }));
      });
    } else {
      updateBook(b => ({ ...b, ...updateObject }));
      setCoverProcessingResult(null);
    }
  };

  const [coverProcessingError, setCoverProcessingError] = useState(false);
  const onCoverError = () => {
    setCoverProcessingError(true);
    setCoverProcessingResult(null);
  };
  const clearCoverError = () => setCoverProcessingError(false);

  const onCoverResults = (obj: UploadResultsType) => {
    clearCoverError();
    setCoverProcessingResult(obj);
    if (obj.success) {
      setUseNewMobile(obj.mobile.STATUS === "success");
      setUseNewSmall(obj.small.STATUS === "success");
      setUseNewMedium(obj.medium.STATUS === "success");
    } else {
      setUseNewMobile(false);
      setUseNewSmall(false);
      setUseNewMedium(false);
    }
  };

  return (

  */
</script>

<div>
  <!-- <CurrentCovers book={book} /> -->
  <!-- <hr /> -->

  <ManageBookCover onError={onCoverError} onResults={onCoverResults} />
  <!-- onError={onCoverError} onResults={onCoverResults} /> -->
  <!-- {coverProcessingError ? <div className="alert alert-danger">Error processing this cover</div> : null}
      {coverProcessingResult ? (
        <UploadResults {...{ ...coverProcessingResult, useNewMobile, setUseNewMobile, useNewSmall, setUseNewSmall, useNewMedium, setUseNewMedium }} />
      ) : null} -->
  <!-- {saveEligible && isNew() ? (
        <Button className="margin-top" preset="primary" onClick={runSave}>
          Set image info
        </Button>
      ) : null}
      {saveEligible && !isNew() ? (
        <ActionButton className="margin-top" preset="primary" onClick={runSave} finishedText="Saved" text="Save" runningText="Saving" />
      ) : null} 
    -->
</div>
