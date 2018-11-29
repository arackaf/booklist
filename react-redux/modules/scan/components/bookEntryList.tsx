import React, { Component, Suspense, lazy } from "react";
import BookEntryItem from "./bookEntryItem";
import { connect } from "react-redux";

import { TransitionGroup, CSSTransition } from "react-transition-group";

import * as bookEntryActionCreators from "../reducers/actionCreators";
import BootstrapButton from "applicationRoot/components/bootstrapButton";

import Loading from "applicationRoot/components/loading";

import { scanReducerType } from "modules/scan/reducers/reducer";

import { MutationType } from "reactStartup";
// import { mutation } from "micro-graphql-react";

declare var webSocketAddress: any;

const ManualBookEntry = lazy(() => import(/* webpackChunkName: "manual-book-entry-modal" */ "applicationRoot/components/manualBookEntry"));

const defaultEmptyBook = () => ({
  title: "",
  isbn: "",
  pages: "",
  publisher: "",
  publicationDate: "",
  authors: [""]
});

// @mutation(
//   `mutation createBook($book: BookInput) {
//     createBook(Book: $book) { Book { _id }, success }
//   }`
// )
@connect(
  state => state.scanModule,
  { ...bookEntryActionCreators }
)
export default class BookEntryList extends Component<scanReducerType & typeof bookEntryActionCreators & MutationType, any> {
  refs: any;
  ws: any;
  state: any = { showIncomingQueue: false, showScanInstructions: false };
  toggleScanInstructions() {
    this.setState({ showScanInstructions: !this.state.showScanInstructions });
  }
  toggleIncomingQueue() {
    this.setState({ showIncomingQueue: !this.state.showIncomingQueue });
  }
  manuallyEnterBook() {
    this.setState({
      modalEntryLoaded: true,
      inManualEntry: true,
      manualSaved: false,
      manualBook: defaultEmptyBook()
    });
  }
  manualEntryEnding() {
    this.setState({ inManualEntry: false, bookToEdit: null });
  }
  saveNewBook(book) {
    let pages = parseInt(book.pages, 10);
    book.pages = isNaN(pages) ? void 0 : pages;

    this.props.runMutation({ book }).then(() => {
      this.setState({
        manualSaved: true,
        manualBook: defaultEmptyBook()
      });
      this.props.manualBookSaved(book);
      setTimeout(() => this.setState({ manualSaved: false }), 2000);
    });
  }
  render() {
    let pending = this.props.pendingNumber,
      toggleClass = this.state.showIncomingQueue ? "fa-angle-double-up" : "fa-angle-double-down",
      toggleInstructions = (
        <a onClick={() => this.toggleScanInstructions()}>
          <i className={`fa fa-question-circle`} />
        </a>
      ),
      toggleShow =
        this.props.booksJustSaved.length || pending ? (
          <a onClick={() => this.toggleIncomingQueue()}>
            <i style={{ color: "white" }} className={`fa fa-white ${toggleClass}`} />
          </a>
        ) : null;

    return (
      <div>
        <div className="panel panel-default" style={{ marginLeft: "15px", marginRight: "15px", marginTop: "15px", padding: "15px" }}>
          <div className="row">
            <div className="col-md-6 col-md-push-6" style={{ paddingBottom: "10px" }}>
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
                {this.state.showIncomingQueue ? (
                  <CSSTransition classNames="fade-transition" timeout={300} key={1}>
                    <div>
                      <br />
                      <div className="alert alert-info alert-slim">
                        Your entered and failed books will show up here, briefly, although everything is being logged. Eventually there'll be a
                        dedicated place to see what's been saved, and what failed to be found.
                      </div>

                      <ul style={{ marginBottom: 0 }}>
                        <TransitionGroup>
                          {this.props.booksJustSaved.map(book => (
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
            <div className="col-md-6 col-md-pull-6">
              <h4 style={{ marginTop: 0, marginBottom: 0 }}>
                Enter your books here {toggleInstructions}{" "}
                <a className="btn btn-xs btn-primary" onClick={() => this.manuallyEnterBook()}>
                  Manual entry
                </a>
              </h4>
              <TransitionGroup>
                {this.state.showScanInstructions ? (
                  <CSSTransition classNames="fade-transition" timeout={300} key={1}>
                    <div style={{ width: "80%" }}>
                      <div>
                        <div style={{ height: 10 }} />
                        <div style={{ margin: 0 }} className="alert alert-info alert-slim">
                          Enter each isbn below, and press "Retrieve and save all" to search for all entered books. Or, use a barcode scanner to
                          search for each book immediately (pressing enter after typing in a 10 or 13 digit isbn has the same effect).
                          <br /> <br />
                          After you enter the isbn in the last textbox, focus will jump back to the first. This is to make scanning a large number of
                          books with a barcode scanner as smooth as possible; just make sure you don't have any partially-entered ISBNs up top, or
                          else they may get overridden.
                        </div>
                      </div>
                    </div>
                  </CSSTransition>
                ) : null}
              </TransitionGroup>
              <br />
              {this.props.entryList.map((entry, i) => (
                <div key={i}>
                  <BookEntryItem
                    ref={"Book" + i}
                    {...entry}
                    isbnChange={e => this.isbnChanged(entry, e)}
                    entryFinished={() => this.entryFinished(entry)}
                    index={i}
                  />
                </div>
              ))}
              <div className="row">
                <div className="col-sm-8 form-horizontal">
                  <BootstrapButton className="pull-right" preset="primary" onClick={() => this.saveAll()}>
                    Retrieve and save all
                  </BootstrapButton>
                  <BootstrapButton preset="default" className="pull-left" onClick={this.props.resetList}>
                    Reset list
                  </BootstrapButton>
                </div>
                <div className="col-sm-4 pull-left" />
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          {this.state.modalEntryLoaded ? (
            <ManualBookEntry
              title={"Manually enter a book"}
              dragTitle={"Click or drag to upload a cover image. The uploaded image will be scaled down as needed"}
              bookToEdit={this.state.manualBook}
              isOpen={this.state.inManualEntry}
              isSaving={this.props.running}
              isSaved={this.state.manualSaved}
              saveBook={book => this.saveNewBook(book)}
              startOver={() => this.manuallyEnterBook()}
              onClosing={() => this.manualEntryEnding()}
            />
          ) : null}
        </Suspense>
      </div>
    );
  }
  componentDidMount() {
    this.ws = new WebSocket(webSocketAddress("/bookEntryWS"));

    this.ws.onmessage = ({ data }) => {
      let packet = JSON.parse(data);
      if (packet._messageType == "initial") {
        this.props.setPending(packet.pending);
      } else if (packet._messageType == "bookAdded") {
        this.props.bookSaved(packet);
      } else if (packet._messageType == "pendingBookAdded") {
        this.props.incrementPending();
      } else if (packet._messageType == "bookLookupFailed") {
        this.props.bookLookupFailed(packet.isbn);
      }
    };

    this.refs.Book0.focusInput();
  }
  componentWillUnmount() {
    try {
      this.ws.close();
    } catch (e) {}
  }
  saveAll() {
    this.props.saveAllPending();
  }
  isbnChanged(entry, e) {
    this.props.updateIsbn(e.target.value, this.props.entryList.indexOf(entry));
  }
  entryFinished(entry) {
    let index = this.props.entryList.indexOf(entry);
    if (index < this.props.entryList.length - 1) {
      this.refs["Book" + (index + 1)].focusInput();
      this.refs["Book" + (index + 1)].selectInput();
    } else {
      this.refs["Book0"].focusInput();
      this.refs["Book0"].selectInput();
    }

    if (entry.isbn.length == 10 || entry.isbn.length == 13) {
      this.props.enterBook(index, entry.isbn);
    }
  }
}
