import React, { Suspense, lazy, FunctionComponent, useEffect, useRef, useState } from "react";
import BookEntryItem from "./bookEntryItem";
import ScanResults from "./scanResults";

import Loading from "app/components/loading";

import { useMutation } from "micro-graphql-react";
import createBookMutation from "gql/scan/createBook.graphql";
import { SlideInContents } from "app/animationHelpers";
import FlowItems from "app/components/layout/FlowItems";
import { useTagsState } from "app/state/tagsState";
import { useSubjectsState } from "app/state/subjectsState";

const CreateBookModal = lazy(() => import(/* webpackChunkName: "book-view-edit-modals" */ "app/components/editBook/editModal"));
const defaultEmptyBook = () => ({
  title: "",
  isbn: "",
  pages: "",
  publisher: "",
  publicationDate: "",
  authors: [""],
  tags: [],
  subjects: []
});

const entryList = Array.from({ length: 10 });

const BookEntryList: FunctionComponent<{}> = () => {
  // ---------------------------------------------------------------------------------------------------------
  // This component doesn't need this data, but it seems suspending in a portal causes bad things to happen so
  useTagsState();
  useSubjectsState();
  // ---------------------------------------------------------------------------------------------------------

  const [showScanInstructions, setShowScanInstructions] = useState(false);
  const toggleScanInstructions = () => setShowScanInstructions(!showScanInstructions);

  const toggleInstructions = (
    <a onClick={() => toggleScanInstructions()}>
      <i className={`far fa-question-circle`} />
    </a>
  );

  let inputRefs = [] as any;
  for (let i = 0; i < 10; i++) {
    inputRefs.push(useRef(null));
  }

  useEffect(() => {
    inputRefs[0].current.focusInput();
  }, []);

  const [editState, setEditState] = useState({
    modalEntryLoaded: false,
    inManualEntry: false,
    manualSaved: false,
    manualBook: null
  });

  const manuallyEnterBook = () => {
    setEditState({
      modalEntryLoaded: true,
      inManualEntry: true,
      manualSaved: false,
      manualBook: defaultEmptyBook()
    });
  };
  const manualEntryEnding = () => {
    setEditState({ ...editState, inManualEntry: false });
  };

  const saveNewBook = (book, runMutation) => {
    let pages = parseInt(book.pages, 10);
    book.pages = isNaN(pages) ? void 0 : pages;

    return runMutation({ book }).then(res => {
      setEditState({
        ...editState,
        manualSaved: true,
        manualBook: defaultEmptyBook()
      });
      setTimeout(() => setEditState(editState => ({ ...editState, manualSaved: false })), 2000);
    });
  };

  const entryFinished = index => {
    if (index < entryList.length - 1) {
      inputRefs[index + 1].current.focusInput();
      inputRefs[index + 1].current.selectInput();
    } else {
      inputRefs[0].current.focusInput();
      inputRefs[0].current.selectInput();
    }
  };

  const { runMutation, running } = useMutation(createBookMutation);

  return (
    <section>
      <FlowItems pushLast={true} xsFlowReverse={true}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h4 style={{ marginTop: 0, marginBottom: 0, fontSize: "16px" }}>Enter your books here {toggleInstructions} </h4>
            <button className="btn btn-xs margin-left" onClick={() => manuallyEnterBook()}>
              Manual entry
            </button>
          </div>
          <div style={{ marginTop: "10px" }}>
            <SlideInContents opacity={true} in={showScanInstructions} style={{ width: "80%" }}>
              <div className="card card-info card-slim">
                Enter each isbn below, and press "Retrieve and save all" to search for all entered books. Or, use a barcode scanner to search for each
                book immediately (pressing enter after typing in a 10 or 13 digit isbn has the same effect).
                <br /> <br />
                After you enter the isbn in the last textbox, focus will jump back to the first. This is to make scanning a large number of books with
                a barcode scanner as smooth as possible; just make sure you don't have any partially-entered ISBNs up top, or else they may get
                overridden.
              </div>
            </SlideInContents>
          </div>
          <br />
          {entryList.map((entry, i) => (
            <div key={i}>
              <BookEntryItem ref={inputRefs[i]} entryFinished={() => entryFinished(i)} />
            </div>
          ))}
        </div>
        <ScanResults />
      </FlowItems>

      <Suspense fallback={<Loading />}>
        {editState.modalEntryLoaded ? (
          <CreateBookModal
            title={"Manually enter a book"}
            bookToEdit={editState.manualBook}
            isOpen={editState.inManualEntry}
            isSaving={running}
            isSaved={editState.manualSaved}
            saveBook={book => saveNewBook(book, runMutation)}
            startOver={() => manuallyEnterBook()}
            onClosing={() => manualEntryEnding()}
          />
        ) : null}
      </Suspense>
    </section>
  );
};

export default BookEntryList;
