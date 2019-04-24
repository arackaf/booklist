import React, { Component, useState, useMemo } from "react";
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
  state = { tab: "basic", bookEditing: null, titleMissing: false };

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
      titleMissing: false
    });
  }
  render() {
    let { tab, bookEditing } = this.state;
    let { isSaved, isSaving, saveBook } = this.props;
    let book = bookEditing;
    let bookSaved = book && book._id;

    return (
      <Modal className="fade" isOpen={!!this.props.isOpen} onHide={() => this.closeModal()} headerCaption={this.props.title}>
        <div className="tab-headers" style={{ marginBottom: "10px" }}>
          <div className={`tab-header ${tab == "basic" ? "active" : ""}`}>
            <a onClick={() => this.setState({ tab: "basic" })}>Book info</a>
          </div>
          <div className={`tab-header ${tab == "covers" ? "active" : ""} ${!bookSaved ? "disabled" : ""}`}>
            <a onClick={bookSaved ? () => this.setState({ tab: "covers" }) : null}>Covers</a>
          </div>
        </div>
        <div className="tab-content">
          <div className={`tab-pane ${tab == "basic" ? "active" : ""}`}>
            {book ? <EditBookInfo {...{ book, isSaved, isSaving, saveBook }} /> : null}
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

const EditBookInfo = props => {
  const { book: bookFromProps, saveBook, isSaved, isSaving } = props;
  const [book, setBook] = useState(bookFromProps);
  const [titleMissing, setTitleMissing] = useState(bookFromProps);

  const syncStateFromInput = name => evt => setBook(book => ({ ...book, [name]: evt.target.value }));

  const SyncedInput = ({ syncName, onEnter, ...props }) => (
    <input
      onKeyDown={evt => (evt.keyCode || evt.which) == 13 && onEnter()}
      onChange={syncStateFromInput(syncName)}
      value={book[syncName] || ""}
      {...props}
    />
  );

  const save = () => {
    if (!book.title) {
      setTitleMissing(true);
    } else {
      setTitleMissing(false);

      //trim out empty authors now, so they're not applied in the reducer, and show up as empty entries on subsequent edits
      let bookToSave = { ...book, authors: book.authors.filter(a => a) };
      Promise.resolve(saveBook(bookToSave)).then(savedBook => {
        book && setBook(book => ({ ...book, _id: savedBook._id }));
      });
    }
  };

  const syncAuthor = index => evt => {
    let newAuthors = book.authors.concat();
    newAuthors[index] = evt.target.value;
    setBook(book => ({ ...book, authors: newAuthors }));
  };
  const addAuthor = evt => {
    evt.preventDefault();
    setBook(book => ({ ...book, authors: book.authors.concat("") }));
  };

  return (
    <>
      <form>
        <div className={"form-group " + (!book.title && titleMissing ? "has-error" : "")}>
          <label>Title</label>

          <SyncedInput syncName="title" className="form-control" placeholder="Title (required)" onEnter={() => save()} />
        </div>
        <div className="row">
          <div className="col-xs-6">
            <div className="form-group">
              <label>ISBN</label>
              <SyncedInput syncName="isbn" className="form-control" placeholder="ISBN" onEnter={() => save()} />
            </div>
          </div>

          <div className="col-xs-6">
            <div className="form-group">
              <label>Pages</label>
              <SyncedInput syncName="pages" type="number" className="form-control" placeholder="Number of pages" onEnter={() => save()} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <div className="form-group">
              <label>Publisher</label>
              <SyncedInput syncName="publisher" className="form-control" placeholder="Publisher" onEnter={() => save()} />
            </div>
          </div>

          <div className="col-xs-6">
            <div className="form-group">
              <label>Published</label>
              <SyncedInput syncName="publicationDate" className="form-control" placeholder="Publication date" onEnter={() => save()} />
            </div>
          </div>
        </div>
        <div className="row">
          {(book.authors || []).map((author, $index) => (
            <div key={$index} className="col-xs-4">
              <div className="form-group">
                <label>Author</label>
                <input
                  onKeyDown={evt => (evt.keyCode || evt.which) == 13 && save()}
                  onChange={syncAuthor($index)}
                  value={author}
                  className="form-control"
                  placeholder={`Author ${$index + 1}`}
                />
              </div>
            </div>
          ))}
          <div className="col-xs-12">
            <BootstrapAnchorButton onClick={evt => addAuthor(evt)} preset="default-xs">
              <i className="fa fa-fw fa-plus" /> Add author
            </BootstrapAnchorButton>
          </div>
        </div>
      </form>
      <hr style={{ marginTop: "20px", marginBottom: "10px" }} />

      <AjaxButton className="pull-right" preset="primary" running={isSaving} disabled={isSaved} runningText="Saving" onClick={() => save()}>
        {!isSaved ? (
          "Save"
        ) : (
          <span>
            Saved <i className="fa fa-fw fa-check" />
          </span>
        )}
      </AjaxButton>
    </>
  );
};

export default ManualBookEntry;
