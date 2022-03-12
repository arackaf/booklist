import React, { useState, FunctionComponent, useLayoutEffect, useEffect } from "react";
import Toggle from "react-toggle";

import ManageBookCover from "./manageBookCover";
import EditBookInfo from "./editBookInfo";

import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/Tabs";
import ajaxUtil from "util/ajaxUtil";
import { needBookCoverPriming } from "util/localStorage";
import Stack from "../layout/Stack";
import FlowItems from "../layout/FlowItems";
import { CoverMobile, CoverSmall, NoCoverMedium } from "../bookCoverComponent";
import { IBookRaw } from "modules/books/booksState";

type Props = {
  saveBook: any;
  title: string;
  book: IBookRaw;
  onCancel: any;
};

type IndividualCover = { STATUS: string; image?: { url: string; preview: string } };
type UploadResultsType = { success: boolean; status?: string; mobile: IndividualCover; small: IndividualCover; medium: IndividualCover };

const EditBook: FunctionComponent<Props> = ({ book: bookToEdit, onCancel, saveBook, title }) => {
  const [state, setState] = useState({ tab: "basic", bookEditing: null, title: "" });

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
  };
  const clearCoverError = () => setCoverProcessingError(false);

  const [coverProcessingResult, setCoverProcessingResult] = useState<UploadResultsType>(null);

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
            <>
              <CurrentCovers book={bookToEdit} />
              <hr />

              <ManageBookCover onError={onCoverError} onResults={setCoverProcessingResult} />
              {coverProcessingError ? <div className="alert alert-danger">Error processing this cover</div> : null}
              {coverProcessingResult ? <UploadResults {...coverProcessingResult} /> : null}
            </>
          ) : null}
        </TabContent>
      </TabContents>
    </Tabs>
  );
};

const UploadResult: FunctionComponent<IndividualCover> = props => {
  const success = props.STATUS === "success";
  const { image } = props;

  return (
    <div style={{ flex: 1 }}>
      {success ? (
        <Stack inline={true} style={{ alignItems: "center", height: "100%" }}>
          <div className="margin-bottom">
            <img src={image!.url} />
          </div>
          <div style={{ marginTop: "auto" }}>
            <Toggle defaultChecked={false} icons={{ unchecked: null }} />
          </div>
        </Stack>
      ) : null}
    </div>
  );
};

const UploadResults: FunctionComponent<UploadResultsType> = props => {
  const { success, status, mobile, small, medium } = props;

  if (!success) {
    if (status === "invalid-size") {
      return <div className="alert alert-warning">This image is too small to use</div>;
    } else {
      return <div className="alert alert-danger">An error occured</div>;
    }
  }

  return (
    <FlowItems>
      <UploadResult {...mobile} />
      <UploadResult {...small} />
      <UploadResult {...medium} />
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
          <CoverMobile url={book.smallImage} />
        </div>
      </Stack>
      <Stack style={{ flex: 1 }} tightest={true}>
        <div>
          <label className="form-label">Full</label>
          <CoverMobile url={book.mediumImage} />
        </div>
      </Stack>
    </FlowItems>
  );
};

export default EditBook;
