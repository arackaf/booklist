import React, { useState, FunctionComponent, useMemo } from "react";
import Toggle from "react-toggle";
import { useMutation } from "micro-graphql-react";
import type { MutationOf, Mutations, BookMutationInput } from "graphql-typings";
import type { IBookRaw } from "modules/books/booksState";

import ManageBookCover from "./manageBookCover";

import Stack from "../layout/Stack";
import FlowItems from "../layout/FlowItems";
import { CoverMobile, CoverSmall, CoverMedium } from "../bookCoverComponent";
import UpdateBook from "graphQL/books/updateBook.graphql";

import { Button, ActionButton } from "../ui/Button";

type Props = {
  book: IBookRaw;
  updateBook(updater: (book: IBookRaw) => IBookRaw): void;
};

type IndividualCover = { STATUS: "success" | "invalid-size" | "error"; image?: { url: string; preview: string } };
type UploadResultsType = { success: boolean; status?: string; mobile: IndividualCover; small: IndividualCover; medium: IndividualCover };

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
    <div>
      <CurrentCovers book={book} />
      <hr />

      <ManageBookCover onError={onCoverError} onResults={onCoverResults} />
      {coverProcessingError ? <div className="alert alert-danger">Error processing this cover</div> : null}
      {coverProcessingResult ? (
        <UploadResults {...{ ...coverProcessingResult, useNewMobile, setUseNewMobile, useNewSmall, setUseNewSmall, useNewMedium, setUseNewMedium }} />
      ) : null}
      {saveEligible && isNew() ? (
        <Button className="margin-top" preset="primary" onClick={runSave}>
          Set image info
        </Button>
      ) : null}
      {saveEligible && !isNew() ? (
        <ActionButton className="margin-top" preset="primary" onClick={runSave} finishedText="Saved" text="Save" runningText="Saving" />
      ) : null}
    </div>
  );
};

type UploadResultAdditionalTypes = { size: "mobile" | "small" | "medium"; useNewImage: boolean; setUseNewImage: (val: boolean) => void };

const UploadResult: FunctionComponent<IndividualCover & UploadResultAdditionalTypes> = props => {
  const success = props.STATUS === "success";
  const { image, useNewImage, setUseNewImage, size } = props;
  const ImgComponent = size === "mobile" ? CoverMobile : size === "small" ? CoverSmall : CoverMedium;

  return (
    <div style={{ flex: 1 }}>
      {success ? (
        <Stack inline={true} style={{ alignItems: "center", height: "100%" }}>
          <div className="margin-bottom">
            <ImgComponent url={image.url} preview={image.preview} />
          </div>
          <div style={{ marginTop: "auto" }}>
            <Toggle checked={useNewImage} onChange={e => setUseNewImage(e.target.checked)} icons={{ unchecked: null }} />
          </div>
        </Stack>
      ) : null}
    </div>
  );
};

type UseCoversState = {
  useNewMobile: boolean;
  useNewSmall: boolean;
  useNewMedium: boolean;

  setUseNewMobile: (val: boolean) => void;
  setUseNewSmall: (val: boolean) => void;
  setUseNewMedium: (val: boolean) => void;
};
const UploadResults: FunctionComponent<UploadResultsType & UseCoversState> = props => {
  const { success, status, mobile, small, medium, useNewMobile, setUseNewMobile, useNewSmall, setUseNewSmall, useNewMedium, setUseNewMedium } = props;

  if (!success) {
    if (status === "invalid-size") {
      return <div className="alert alert-warning margin-top">This image is too small to use</div>;
    } else {
      return <div className="alert alert-danger margin-top">An error occured</div>;
    }
  }

  return (
    <FlowItems>
      <UploadResult {...mobile} useNewImage={useNewMobile} setUseNewImage={setUseNewMobile} size="mobile" />
      <UploadResult {...small} useNewImage={useNewSmall} setUseNewImage={setUseNewSmall} size="small" />
      <UploadResult {...medium} useNewImage={useNewMedium} setUseNewImage={setUseNewMedium} size="medium" />
    </FlowItems>
  );
};

const CurrentCovers: FunctionComponent<{ book: IBookRaw }> = ({ book }) => {
  return (
    <FlowItems>
      <Stack style={{ flex: 1 }} tightest={true}>
        <div>
          <label className="form-label">Mobile</label>
          <CoverMobile url={book.mobileImage} preview={book.mobileImagePreview} dontSuspend={true} />
        </div>
      </Stack>
      <Stack style={{ flex: 1 }} tightest={true}>
        <div>
          <label className="form-label">Standard</label>
          <CoverSmall url={book.smallImage} preview={book.smallImagePreview} dontSuspend={true} />
        </div>
      </Stack>
      <Stack style={{ flex: 1 }} tightest={true}>
        <div>
          <label className="form-label">Full</label>
          <CoverMedium url={book.mediumImage} preview={book.mediumImagePreview} dontSuspend={true} />
        </div>
      </Stack>
    </FlowItems>
  );
};
