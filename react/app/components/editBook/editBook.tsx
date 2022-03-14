import React, { useState, FunctionComponent, useLayoutEffect, useEffect } from "react";
import Toggle from "react-toggle";
import { useMutation } from "micro-graphql-react";
import type { MutationOf, Mutations, BookMutationInput } from "graphql-typings";
import type { IBookRaw } from "modules/books/booksState";

import ManageBookCover from "./manageBookCover";
import EditBookInfo from "./editBookInfo";

import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/Tabs";
import ajaxUtil from "util/ajaxUtil";
import { needBookCoverPriming } from "util/localStorage";
import Stack from "../layout/Stack";
import FlowItems from "../layout/FlowItems";
import { CoverMobile, CoverSmall, CoverMedium } from "../bookCoverComponent";
import UpdateBook from "graphQL/books/updateBook.graphql";

import { Button, ActionButton } from "../ui/Button";

type Props = {
  saveBook: any;
  title: string;
  book: IBookRaw;
  onCancel: any;
};

type IndividualCover = { STATUS: "success" | "invalid-size" | "error"; image?: { url: string; preview: string } };
type UploadResultsType = { success: boolean; status?: string; mobile: IndividualCover; small: IndividualCover; medium: IndividualCover };

const EditBook: FunctionComponent<Props> = ({ book: bookToEdit, onCancel, saveBook, title }) => {
  const { runMutation: runBookMutation } = useMutation<MutationOf<Mutations["updateBook"]>>(UpdateBook);

  const [state, setState] = useState({ tab: "basic", bookEditing: null, title: "" });

  const [saveEligible, setSaveEligible] = useState(false);
  const [coverProcessingResult, setCoverProcessingResult] = useState<UploadResultsType>(null);
  const [useNewMobile, setUseNewMobile] = useState(false);
  const [useNewSmall, setUseNewSmall] = useState(false);
  const [useNewMedium, setUseNewMedium] = useState(false);

  const updateBook = updateFn => {
    setState(state => ({ ...state, bookEditing: updateFn(state.bookEditing) }));
  };

  const editBook = book => {
    setState({
      tab: "basic",
      title,
      bookEditing: { ...book }
    });
  };

  const isNew = () => !bookEditing?._id;

  const runSave = () => {
    let { _id } = bookEditing;

    const updateObject: Partial<BookMutationInput> = {};
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
      return runBookMutation({ _id, book: updateObject });
    } else {
      updateBook(book => ({ ...book, ...updateObject }));
    }
  };

  useLayoutEffect(() => {
    if (bookToEdit && needBookCoverPriming()) {
      ajaxUtil.postWithCors(process.env.UPLOAD_BOOK_COVER, { avoidColdStart: true });
      ajaxUtil.postWithCors(process.env.UPLOAD_BOOK_COVER_FROM_URL, { avoidColdStart: true });
    }
    editBook(bookToEdit);
  }, [bookToEdit]);

  let { bookEditing } = state;
  let book = bookEditing;

  const [coverProcessingError, setCoverProcessingError] = useState(false);
  const onCoverError = () => {
    setCoverProcessingError(true);
    setCoverProcessingResult(null);
    setSaveEligible(false);
  };
  const clearCoverError = () => setCoverProcessingError(false);

  const onCoverResults = (obj: UploadResultsType) => {
    clearCoverError();
    setCoverProcessingResult(obj);
    if (obj.success) {
      setSaveEligible(true);
      setUseNewMobile(obj.mobile.STATUS === "success");
      setUseNewSmall(obj.small.STATUS === "success");
      setUseNewMedium(obj.medium.STATUS === "success");
    } else {
      setSaveEligible(false);
      setUseNewMobile(false);
      setUseNewSmall(false);
      setUseNewMedium(false);
    }
  };

  return (
    <Tabs defaultTab="basic">
      <TabHeaders>
        <TabHeader text="Book info" tabName="basic" />
        <TabHeader text="Covers" tabName="covers" />
      </TabHeaders>
      <TabContents>
        <TabContent tabName="basic">{book ? <EditBookInfo {...{ book, onCancel, saveBook }} updateBook={updateBook} /> : null}</TabContent>
        <TabContent tabName="covers">
          {book ? (
            <div>
              <CurrentCovers book={bookToEdit} />
              <hr />

              <ManageBookCover onError={onCoverError} onResults={onCoverResults} />
              {coverProcessingError ? <div className="alert alert-danger">Error processing this cover</div> : null}
              {coverProcessingResult ? (
                <UploadResults
                  {...{ ...coverProcessingResult, useNewMobile, setUseNewMobile, useNewSmall, setUseNewSmall, useNewMedium, setUseNewMedium }}
                />
              ) : null}
              {saveEligible && isNew() ? <Button className="margin-top" preset="primary" onClick={runSave} /> : null}
              {saveEligible && !isNew() ? (
                <ActionButton className="margin-top" preset="primary" onClick={runSave} finishedText="Saved" text="Save" runningText="Saving" />
              ) : null}
            </div>
          ) : null}
        </TabContent>
      </TabContents>
    </Tabs>
  );
};

const UploadResult: FunctionComponent<IndividualCover & { useNewImage: boolean; setUseNewImage: (val: boolean) => void }> = props => {
  const success = props.STATUS === "success";
  const { image, useNewImage, setUseNewImage } = props;

  return (
    <div style={{ flex: 1 }}>
      {success ? (
        <Stack inline={true} style={{ alignItems: "center", height: "100%" }}>
          <div className="margin-bottom">
            <img src={image!.url} />
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
      <UploadResult {...mobile} useNewImage={useNewMobile} setUseNewImage={setUseNewMobile} />
      <UploadResult {...small} useNewImage={useNewSmall} setUseNewImage={setUseNewSmall} />
      <UploadResult {...medium} useNewImage={useNewMedium} setUseNewImage={setUseNewMedium} />
    </FlowItems>
  );
};

const CurrentCovers: FunctionComponent<{ book: IBookRaw }> = ({ book }) => {
  return (
    <FlowItems>
      <Stack style={{ flex: 1 }} tightest={true}>
        <div>
          <label className="form-label">Mobile</label>
          <CoverMobile url={book.mobileImage} />
        </div>
      </Stack>
      <Stack style={{ flex: 1 }} tightest={true}>
        <div>
          <label className="form-label">Standard</label>
          <CoverSmall url={book.smallImage} />
        </div>
      </Stack>
      <Stack style={{ flex: 1 }} tightest={true}>
        <div>
          <label className="form-label">Full</label>
          <CoverMedium url={book.mediumImage} />
        </div>
      </Stack>
    </FlowItems>
  );
};

export default EditBook;
