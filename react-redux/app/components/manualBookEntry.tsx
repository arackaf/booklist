import React, { Component, useState } from "react";
import { BootstrapAnchorButton, AjaxButton } from "app/components/bootstrapButton";
import Dropzone from "react-dropzone";

import ajaxUtil from "util/ajaxUtil";
import Modal from "./modal";

import UpdateBook from "graphQL/books/updateBook.graphql";
import { useMutation, buildMutation } from "micro-graphql-react";
import { updateSmallCover, updateMediumCover } from "util/coverUpdates";

const RemoteImageUpload = props => {
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const keyDown = evt => {
    if (evt.keyCode == 13) {
      doSave();
    }
  };

  const doSave = () => {
    setSaving(true);
    Promise.resolve(props.remoteSave({ _id: props._id, url })).then(({ url, failure }) => {
      setSaving(false);
      if (!failure) {
        props.onUpdate(url);
      }
    });
  };

  return (
    <div className="btn-group">
      <input
        onKeyDown={keyDown}
        value={url}
        style={{ minWidth: "200px" }}
        onChange={e => setUrl(e.target.value)}
        className="form-control"
        placeholder="New Cover URL"
        tabIndex={-1}
      />
      <button className="btn btn-default" disabled={!url || saving} onClick={doSave}>
        <i className="far fa-cloud-upload-alt" />
      </button>
    </div>
  );
};

const ManageBookCover = props => {
  const { _id, img, endpoint, imgKey, remoteSave } = props;
  const [currentUrl, setCurrentUrl] = useState(img);
  const [uploadState, setUploadState] = useState({ pendingImg: "", uploadError: "" });

  const { runMutation: updateBook, running: updateRunning } = useMutation(buildMutation(UpdateBook));

  const runSave = () => {
    if (!uploadState.pendingImg) {
      return;
    }
    let newUrl = uploadState.pendingImg;
    return updateBook({ _id, book: { [imgKey]: uploadState.pendingImg } }).then(() => {
      setCurrentUrl(newUrl);
      setUploadState({ pendingImg: "", uploadError: "" });
    });
  };

  const onDrop = files => {
    let request = new FormData();
    request.append("fileUploaded", files[0]);

    ajaxUtil.postWithFiles(`/react-redux/${endpoint}`, request, res => {
      if (res.error) {
        setUploadState({ pendingImg: "", uploadError: res.error });
      } else {
        setUploadState({ pendingImg: res.url, uploadError: "" });
      }
    });
  };

  const { pendingImg, uploadError } = uploadState;
  return (
    <div style={{ display: "flex", flexFlow: "row wrap" }}>
      <div className="margin-right">
        {img ? <img crossOrigin="anonymous" src={currentUrl} /> : <span className="alert alert-warning">No Cover</span>}
      </div>
      {!pendingImg ? (
        <div className="margin-right" style={{ minWidth: "100px", maxWidth: "140px" }}>
          <Dropzone
            acceptStyle={{ border: "3px solid var(--primary-8)" }}
            rejectStyle={{ border: "3px solid var(--primary-9)" }}
            activeStyle={{ border: "3px solid var(--primary-9)" }}
            disabledStyle={{ border: "3px solid var(--primary-9)" }}
            style={{ border: "3px solid var(--primary-9)", padding: "5px", fontSize: "14px", textAlign: "center", cursor: "pointer" }}
            onDrop={files => onDrop(files)}
            multiple={false}
          >
            <div>Click or drag to upload a new cover</div>
          </Dropzone>
          {uploadError ? (
            <div style={{ display: "inline-block", marginBottom: "2px" }} className="label label-danger">
              {uploadError}
            </div>
          ) : null}
        </div>
      ) : null}
      {pendingImg ? (
        <div className="margin-right">
          <img src={pendingImg} />
          <br />
          <div style={{ display: "flex" }}>
            <button onClick={runSave} className="btn btn-xs btn-light btn-square-icon">
              <i className="fal fa-check" />
            </button>
            <button
              className="btn btn-xs btn-light btn-square-icon"
              style={{ marginLeft: "auto" }}
              onClick={() => setUploadState({ pendingImg: "", uploadError: "" })}
            >
              <i className="fal fa-undo" />
            </button>
          </div>
        </div>
      ) : null}
      <div>
        <RemoteImageUpload _id={_id} remoteSave={remoteSave} onUpdate={setCurrentUrl} />
      </div>
    </div>
  );
};

class ManualBookEntry extends Component<any, any> {
  state = { tab: "basic", bookEditing: null, titleMissing: false, authorsChanged: false };
  syncStateFromInput = name => evt => this.setState({ bookEditing: { ...this.state.bookEditing, [name]: evt.target.value } });
  SyncedInput = ({ syncName, onEnter, ...props }) => (
    <input
      onKeyDown={evt => (evt.keyCode || evt.which) == 13 && onEnter()}
      onChange={this.syncStateFromInput(syncName)}
      value={this.state.bookEditing[syncName] || ""}
      {...props}
    />
  );
  syncAuthor = index => evt => {
    let newAuthors = this.state.bookEditing.authors.concat();
    newAuthors[index] = evt.target.value;
    this.setState({ bookEditing: { ...this.state.bookEditing, authors: newAuthors } });
  };
  addAuthor(evt) {
    evt.preventDefault();
    let bookEditing = this.state.bookEditing;
    this.setState({ authorsChanged: true, bookEditing: Object.assign({}, bookEditing, { authors: bookEditing.authors.concat("") }) });
  }
  save() {
    if (!this.state.bookEditing.title) {
      this.setState({ titleMissing: true });
    } else {
      this.setState({ titleMissing: false });

      //trim out empty authors now, so they're not applied in the reducer, and show up as empty entries on subsequent edits
      let bookToSave = { ...this.state.bookEditing, authors: this.state.bookEditing.authors.filter(a => a) };
      Promise.resolve(this.props.saveBook(bookToSave)).then(book => {
        book && this.setState(({ bookEditing }) => ({ bookEditing: { ...bookEditing, _id: book._id } }));
      });
    }
  }
  closeModal() {
    this.props.onClosing();
  }
  componentDidMount() {
    //TODO: refactor with what's below
    if (this.props.bookToEdit) {
      this.editBook(this.props.bookToEdit);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.bookToEdit !== nextProps.bookToEdit) {
      this.editBook(nextProps.bookToEdit);
    }
  }
  editBook(book) {
    this.setState({
      tab: "basic",
      bookEditing: { ...book },
      titleMissing: false,
      authorsChanged: false
    });
  }
  render() {
    let SyncedInput = this.SyncedInput;
    let { tab, bookEditing } = this.state;
    let book = bookEditing || {};

    //Modal collects an existing book to edit, and spreads into state.  Yes, it's an anti-pattern, but it makes dealing with field changes tolerable
    //Modal eventually calls save method passed from above.
    //Parent component passes in a new book as needed to restart editing
    return (
      <Modal className="fade" isOpen={!!this.props.isOpen} onHide={() => this.closeModal()} headerCaption={this.props.title}>
        <div className="tab-headers" style={{ marginBottom: "10px" }}>
          <div className={`tab-header ${tab == "basic" ? "active" : ""}`}>
            <a onClick={() => this.setState({ tab: "basic" })}>Book info</a>
          </div>
          <div className={`tab-header ${tab == "covers" ? "active" : ""} ${!book._id ? "disabled" : ""}`}>
            <a onClick={book._id ? () => this.setState({ tab: "covers" }) : null}>Covers</a>
          </div>
        </div>
        <div className="tab-content">
          <div className={`tab-pane ${tab == "basic" ? "active" : ""}`}>
            {this.state.bookEditing ? (
              <>
                <form>
                  <div className={"form-group " + (!this.state.bookEditing.title && this.state.titleMissing ? "has-error" : "")}>
                    <label>Title</label>

                    <SyncedInput syncName="title" className="form-control" placeholder="Title (required)" onEnter={() => this.save()} />
                  </div>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label>ISBN</label>
                        <SyncedInput syncName="isbn" className="form-control" placeholder="ISBN" onEnter={() => this.save()} />
                      </div>
                    </div>

                    <div className="col-xs-6">
                      <div className="form-group">
                        <label>Pages</label>
                        <SyncedInput
                          syncName="pages"
                          type="number"
                          className="form-control"
                          placeholder="Number of pages"
                          onEnter={() => this.save()}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label>Publisher</label>
                        <SyncedInput syncName="publisher" className="form-control" placeholder="Publisher" onEnter={() => this.save()} />
                      </div>
                    </div>

                    <div className="col-xs-6">
                      <div className="form-group">
                        <label>Published</label>
                        <SyncedInput syncName="publicationDate" className="form-control" placeholder="Publication date" onEnter={() => this.save()} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {(this.state.bookEditing.authors || []).map((author, $index) => (
                      <div key={$index} className="col-xs-4">
                        <div className="form-group">
                          <label>Author</label>
                          <input
                            onKeyDown={evt => (evt.keyCode || evt.which) == 13 && this.save()}
                            onChange={this.syncAuthor($index)}
                            value={author}
                            className="form-control"
                            placeholder={`Author ${$index + 1}`}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="col-xs-12">
                      <BootstrapAnchorButton onClick={evt => this.addAuthor(evt)} preset="primary-xs">
                        <i className="fa fa-fw fa-plus" /> Add author
                      </BootstrapAnchorButton>
                      {this.state.authorsChanged ? (
                        <div style={{ marginLeft: 5 }} className="label label-primary">
                          Add as many authors as needed. Blanks will be ignored.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </form>
                <hr style={{ marginTop: 10, marginBottom: 10 }} />

                <AjaxButton
                  className="pull-right"
                  preset="primary"
                  running={this.props.isSaving}
                  disabled={this.props.isSaved}
                  runningText="Saving"
                  onClick={() => this.save()}
                >
                  {!this.props.isSaved ? (
                    "Save"
                  ) : (
                    <span>
                      Saved <i className="fa fa-fw fa-check" />
                    </span>
                  )}
                </AjaxButton>
              </>
            ) : null}
            <br />
          </div>
          <div className={`tab-pane ${tab == "covers" ? "active" : ""}`}>
            {book ? (
              <>
                <div>
                  <h6 style={{ marginBottom: "5px" }}>Small Cover</h6>
                  <ManageBookCover
                    _id={book._id}
                    remoteSave={updateSmallCover}
                    imgKey="smallImage"
                    endpoint="upload-small-cover"
                    img={book.smallImage}
                  />
                </div>
                <hr />
                <div>
                  <h6 style={{ marginBottom: "5px" }}>Medium Cover</h6>
                  <ManageBookCover
                    _id={book._id}
                    remoteSave={updateMediumCover}
                    imgKey="mediumImage"
                    endpoint="upload-medium-cover"
                    img={book.mediumImage}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </Modal>
    );
  }
}

export default ManualBookEntry;
