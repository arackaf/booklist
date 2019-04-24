import React, { Component } from "react";

import Modal from "../modal";
import ManageBookCover from "./manageBookCover";
import EditBookInfo from "./editBookInfo";

import { updateSmallCover, updateMediumCover } from "util/coverUpdates";

class ManualBookEntry extends Component<any, any> {
  state = { tab: "basic", bookEditing: null };

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
  updateBook = updateFn => {
    this.setState({ bookEditing: updateFn(this.state.bookEditing) });
  };
  editBook(book) {
    this.setState({
      tab: "basic",
      bookEditing: { ...book }
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
            {book ? <EditBookInfo {...{ book, isSaved, isSaving, saveBook }} updateBook={this.updateBook} /> : null}
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
