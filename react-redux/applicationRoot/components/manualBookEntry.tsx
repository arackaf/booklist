import React, { Component } from "react";
import BootstrapButton, { BootstrapAnchorButton, AjaxButton } from "applicationRoot/components/bootstrapButton";
import Dropzone from "react-dropzone";

import ajaxUtil from "util/ajaxUtil";
import Modal from "./modal";

class ManualBookEntry extends Component<any, any> {
  revertTo: any;
  state = { bookEditing: null, pendingSmallImage: "", titleMissing: false, authorsChanged: false, smallCoverUploadError: "" };
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
    let bookToStart = { ...book };
    this.revertTo = bookToStart;
    this.revert();
  }
  revert() {
    this.setState({
      bookEditing: this.revertTo,
      titleMissing: false,
      authorsChanged: false,
      pendingSmallImage: "",
      smallCoverUploadError: ""
    });
  }
  onDrop(files) {
    let request = new FormData();
    request.append("fileUploaded", files[0]);

    ajaxUtil.postWithFiles("/react-redux/upload", request, res => {
      if (res.error) {
        this.setState({ pendingSmallImage: "", smallCoverUploadError: res.error });
      } else {
        this.setState({ pendingSmallImage: res.smallImagePath, smallCoverUploadError: "" });
      }
    });
  }
  clearPendingSmallImage() {
    this.setState({ pendingSmallImage: "" });
  }
  render() {
    let SyncedInput = this.SyncedInput;

    //Modal collects an existing book to edit, and spreads into state.  Yes, it's an anti-pattern, but it makes dealing with field changes tolerable
    //Modal eventually calls save method passed from above.
    //Parent component passes in a new book as needed to restart editing
    return (
      <Modal className="fade" isOpen={!!this.props.isOpen} onHide={() => this.closeModal()} headerCaption={this.props.title}>
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
                  <SyncedInput syncName="pages" type="number" className="form-control" placeholder="Number of pages" onEnter={() => this.save()} />
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

            <br />
            <div className="row">
              <div className="col-xs-6">
                <Dropzone
                  acceptStyle={{ border: "3px solid var(--lightest-primary-3)" }}
                  rejectStyle={{ border: "3px solid var(--lightest-primary-2)" }}
                  activeStyle={{ border: "3px solid var(--lightest-primary-2)" }}
                  disabledStyle={{ border: "3px solid var(--lightest-primary-2)" }}
                  style={{ border: "3px solid var(--lightest-primary-2)", padding: 30 }}
                  onDrop={files => this.onDrop(files)}
                  multiple={false}
                >
                  <div>{this.props.dragTitle}</div>
                </Dropzone>
              </div>
              <div className="col-xs-6">
                {this.state.pendingSmallImage ? (
                  <div>
                    <img src={this.state.pendingSmallImage} />
                    <br />
                    <br />
                    <BootstrapAnchorButton preset="danger-xs" onClick={() => this.clearPendingSmallImage()}>
                      Clear image
                    </BootstrapAnchorButton>
                  </div>
                ) : null}
                {this.state.smallCoverUploadError ? <div className="label label-danger">{this.state.smallCoverUploadError}</div> : null}
              </div>
            </div>
          </form>
        ) : null}
        {false && this.props.successMessage ? (
          <div className="alert alert-success alert-slim" style={{ marginTop: 10, marginBottom: 0 }}>
            {this.props.successMessage}
          </div>
        ) : null}
        <hr style={{ marginTop: 10, marginBottom: 10 }} />
        <BootstrapButton preset="danger-xs" onClick={() => (this.props.isSaved ? this.props.startOver() : this.revert())}>
          Clear all
        </BootstrapButton>
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
