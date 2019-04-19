import React, { Component, useState } from "react";
import BootstrapButton, { BootstrapAnchorButton, AjaxButton } from "applicationRoot/components/bootstrapButton";
import Dropzone from "react-dropzone";

import ajaxUtil from "util/ajaxUtil";
import Modal from "./modal";

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
    Promise.resolve(props.save()).then(() => setSaving(false));
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
  const { img, url } = props;
  const [uploadState, setUploadState] = useState({ pendingImg: "", uploadError: "" });

  const onDrop = files => {
    let request = new FormData();
    request.append("fileUploaded", files[0]);

    ajaxUtil.postWithFiles(`/react-redux/${url}`, request, res => {
      if (res.error) {
        setUploadState({ pendingImg: "", uploadError: res.error });
      } else {
        setUploadState({ pendingImg: res.smallImagePath, uploadError: "" });
      }
    });
  };

  const { pendingImg, uploadError } = uploadState;
  return (
    <div style={{ display: "flex", flexFlow: "row wrap" }}>
      <div className="margin-right">{img ? <img crossOrigin="anonymous" src={img} /> : <span className="alert alert-warning">No Cover</span>}</div>
      {!pendingImg ? (
        <div className="margin-right" style={{ minWidth: "100px", maxWidth: "140px" }}>
          <Dropzone
            acceptStyle={{ border: "3px solid var(--primary-8)" }}
            rejectStyle={{ border: "3px solid var(--primary-9)" }}
            activeStyle={{ border: "3px solid var(--primary-9)" }}
            disabledStyle={{ border: "3px solid var(--primary-9)" }}
            style={{ border: "3px solid var(--primary-9)", padding: "5px", fontSize: "14px", textAlign: "center" }}
            onDrop={files => onDrop(files)}
            multiple={false}
          >
            <div>{props.dragTitle}</div>
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
            <button className="btn btn-xs btn-light btn-round-icon">
              <i className="fal fa-check" />
            </button>
            <button className="btn btn-xs btn-light btn-round-icon" style={{ marginLeft: "auto" }} onClick={() => this.clearPendingSmallImage()}>
              <i className="fal fa-undo" />
            </button>
          </div>
        </div>
      ) : null}
      <div>
        <RemoteImageUpload />
      </div>
    </div>
  );
};

class ManualBookEntry extends Component<any, any> {
  state = { tab: "basic", bookEditing: null, pendingSmallImage: "", titleMissing: false, authorsChanged: false, smallCoverUploadError: "" };
  syncStateFromInput = name => evt => this.setState({ bookEditing: { ...this.state.bookEditing, [name]: evt.target.value } });
  SyncedInput = ({ syncName, onEnter, ...props }) => (
    <input
      onKeyDown={evt => (evt.keyCode || evt.which) == 13 && props.onEnter()}
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
      if (this.state.pendingSmallImage) {
        bookToSave.smallImage = this.state.pendingSmallImage; //only send it if there is one
      }
      this.props.saveBook(bookToSave);
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
      tab: "covers",
      bookEditing: { ...book },
      titleMissing: false,
      authorsChanged: false,
      pendingSmallImage: "",
      smallCoverUploadError: ""
    });
  }
  clearPendingSmallImage() {
    this.setState({ pendingSmallImage: "" });
  }
  render() {
    let SyncedInput = this.SyncedInput;
    let { tab, bookEditing, pendingSmallImage, smallCoverUploadError } = this.state;

    //Modal collects an existing book to edit, and spreads into state.  Yes, it's an anti-pattern, but it makes dealing with field changes tolerable
    //Modal eventually calls save method passed from above.
    //Parent component passes in a new book as needed to restart editing
    return (
      <Modal className="fade" isOpen={!!this.props.isOpen} onHide={() => this.closeModal()} headerCaption={this.props.title}>
        <div className="tab-headers" style={{ marginBottom: "15px" }}>
          <div className={`tab-header ${tab == "basic" ? "active" : ""}`}>
            <a onClick={() => this.setState({ tab: "basic" })}>Book info</a>
          </div>
          <div className={`tab-header ${tab == "covers" ? "active" : ""}`}>
            <a onClick={() => this.setState({ tab: "covers" })}>Covers</a>
          </div>
        </div>
        <div className="tab-content">
          <div className={`tab-pane ${tab == "basic" ? "active" : ""}`}>
            {this.state.bookEditing ? (
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
            ) : null}
            <br />
          </div>
          <div className={`tab-pane ${tab == "covers" ? "active" : ""}`}>
            {bookEditing ? <ManageBookCover url="upload-small-cover" img={bookEditing.smallImage} /> : null}
          </div>
        </div>
        <hr style={{ marginTop: 10, marginBottom: 10 }} />
        &nbsp;
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
      </Modal>
    );
  }
}

export default ManualBookEntry;
