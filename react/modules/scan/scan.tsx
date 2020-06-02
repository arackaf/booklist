import React, { Suspense, lazy, FunctionComponent, useEffect, useRef, useState, useReducer } from "react";
import BookEntryItem from "./bookEntryItem";

import { TransitionGroup, CSSTransition } from "react-transition-group";

import Loading from "app/components/loading";

import { useMutation } from "micro-graphql-react";
import createBookMutation from "graphQL/scan/createBook.graphql";
import FlexRow from "app/components/layout/FlexRow";
import { SlideInContents } from "app/animationHelpers";

declare var webSocketAddress: any;

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

function scanReducer(state, [type, payload]) {
  switch (type) {
    case "initial":
      return { ...state, pending: payload.pending };
    case "pendingBookAdded":
      return { ...state, pending: state.pending + 1 };
    case "bookAdded":
      window.dispatchEvent(new Event("book-scanned"));
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

  const { runMutation, running } = useMutation(createBookMutation);
  const [val, setVal] = useState(0);

  return (
    <div className="standard-module-container">
      <FlexRow xsFlowReverse={true}>
        <div className="col-sm-6 col-xs-12">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h4 style={{ marginTop: 0, marginBottom: 0 }}>Enter your books here {toggleInstructions} </h4>
            <button className="btn btn-xs margin-left" onClick={() => manuallyEnterBook()}>
              Manual entry
            </button>
          </div>
          <div style={{ marginTop: "10px" }}>
            <SlideInContents in={showScanInstructions} className="bl-fade card card-info card-slim slidable animate-fast" style={{ width: "80%" }}>
              <>
                Enter each isbn below, and press "Retrieve and save all" to search for all entered books. Or, use a barcode scanner to search for each
                book immediately (pressing enter after typing in a 10 or 13 digit isbn has the same effect).
                <br /> <br />
                After you enter the isbn in the last textbox, focus will jump back to the first. This is to make scanning a large number of books with
                a barcode scanner as smooth as possible; just make sure you don't have any partially-entered ISBNs up top, or else they may get
                overridden.
                {val > 0 ? (
                  <>
                    <br />
                    <br /> "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Sit amet purus gravida quis. Lacus vel facilisis volutpat est velit egestas. Elementum nisi quis eleifend quam adipiscing.
                    Nibh sed pulvinar proin gravida hendrerit lectus a. Vitae justo eget magna fermentum iaculis. Pellentesque elit ullamcorper
                    dignissim cras tincidunt lobortis feugiat. Cursus mattis molestie a iaculis at erat pellentesque adipiscing commodo. Tortor
                    posuere ac ut consequat semper. Urna duis convallis convallis tellus id interdum velit laoreet id. Ut pharetra sit amet aliquam id
                    diam. Aliquet risus feugiat in ante metus dictum at tempor. Viverra accumsan in nisl nisi scelerisque. Enim nunc faucibus a
                    pellentesque sit amet. Urna condimentum mattis pellentesque id nibh."
                  </>
                ) : null}
                <br />
                {val > 1 ? (
                  <>
                    <br />
                    <br /> "Non enim praesent elementum facilisis. Tempus imperdiet nulla malesuada pellentesque elit eget gravida. Neque viverra
                    justo nec ultrices dui sapien eget mi proin. Viverra ipsum nunc aliquet bibendum enim facilisis gravida. Integer eget aliquet nibh
                    praesent tristique magna sit amet. Ante metus dictum at tempor commodo ullamcorper a. Cras fermentum odio eu feugiat pretium.
                    Placerat duis ultricies lacus sed turpis tincidunt id aliquet. Odio facilisis mauris sit amet. Ac feugiat sed lectus vestibulum
                    mattis ullamcorper velit sed ullamcorper. Ac auctor augue mauris augue neque. Amet consectetur adipiscing elit pellentesque
                    habitant morbi tristique. Viverra justo nec ultrices dui sapien eget mi. Massa eget egestas purus viverra accumsan. Ultrices neque
                    ornare aenean euismod elementum nisi quis eleifend quam."
                  </>
                ) : null}
              </>
            </SlideInContents>
          </div>
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
              <CSSTransition classNames="bl-animate" timeout={300} key={1}>
                <div className="bl-fade">
                  <br />
                  <div className="alert alert-info alert-slim" style={{ marginBottom: "15px" }}>
                    Your entered and failed books will show up here, briefly, although everything is being logged. Eventually there'll be a dedicated
                    place to see what's been saved, and what failed to be found.
                  </div>

                  <ul style={{ marginBottom: 0 }}>
                    <TransitionGroup>
                      {booksJustSaved.map(book => (
                        <CSSTransition classNames="bl-animate" timeout={300} key={book._id}>
                          <li className="bl-fade" style={{ color: book.success ? "green" : "red" }}>
                            {book.title}
                          </li>
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
      </FlexRow>

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

      <br />
      <br />
    </div>
  );
};

export default BookEntryList;
