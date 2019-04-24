import React, { Suspense, lazy, FunctionComponent, useEffect, useRef, useState, useReducer } from "react";
import BookEntryItem from "./bookEntryItem";

import { TransitionGroup, CSSTransition } from "react-transition-group";

import Loading from "app/components/loading";

import { GraphQL, buildMutation } from "micro-graphql-react";
import createBookMutation from "graphQL/scan/createBook.graphql";

declare var webSocketAddress: any;

const ManualBookEntry = lazy(() => import(/* webpackChunkName: "manual-book-entry-modal" */ "app/components/manualBookEntry"));
const defaultEmptyBook = () => ({
  title: "",
  isbn: "",
  pages: "",
  publisher: "",
  publicationDate: "",
  authors: [""]
});

const entryList = Array.from({ length: 10 });

function scanReducer(state, [type, payload]) {
  switch (type) {
    case "initial":
      return { ...state, pending: payload.pending };
    case "pendingBookAdded":
      return { ...state, pending: state.pending + 1 };
    case "bookAdded":
      return { ...state, pending: state.pending - 1, booksSaved: [{ success: true, ...payload }].concat(state.booksSaved).slice(0, 15) };
    case "bookLookupFailed":
      let failure = { _id: "" + new Date(), title: `Failed lookup for ${payload.isbn}`, success: false };
      return { ...state, pending: state.pending - 1, booksSaved: [failure].concat(state.booksSaved).slice(0, 15) };
  }
  return state;
}

const BookEntryList: FunctionComponent<{}> = () => {
  let inputRefs = [] as any;
  for (let i = 0; i < 10; i++) {
    inputRefs.push(useRef(null));
  }
  const [showIncomingQueue, setShowIncomingQueue] = useState(false);
  const [showScanInstructions, setShowScanInstructions] = useState(false);
  const [{ pending, booksSaved: booksJustSaved }, dispatch] = useReducer(scanReducer, { pending: 0, booksSaved: [] });

  let ws: any = null;

  useEffect(() => {
    ws = new WebSocket(webSocketAddress("/bookEntryWS"));

    ws.onmessage = ({ data }) => {
      let packet = JSON.parse(data);
      dispatch([packet._messageType, packet]);
    };
    inputRefs[0].current.focusInput();
    return () => {
      try {
        ws.close();
      } catch (e) {}
    };
  }, []);

  const toggleScanInstructions = () => setShowScanInstructions(!showScanInstructions);
  const toggleIncomingQueue = () => setShowIncomingQueue(!showIncomingQueue);

  const [editState, setEditState] = useState({
    modalEntryLoaded: false,
    inManualEntry: false,
    manualSaved: false,
    manualBook: null,
    bookToEdit: null
  });

  const manuallyEnterBook = () => {
    setEditState({
      modalEntryLoaded: true,
      inManualEntry: true,
      manualSaved: false,
      manualBook: defaultEmptyBook(),
      bookToEdit: null
    });
  };
  const manualEntryEnding = () => {
    setEditState({ ...editState, inManualEntry: false, bookToEdit: null });
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
      let book = res.createBook && res.createBook.Book;
      return book;
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

  const toggleClass = showIncomingQueue ? "fa-angle-double-up" : "fa-angle-double-down";
  const toggleInstructions = (
    <a onClick={() => toggleScanInstructions()}>
      <i className={`fa fa-question-circle`} />
    </a>
  );
  const toggleShow =
    booksJustSaved.length || pending ? (
      <a onClick={() => toggleIncomingQueue()}>
        <i style={{ color: "white" }} className={`fa fa-white ${toggleClass}`} />
      </a>
    ) : null;

  return (
    <div>
      <GraphQL mutation={{ createBook: buildMutation(createBookMutation) }}>
        {({ createBook: { runMutation, running } }) => (
          <>
            <div className="row xs-pull-reverse" style={{ padding: "10px", marginBottom: "50px" }}>
              <div className="col-sm-6 col-xs-12">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h4 style={{ marginTop: 0, marginBottom: 0 }}>Enter your books here {toggleInstructions} </h4>
                  <a className="btn btn-xs btn-primary margin-left" onClick={() => manuallyEnterBook()}>
                    Manual entry
                  </a>
                </div>
                <TransitionGroup>
                  {showScanInstructions ? (
                    <CSSTransition classNames="fade-transition" timeout={300} key={1}>
                      <div style={{ width: "80%" }}>
                        <div>
                          <div style={{ height: 10 }} />
                          <div style={{ margin: 0 }} className="alert alert-info alert-slim">
                            Enter each isbn below, and press "Retrieve and save all" to search for all entered books. Or, use a barcode scanner to
                            search for each book immediately (pressing enter after typing in a 10 or 13 digit isbn has the same effect).
                            <br /> <br />
                            After you enter the isbn in the last textbox, focus will jump back to the first. This is to make scanning a large number
                            of books with a barcode scanner as smooth as possible; just make sure you don't have any partially-entered ISBNs up top,
                            or else they may get overridden.
                          </div>
                        </div>
                      </div>
                    </CSSTransition>
                  ) : null}
                </TransitionGroup>
                <br />
                {entryList.map((entry, i) => (
                  <div key={i}>
                    <BookEntryItem ref={inputRefs[i]} entryFinished={() => entryFinished(i)} />
                  </div>
                ))}
              </div>
              <div className="col-sm-6 col-xs-12" style={{ paddingBottom: "10px" }}>
                <div>
                  {pending == null ? null : pending ? (
                    <span className="label label-info">
                      {`${pending} Book${pending === 1 ? "" : "s"} currently outstanding`} {toggleShow}
                    </span>
                  ) : (
                    <span className="label label-success">All pending books saved {toggleShow}</span>
                  )}
                </div>

                <TransitionGroup>
                  {showIncomingQueue ? (
                    <CSSTransition classNames="fade-transition" timeout={300} key={1}>
                      <div>
                        <br />
                        <div className="alert alert-info alert-slim" style={{ marginBottom: "15px" }}>
                          Your entered and failed books will show up here, briefly, although everything is being logged. Eventually there'll be a
                          dedicated place to see what's been saved, and what failed to be found.
                        </div>

                        <ul style={{ marginBottom: 0 }}>
                          <TransitionGroup>
                            {booksJustSaved.map(book => (
                              <CSSTransition classNames="fade-transition" timeout={300} key={book._id}>
                                <li style={{ color: book.success ? "green" : "red" }}>{book.title}</li>
                              </CSSTransition>
                            ))}
                          </TransitionGroup>
                        </ul>
                        <br />
                      </div>
                    </CSSTransition>
                  ) : null}
                </TransitionGroup>
              </div>
            </div>

            <Suspense fallback={<Loading />}>
              {editState.modalEntryLoaded ? (
                <ManualBookEntry
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
          </>
        )}
      </GraphQL>
    </div>
  );
};

export default BookEntryList;
